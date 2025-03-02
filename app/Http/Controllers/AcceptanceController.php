<?php

namespace App\Http\Controllers;

use App\Jobs\GetPatientTests;
use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Services\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AcceptanceController extends Controller
{
    protected Acceptance $acceptance;
    protected ApiService $apiService;

    public function __construct(Acceptance $acceptance)
    {
        $this->acceptance = $acceptance;
        $this->middleware("indexProvider")->only("index");
    }


    public function index(Request $request)
    {
        $query = auth("customer")->user()->Acceptances();
        if ($request->has("filters.date"))
            $query->whereBetween("created_at", $request->get("filters.date"));
        if ($request->has("filters.search"))
            $query->search($request->get("filters.search"));
        $acceptances = fn() => $query->paginate($request->get("pageSize", 20));
        $request = $request->all();
        GetPatientTests::dispatch(auth()->user());
        return Inertia::render("Acceptance/Index", compact("acceptances", "request"));
    }

    public function show(Acceptance $acceptance)
    {
        $acceptance->load("AcceptanceItems");
        return Inertia::render("Acceptance/Show", compact("acceptance"));
    }

    public function report(Acceptance $acceptance,AcceptanceItem $acceptanceItem)
    {
        $acceptanceItem->load("Acceptance");
        if ($acceptanceItem->Acceptance->customer_id !== auth()->user()->id)
            abort(403);
        $acceptance = $acceptanceItem->Acceptance->id;
        $fileName = "Users/" . auth()->user()->id . "/$acceptance/AcceptanceItems/" . $acceptanceItem->id;
        $report = ApiService::getReport($acceptanceItem->server_id);
        if (!$report->ok())
            abort("400", "File not found");
        if (Storage::exists($fileName))
            Storage::delete($fileName);
        Storage::disk('local')->put($fileName, $report);

        $contentDisposition = $report->header('Content-Disposition');

        // Initialize the file name
        $fN = Str::uuid(); // Default filename if not found

        if ($contentDisposition) {
            // Parse the filename from the Content-Disposition header
            if (preg_match('/filename="([^"]+)"/', $contentDisposition, $matches)) {
                $fN = $matches[1]; // Extracted filename
            }
        }
        return Response::download(storage_path("app/" . $fileName),$fN);
    }


}
