<?php

namespace Tests\Feature\Acceptance;

use App\Jobs\GetPatientTests;
use App\Models\Acceptance;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PatientStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_patients_only_see_processing_or_reported(): void
    {
        $item = fn ($id, $status) => ["id" => $id, "status" => $status, "test" => ["name" => "Test $id"], "timeline" => []];
        $acceptance = fn ($id, $status, $items) => ["id" => $id, "status" => $status, "created_at" => now()->toDateTimeString(), "updated_at" => now()->toDateTimeString(), "acceptance_items" => $items];

        Http::fake([
            "*" => Http::response(["patient" => ["fullName" => "Patient", "acceptances" => [
                $acceptance(1, "waiting for payment", [$item(11, "sampling"), $item(12, null)]),
                $acceptance(2, "waiting for financial approval", [$item(21, "registering")]),
                $acceptance(3, "reported", [$item(31, "reported")]),
                $acceptance(4, "Canceled", [$item(41, "processing")]),
            ]]]),
        ]);
        cache()->put("sanctumToken", encrypt("token"));

        $customer = Customer::create(["name" => "P", "mobile" => "96890000000", "last_otp_request" => now()]);
        GetPatientTests::dispatchSync($customer, "A123");

        $stored = Acceptance::with("acceptanceItems")->get()->keyBy("server_id");
        $this->assertSame(["1", "2", "3"], $stored->keys()->map(fn ($k) => (string) $k)->sort()->values()->all());
        $this->assertSame("processing", $stored[1]->status);
        $this->assertSame("processing", $stored[2]->status);
        $this->assertSame("reported", $stored[3]->status);
        $this->assertSame(["processing", "processing"], $stored[1]->acceptanceItems->pluck("status")->all());
        $this->assertSame(["reported"], $stored[3]->acceptanceItems->pluck("status")->all());
    }

    public function test_old_rows_with_lab_stages_read_as_processing(): void
    {
        $customer = Customer::create(["name" => "P", "mobile" => "96890000001", "last_otp_request" => now()]);
        $acceptance = new Acceptance(["server_id" => 9, "status" => "waiting for publishing"]);
        $acceptance->customer()->associate($customer->id);
        $acceptance->save();

        $this->assertSame("processing", $acceptance->fresh()->status);
    }
}
