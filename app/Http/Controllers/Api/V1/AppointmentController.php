<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Get list of appointments
     */
    public function index(Request $request)
    {
        \Log::info('Appointments index called');
        try {
            $user = $request->user();

            $appointments = $user->reservations()
                ->with(['Time', 'Time.Doctor'])
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            \Log::info('Appointments loaded', ['count' => $appointments->count()]);

            return response()->json([
                'success' => true,
                'data' => $appointments->map(function ($reservation) {
                    $time = $reservation->Time;
                    $doctor = $time->Doctor ?? null;

                    // Handle started_at - could be Carbon instance or string
                    $startedAt = null;
                    $date = null;
                    $timeStr = null;

                    if ($time && $time->started_at) {
                        try {
                            $startedAt = $time->started_at instanceof \Carbon\Carbon
                                ? $time->started_at
                                : \Carbon\Carbon::parse($time->started_at);
                            $date = $startedAt->format('Y-m-d');
                            $timeStr = $startedAt->format('H:i');
                        } catch (\Exception $e) {
                            \Log::warning('Failed to parse started_at', ['started_at' => $time->started_at]);
                        }
                    }

                    return [
                        'id' => $reservation->id,
                        'date' => $date,
                        'time' => $timeStr,
                        'type' => $reservation->type,
                        'status' => $reservation->verified_at ? 'verified' : 'pending',
                        'doctor' => [
                            'id' => $doctor->id ?? null,
                            'name' => $doctor->title ?? 'N/A',
                        ],
                        'time_slot' => $time ? $time->title : 'N/A',
                        'notes' => $reservation->information,
                        'created_at' => $reservation->created_at->toDateTimeString(),
                    ];
                }),
                'pagination' => [
                    'current_page' => $appointments->currentPage(),
                    'last_page' => $appointments->lastPage(),
                    'per_page' => $appointments->perPage(),
                    'total' => $appointments->total(),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Appointments index error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointments.'
            ], 500);
        }
    }

    /**
     * Get single appointment details
     */
    public function show(Request $request, Reservation $appointment)
    {
        \Log::info('Appointment show called', ['id' => $appointment->id]);
        try {
            // Check if appointment belongs to user
            if ($appointment->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            $appointment->load(['Time', 'Time.Doctor']);
            $time = $appointment->Time;
            $doctor = $time->Doctor ?? null;

            // Handle started_at - could be Carbon instance or string
            $startedAt = null;
            $date = null;
            $timeStr = null;

            if ($time && $time->started_at) {
                try {
                    $startedAt = $time->started_at instanceof \Carbon\Carbon
                        ? $time->started_at
                        : \Carbon\Carbon::parse($time->started_at);
                    $date = $startedAt->format('Y-m-d');
                    $timeStr = $startedAt->format('H:i');
                } catch (\Exception $e) {
                    \Log::warning('Failed to parse started_at in show', ['started_at' => $time->started_at]);
                }
            }

            // Extract meeting information if available
            $meetingInfo = null;
            if ($appointment->information && isset($appointment->information['room'])) {
                $roomData = $appointment->information['room'];
                if (isset($roomData['status']) && $roomData['status'] && isset($roomData['data'])) {
                    $meetingInfo = [
                        'join_url' => $roomData['data']['join_url'] ?? null,
                        'password' => $roomData['data']['password'] ?? null,
                        'meeting_id' => $roomData['data']['id'] ?? null,
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $appointment->id,
                    'date' => $date,
                    'time' => $timeStr,
                    'type' => $appointment->type,
                    'status' => $appointment->verified_at ? 'verified' : 'pending',
                    'doctor' => [
                        'id' => $doctor->id ?? null,
                        'name' => $doctor->title ?? 'N/A',
                        'specialization' => $doctor->specialty ?? null,
                    ],
                    'time_slot' => $time ? $time->title : 'N/A',
                    'notes' => is_string($appointment->information) ? $appointment->information : null,
                    'meeting_info' => $meetingInfo,
                    'created_at' => $appointment->created_at->toDateTimeString(),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Appointment show error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointment details.'
            ], 500);
        }
    }

    /**
     * Create new appointment
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'clinic_id' => 'required|exists:clinics,id',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $appointment = Reservation::create([
                'customer_id' => $request->user()->id,
                'doctor_id' => $request->doctor_id,
                'clinic_id' => $request->clinic_id,
                'reservation_date' => $request->reservation_date,
                'reservation_time' => $request->reservation_time,
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment created successfully.',
                'data' => [
                    'id' => $appointment->id,
                    'date' => $appointment->reservation_date,
                    'time' => $appointment->reservation_time,
                    'status' => $appointment->status,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create appointment.'
            ], 500);
        }
    }

    /**
     * Cancel appointment
     */
    public function destroy(Request $request, Reservation $appointment)
    {
        \Log::info('Cancel appointment called', ['appointment_id' => $appointment->id, 'user_id' => $request->user()->id]);

        try {
            // Check if appointment belongs to user
            if ($appointment->customer_id !== $request->user()->id) {
                \Log::warning('Unauthorized cancel attempt', ['appointment_customer_id' => $appointment->customer_id, 'user_id' => $request->user()->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            // Load the time relationship to check status
            $appointment->load('Time');

            // Soft delete by setting verified_at to null and marking time as disabled
            if ($appointment->Time) {
                $appointment->Time->update(['disabled' => true]);
            }

            // Delete the reservation
            $appointment->delete();

            \Log::info('Appointment cancelled successfully', ['appointment_id' => $appointment->id]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment cancelled successfully.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Cancel appointment error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel appointment.'
            ], 500);
        }
    }

    /**
     * Generate calendar file for appointment
     */
    public function calendar(Request $request, Reservation $appointment)
    {
        \Log::info('Calendar endpoint called', ['appointment_id' => $appointment->id, 'user_id' => $request->user()->id]);

        try {
            // Check if appointment belongs to user
            if ($appointment->customer_id !== $request->user()->id) {
                \Log::warning('Unauthorized calendar access', ['appointment_customer_id' => $appointment->customer_id, 'user_id' => $request->user()->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            $appointment->load(['Time', 'Time.Doctor']);
            $time = $appointment->Time;
            $doctor = $time->Doctor ?? null;

            if (!$time || !$time->started_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment time not available.'
                ], 400);
            }

            // Parse dates
            $startedAt = $time->started_at instanceof \Carbon\Carbon
                ? $time->started_at
                : Carbon::parse($time->started_at);

            $endedAt = $time->ended_at instanceof \Carbon\Carbon
                ? $time->ended_at
                : Carbon::parse($time->ended_at);

            // Generate calendar event data
            $doctorName = $doctor->title ?? 'Doctor';
            $summary = "Medical Appointment with Dr. {$doctorName}";
            $description = "Appointment Type: " . ($appointment->type == 1 ? 'In-Person' : 'Online');

            // Add meeting URL if available
            if ($appointment->information && isset($appointment->information['room'])) {
                $roomData = $appointment->information['room'];
                if (isset($roomData['status']) && $roomData['status'] && isset($roomData['data']['join_url'])) {
                    $description .= "\\nMeeting Link: " . $roomData['data']['join_url'];
                    if (isset($roomData['data']['password'])) {
                        $description .= "\\nPassword: " . $roomData['data']['password'];
                    }
                }
            }

            $location = $appointment->type == 1 ? 'Medical Clinic' : 'Online Meeting';

            // Return calendar data for the mobile app
            return response()->json([
                'success' => true,
                'data' => [
                    'title' => $summary,
                    'description' => $description,
                    'location' => $location,
                    'startDate' => $startedAt->toIso8601String(),
                    'endDate' => $endedAt->toIso8601String(),
                    'timezone' => 'Asia/Muscat',
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Calendar generation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate calendar event.'
            ], 500);
        }
    }
}
