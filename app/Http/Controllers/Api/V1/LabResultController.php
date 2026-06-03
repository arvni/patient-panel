<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Services\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LabResultController extends Controller
{
    /**
     * Get list of lab test acceptances
     */
    public function index(Request $request)
    {
        \Log::info('Lab results index called', ['user_id' => $request->user()->id]);

        try {
            $user = $request->user();

            $acceptances = $user->acceptances()
                ->with(['acceptanceItems'])
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            \Log::info('Lab results loaded', ['count' => $acceptances->count()]);

            return response()->json([
                'success' => true,
                'data' => $acceptances->map(function ($acceptance) {
                    return [
                        'id' => $acceptance->id,
                        'acceptance_number' => $acceptance->server_id ?? $acceptance->id,
                        'date' => $acceptance->created_at->toDateString(),
                        'status' => $acceptance->status,
                        'total_items' => $acceptance->acceptanceItems->count(),
                        'pending_items' => $acceptance->acceptanceItems->where('status', 'pending')->count(),
                        'completed_items' => $acceptance->acceptanceItems->where('status', 'completed')->count(),
                    ];
                }),
                'pagination' => [
                    'current_page' => $acceptances->currentPage(),
                    'last_page' => $acceptances->lastPage(),
                    'per_page' => $acceptances->perPage(),
                    'total' => $acceptances->total(),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Lab results index error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to load lab results.'
            ], 500);
        }
    }

    /**
     * Get single acceptance details with all items
     */
    public function show(Request $request, Acceptance $acceptance)
    {
        try {
            // Check if acceptance belongs to user
            if ($acceptance->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            $acceptance->load(['acceptanceItems']);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $acceptance->id,
                    'acceptance_number' => $acceptance->server_id ?? $acceptance->id,
                    'date' => $acceptance->created_at->toDateString(),
                    'status' => $acceptance->status,
                    'items' => $acceptance->acceptanceItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'test_name' => $item->test ?? 'N/A',
                            'test_code' => $item->server_id ?? 'N/A',
                            'status' => $item->status,
                            'result' => null,
                            'normal_range' => null,
                            'unit' => null,
                            'notes' => null,
                            'has_report' => !empty($item->report),
                        ];
                    }),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load acceptance details.'
            ], 500);
        }
    }

    /**
     * Get single test item details
     */
    public function showItem(Request $request, Acceptance $acceptance, AcceptanceItem $item)
    {
        try {
            // Check if acceptance belongs to user
            if ($acceptance->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            // Check if item belongs to acceptance
            if ($item->acceptance_id !== $acceptance->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item not found in this acceptance.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $item->id,
                    'acceptance_number' => $acceptance->server_id ?? $acceptance->id,
                    'test_name' => $item->test ?? 'N/A',
                    'test_code' => $item->server_id ?? 'N/A',
                    'status' => $item->status,
                    'result' => null,
                    'normal_range' => null,
                    'unit' => null,
                    'notes' => null,
                    'report_path' => $item->report,
                    'has_report' => !empty($item->report),
                    'date' => $acceptance->created_at->toDateString(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load test item details.'
            ], 500);
        }
    }

    /**
     * Download test report PDF
     */
    public function downloadReport(Request $request, Acceptance $acceptance, AcceptanceItem $item)
    {
        try {
            // Check if acceptance belongs to user
            if ($acceptance->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            // Check if item belongs to acceptance
            if ($item->acceptance_id !== $acceptance->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item not found in this acceptance.'
                ], 404);
            }

            // Fetch report from API service
            $report = ApiService::getReport($item->server_id);

            if (!$report->ok()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Report not available.'
                ], 404);
            }

            // Store report in local storage
            $fileName = "Users/" . $request->user()->id . "/$acceptance->id/AcceptanceItems/" . $item->id;

            if (Storage::exists($fileName)) {
                Storage::delete($fileName);
            }

            Storage::disk('local')->put($fileName, $report);

            // Extract filename from Content-Disposition header
            $contentDisposition = $report->header('Content-Disposition');
            $fN = Str::uuid(); // Default filename if not found

            if ($contentDisposition) {
                if (preg_match('/filename="([^"]+)"/', $contentDisposition, $matches)) {
                    $fN = $matches[1];
                }
            }

            return Response::download(storage_path("app/" . $fileName), $fN);
        } catch (\Exception $e) {
            \Log::error('Download report error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to download report.'
            ], 500);
        }
    }
}
