<?php

namespace App\Http\Controllers;

use App\Jobs\GetPatientTests;
use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Models\CustomerNationalId;
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
        $customer = auth("customer")->user();
        $nationalIds = $customer->nationalIds()->orderBy("created_at")->get(["national_id", "name"]);

        // Resolve the currently selected national ID, dropping anything no
        // longer owned by this customer.
        $selected = session("lab_national_id");
        if ($selected && !$nationalIds->contains("national_id", $selected)) {
            $selected = null;
            session()->forget("lab_national_id");
        }

        // No national ID chosen yet: show the picker / add screen, no results.
        if (!$selected) {
            return Inertia::render("Acceptance/Index", [
                "nationalIds" => $nationalIds,
                "selectedNationalId" => null,
                "acceptances" => null,
                "request" => $request->all(),
            ]);
        }

        // Results are refreshed synchronously when a national ID is selected or
        // added, so listing/pagination here just reads the local copy.
        $query = $customer->acceptances()->where("national_id", $selected);
        if ($request->has("filters.date"))
            $query->whereBetween("created_at", $request->get("filters.date"));
        if ($request->has("filters.search"))
            $query->search($request->get("filters.search"));
        $acceptances = fn() => $query->paginate($request->get("pageSize", 20));

        return Inertia::render("Acceptance/Index", [
            "nationalIds" => $nationalIds,
            "selectedNationalId" => $selected,
            "acceptances" => $acceptances,
            "request" => $request->all(),
        ]);
    }

    /**
     * Show the "add a national ID" screen.
     */
    public function createNationalId()
    {
        return Inertia::render("Acceptance/AddNationalId");
    }

    /**
     * Look the national ID up against the lab (by phone + national ID) and,
     * if a patient is found, show it for confirmation before saving anything.
     */
    public function lookupNationalId(Request $request)
    {
        $data = $request->validate([
            "national_id" => ["required", "string", "regex:/^\d{4,20}$/"],
        ]);

        $customer = auth("customer")->user();
        $nationalId = trim($data["national_id"]);

        $response = ApiService::getAcceptances($customer, $nationalId);
        $patient = $response->ok() ? $response->json("patient") : null;

        if (!$patient) {
            return back()->withErrors([
                "national_id" => __("No patient was found for this National ID under your phone number."),
            ]);
        }

        return Inertia::render("Acceptance/ConfirmNationalId", [
            "nationalId" => $nationalId,
            "patient" => [
                "fullName" => $patient["fullName"] ?? null,
                "dateOfBirth" => $patient["dateOfBirth"] ?? null,
                "gender" => $patient["gender"] ?? null,
                "acceptancesCount" => count($patient["acceptances"] ?? []),
            ],
        ]);
    }

    /**
     * Confirm and persist a national ID for the customer, then pull its results.
     */
    public function storeNationalId(Request $request)
    {
        $data = $request->validate([
            "national_id" => ["required", "string", "regex:/^\d{4,20}$/"],
        ]);

        $customer = auth("customer")->user();
        $nationalId = trim($data["national_id"]);

        // Re-verify against the lab on submit; never trust a client-supplied
        // name or "exists" flag.
        $response = ApiService::getAcceptances($customer, $nationalId);
        $patient = $response->ok() ? $response->json("patient") : null;

        if (!$patient) {
            return redirect()->route("acceptances.nationalId.create")->withErrors([
                "national_id" => __("No patient was found for this National ID under your phone number."),
            ]);
        }

        CustomerNationalId::updateOrCreate(
            ["customer_id" => $customer->id, "national_id" => $nationalId],
            ["name" => $patient["fullName"] ?? null],
        );

        // Pull results synchronously so they're ready on the next screen.
        GetPatientTests::dispatchSync($customer, $nationalId);
        session(["lab_national_id" => $nationalId]);

        return redirect()->route("acceptances.index");
    }

    /**
     * Switch to viewing the results of an already-saved national ID.
     */
    public function selectNationalId(Request $request)
    {
        $data = $request->validate([
            "national_id" => ["required", "string"],
        ]);

        $customer = auth("customer")->user();
        if (!$customer->nationalIds()->where("national_id", $data["national_id"])->exists())
            abort(403);

        session(["lab_national_id" => $data["national_id"]]);

        // Check the lab synchronously so the renewed list is ready on the next
        // screen, instead of arriving later via the background queue.
        GetPatientTests::dispatchSync($customer, $data["national_id"]);

        return redirect()->route("acceptances.index");
    }

    public function show(Acceptance $acceptance)
    {
        if ($acceptance->customer_id !== auth("customer")->user()->id)
            abort(403);
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
