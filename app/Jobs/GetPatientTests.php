<?php

namespace App\Jobs;

use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Models\User;
use App\Services\ApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GetPatientTests implements ShouldQueue//, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds after which the job's unique lock will be released.
     *
     * @var int
     */
//    public $uniqueFor = 3600;

    /**
     * Get the unique ID for the job.
     */
//    public function uniqueId(): string
//    {
//        return $this->user->mobile;
//    }

    /**
     * Create a new job instance.
     * @param User $user
     */
    public function __construct(public User $user,)
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
        $response = ApiService::getAcceptances($this->user);
        if ($response->ok()) {
            $patient = $response->json("patient");
            $user->fill(["name" => $patient["fullName"]]);
            if ($this->user->isDirty())
                $this->user->save();
            $acceptanceIds = [];
            foreach ($patient["acceptances"] as $acceptanceData) {
                $acceptance = Acceptance::where("server_id", $acceptanceData['id'])->first();
                if (!$acceptance) {
                    $acceptance = new Acceptance();
                }

                $acceptance->fill([
                    "server_id" => $acceptanceData["id"],
                    "status" => $acceptanceData["status"],
                    "created_at" => $acceptanceData["created_at"],
                    "updated_at" => $acceptanceData["updated_at"]
                ]);
                $acceptance->User()->associate($user->id);
                if ($acceptance->isDirty())
                    $acceptance->save();
                $ids = [];
                foreach ($acceptanceData["acceptance_items"] as $acceptanceItemData) {
                    $acceptanceItem = $acceptance->AcceptanceItems()->where("server_id", $acceptanceItemData["id"])->first();
                    if (!$acceptanceItem)
                        $acceptanceItem = new AcceptanceItem();
                    $acceptanceItem->fill([
                        "server_id" => $acceptanceItemData["id"],
                        "test" => $acceptanceItemData["method"]["test"]["name"],
                        "status" => $acceptanceItemData["status"],
                        "timeline" => $this->convertTimeline($acceptanceItemData["timeline"]),
                        "report" => isset($acceptanceItemData["report"]) ? $acceptanceItemData["report"]["id"] : null,
                        "created_at" => $acceptanceData["created_at"],
                        "updated_at" => $acceptanceData["updated_at"]
                    ]);
                    $acceptanceItem->Acceptance()->associate($acceptance->id);
                    if ($acceptanceItem->isDirty())
                        $acceptanceItem->save();
                    $ids[] = $acceptanceItemData["id"];
                }
                $acceptance->AcceptanceItems()->whereNotIn("server_id", $ids)->delete();
                $acceptanceIds[] = $acceptanceData["id"];
            }
            $user->Acceptances()->whereNotIn("server_id", $acceptanceIds)->delete();
        } elseif ($response->notFound() === 404)
            $user->Acceptances()->delete();

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
