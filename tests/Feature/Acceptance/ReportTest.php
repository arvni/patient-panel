<?php

namespace Tests\Feature\Acceptance;

use App\Jobs\GetPatientTests;
use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function visit(Customer $customer, int $serverId, string $status = "processing"): Acceptance
    {
        $acceptance = new Acceptance(["server_id" => $serverId, "status" => $status]);
        $acceptance->customer()->associate($customer->id);
        $acceptance->save();
        return $acceptance;
    }

    private function item(Acceptance $acceptance, int $serverId, string $status): AcceptanceItem
    {
        $item = new AcceptanceItem(["server_id" => $serverId, "test" => "Test $serverId", "status" => $status, "timeline" => []]);
        $item->acceptance()->associate($acceptance->id);
        $item->save();
        return $item;
    }

    private function params(Acceptance $acceptance, AcceptanceItem $item): array
    {
        return ["acceptance" => $acceptance->id, "acceptanceItem" => $item->id];
    }

    protected function setUp(): void
    {
        parent::setUp();
        cache()->put("sanctumToken", encrypt("token"));
    }

    public function test_a_reported_test_opens_while_the_rest_of_the_visit_is_processing(): void
    {
        Http::fake(["*report-acceptances/6768" => Http::response("%PDF-1.4 report", 200, [
            "Content-Type" => "application/pdf",
            "Content-Disposition" => 'attachment; filename="report.pdf"',
        ])]);
        $customer = Customer::create(["name" => "P", "mobile" => "96899535184", "last_otp_request" => now()]);
        $acceptance = $this->visit($customer, 3525);
        $ready = $this->item($acceptance, 6768, "reported");
        $pending = $this->item($acceptance, 6769, "processing");

        $this->actingAs($customer, "customer")->get(route("acceptanceItems.show", $this->params($acceptance, $ready)))->assertOk();
        $this->actingAs($customer, "customer")->get(route("acceptanceItems.report", $this->params($acceptance, $ready)))->assertOk();
        $this->actingAs($customer, "customer")->get(route("acceptanceItems.report", $this->params($acceptance, $pending)))->assertNotFound();
    }

    public function test_a_test_from_another_visit_is_refused(): void
    {
        Http::fake(["*" => Http::response("%PDF-1.4 report", 200, ["Content-Type" => "application/pdf"])]);
        $owner = Customer::create(["name" => "P", "mobile" => "96899535184", "last_otp_request" => now()]);
        $other = Customer::create(["name" => "Q", "mobile" => "96890000002", "last_otp_request" => now()]);
        $mine = $this->visit($owner, 1, "reported");
        $theirs = $this->item($this->visit($other, 2, "reported"), 5000, "reported");

        $this->actingAs($owner, "customer")->get(route("acceptanceItems.report", $this->params($mine, $theirs)))->assertForbidden();
        Http::assertNothingSent();
    }

    public function test_an_expired_lab_token_is_renewed_once(): void
    {
        Http::fake([
            "*login/" => Http::response(["access_token" => "fresh"]),
            "*report-acceptances/6768" => fn($request) => $request->hasHeader("Authorization", "Bearer fresh")
                ? Http::response("%PDF-1.4 report", 200, ["Content-Type" => "application/pdf"])
                : Http::response("Unauthenticated", 401),
        ]);
        $customer = Customer::create(["name" => "P", "mobile" => "96899535184", "last_otp_request" => now()]);
        $acceptance = $this->visit($customer, 3525, "reported");
        $item = $this->item($acceptance, 6768, "reported");

        $this->actingAs($customer, "customer")->get(route("acceptanceItems.report", $this->params($acceptance, $item)))->assertOk();
        $this->assertSame("fresh", decrypt(cache()->get("sanctumToken")));
    }

    public function test_syncing_one_account_leaves_another_accounts_copy_alone(): void
    {
        Http::fake(["*" => Http::response(["patient" => ["fullName" => "Patient", "acceptances" => [[
            "id" => 3525, "status" => "reported", "created_at" => now()->toDateTimeString(), "updated_at" => now()->toDateTimeString(),
            "acceptance_items" => [["id" => 6768, "status" => "reported", "test" => ["name" => "NIFTY PRO"], "timeline" => []]],
        ]]]])]);
        $first = Customer::create(["name" => "P", "mobile" => "96899535184", "last_otp_request" => now()]);
        $second = Customer::create(["name" => "Q", "mobile" => "96890000002", "last_otp_request" => now()]);

        GetPatientTests::dispatchSync($first, "12172461");
        GetPatientTests::dispatchSync($second, "12172461");

        $this->assertSame(1, $first->acceptances()->where("server_id", 3525)->count());
        $this->assertSame(1, $second->acceptances()->where("server_id", 3525)->count());
    }
}
