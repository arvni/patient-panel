<?php

namespace App\Http\Controllers;

use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use Inertia\Inertia;

class ShowAcceptanceItemReportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Acceptance $acceptance, AcceptanceItem $acceptanceItem)
    {
        abort_if($acceptance->customer_id !== auth()->user()->id || $acceptance->id !== $acceptanceItem->acceptance_id, 403);
        abort_if($acceptanceItem->Acceptance->status !== "reported", 400, "Report is not Ready yet");
        return Inertia::render("Acceptance/Report", [
            "acceptanceItem" => $acceptanceItem,
            "acceptance" => $acceptance,
        ]);
    }
}
