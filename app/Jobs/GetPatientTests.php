<?php

namespace App\Jobs;

use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Models\Customer;
use App\Models\CustomerNationalId;
use App\Services\ApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GetPatientTests implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @param Customer $user
     * @param string $nationalId The national ID (patient idNo) whose results to sync.
     *                           Required: results are never synced by phone alone.
     */
    public function __construct(public Customer $user, public string $nationalId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->updateAcceptances();
    }

    private function updateAcceptances()
    {
        $user = $this->user;
        $response = ApiService::getAcceptances($user, $this->nationalId);
        if ($response->ok()) {
            $patient = $response->json("patient");

            // Keep the stored name for this national ID fresh.
            CustomerNationalId::where("customer_id", $user->id)
                ->where("national_id", $this->nationalId)
                ->update(["name" => $patient["fullName"] ?? null]);

            $acceptanceIds = [];
            foreach ($patient["acceptances"] as $acceptanceData) {
                $acceptance = Acceptance::where("server_id", $acceptanceData['id'])->first();
                if (!$acceptance) {
                    $acceptance = new Acceptance();
                }

                $acceptance->fill([
                    "server_id" => $acceptanceData["id"],
                    "national_id" => $this->nationalId,
                    "status" => $acceptanceData["status"],
                    "created_at" => $acceptanceData["created_at"],
                    "updated_at" => $acceptanceData["updated_at"]
                ]);
                $acceptance->customer()->associate($user->id);
                if ($acceptance->isDirty())
                    $acceptance->save();
                $ids = [];
                foreach ($acceptanceData["acceptance_items"] as $acceptanceItemData) {
                    $acceptanceItem = $acceptance->acceptanceItems()->where("server_id", $acceptanceItemData["id"])->first();
                    if (!$acceptanceItem)
                        $acceptanceItem = new AcceptanceItem();
                    $acceptanceItem->fill([
                        "server_id" => $acceptanceItemData["id"],
                        "test" => data_get($acceptanceItemData, "test.name"),
                        // The lab returns a null status for items whose method
                        // has no workflow yet; fall back to the earliest state so
                        // the non-null enum column accepts it.
                        "status" => data_get($acceptanceItemData, "status") ?? "registering",
                        "timeline" => $this->convertTimeline($acceptanceItemData["timeline"] ?? []),
                        "report" => isset($acceptanceItemData["report"]) ? $acceptanceItemData["report"]["id"] : null,
                        "created_at" => $acceptanceData["created_at"],
                        "updated_at" => $acceptanceData["updated_at"]
                    ]);
                    $acceptanceItem->acceptance()->associate($acceptance->id);
                    if ($acceptanceItem->isDirty())
                        $acceptanceItem->save();
                    $ids[] = $acceptanceItemData["id"];
                }
                $acceptance->acceptanceItems()->whereNotIn("server_id", $ids)->delete();
                $acceptanceIds[] = $acceptanceData["id"];
            }
            // Only prune results belonging to this national ID, so other
            // national IDs stored for the same customer are left untouched.
            $user->acceptances()
                ->where("national_id", $this->nationalId)
                ->whereNotIn("server_id", $acceptanceIds)
                ->delete();
        } elseif ($response->notFound()) {
            $user->acceptances()->where("national_id", $this->nationalId)->delete();
        }
    }


    private function convertTimeline(array $timeline)
    {
        $output = [];
        $i = 1;
        foreach ($timeline as $key => $value) {
            $output[$i++] = $key;
        }
        return $output;
    }

}
