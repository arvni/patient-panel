<?php

namespace Tests\Feature\Acceptance;

use App\Models\Acceptance;
use App\Models\AcceptanceItem;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ClinicalCommentTest extends TestCase
{
    use RefreshDatabase;

    private function reported(Customer $customer, string $status = "reported"): array
    {
        $acceptance = new Acceptance(["server_id" => 1, "status" => $status]);
        $acceptance->customer()->associate($customer->id);
        $acceptance->save();
        $item = new AcceptanceItem(["server_id" => 5140, "test" => "Carrier Screening", "status" => "reported", "timeline" => []]);
        $item->acceptance()->associate($acceptance->id);
        $item->save();

        return [$acceptance, $item];
    }

    private function url(Acceptance $acceptance, AcceptanceItem $item): string
    {
        return route("acceptanceItems.clinicalComment", ["acceptance" => $acceptance->id, "acceptanceItem" => $item->id]);
    }

    protected function setUp(): void
    {
        parent::setUp();
        cache()->put("sanctumToken", encrypt("token"));
    }

    public function test_the_clinical_comment_is_served_as_its_own_file(): void
    {
        Http::fake([
            "*report-acceptances/5140/clinical-comment" => Http::response("%PDF-1.4 comment", 200, [
                "Content-Type" => "application/pdf",
                "Content-Disposition" => 'attachment; filename="clinical comment.pdf"',
            ]),
        ]);
        $customer = Customer::create(["name" => "P", "mobile" => "96899125742", "last_otp_request" => now()]);
        [$acceptance, $item] = $this->reported($customer);

        $response = $this->actingAs($customer, "customer")->get($this->url($acceptance, $item));

        $response->assertOk()->assertHeader("Content-Type", "application/pdf");
        $this->assertSame('attachment; filename="clinical comment.pdf"', $response->headers->get("Content-Disposition"));
        $this->assertSame("%PDF-1.4 comment", $response->getContent());
    }

    public function test_a_report_without_a_comment_is_a_404(): void
    {
        Http::fake(["*" => Http::response("Not Found", 404)]);
        $customer = Customer::create(["name" => "P", "mobile" => "96899125742", "last_otp_request" => now()]);
        [$acceptance, $item] = $this->reported($customer);

        $this->actingAs($customer, "customer")->get($this->url($acceptance, $item))->assertNotFound();
    }

    public function test_other_patients_and_unfinished_results_get_nothing(): void
    {
        Http::fake(["*" => Http::response("%PDF-1.4 comment", 200, ["Content-Type" => "application/pdf"])]);
        $owner = Customer::create(["name" => "P", "mobile" => "96899125742", "last_otp_request" => now()]);
        $other = Customer::create(["name" => "Q", "mobile" => "96890000002", "last_otp_request" => now()]);
        [$acceptance, $item] = $this->reported($owner);

        $this->actingAs($other, "customer")->get($this->url($acceptance, $item))->assertForbidden();

        $acceptance->update(["status" => "processing"]);
        $this->actingAs($owner, "customer")->get($this->url($acceptance, $item))->assertNotFound();
        Http::assertNothingSent();
    }

    public function test_the_test_list_marks_reports_that_have_a_comment(): void
    {
        Http::fake([
            "*report-acceptances/5140/clinical-comment" => Http::response("", 200),
            "*report-acceptances/5142/clinical-comment" => Http::response("", 404),
        ]);
        $customer = Customer::create(["name" => "P", "mobile" => "96899125742", "last_otp_request" => now()]);
        [$acceptance] = $this->reported($customer);
        $other = new AcceptanceItem(["server_id" => 5142, "test" => "SMA", "status" => "reported", "timeline" => []]);
        $other->acceptance()->associate($acceptance->id);
        $other->save();

        $this->actingAs($customer, "customer")->get(route("acceptances.show", $acceptance->id))
            ->assertOk()
            ->assertInertia(fn($page) => $page
                ->where("acceptance.acceptance_items.0.has_clinical_comment", true)
                ->where("acceptance.acceptance_items.1.has_clinical_comment", false));

        Http::assertSent(fn($request) => $request->method() === "HEAD");
        Http::assertNotSent(fn($request) => $request->method() === "GET");
    }

    public function test_an_unanswered_check_shows_no_mark_and_is_asked_again(): void
    {
        Http::fake(["*" => Http::response("", 500)]);
        $customer = Customer::create(["name" => "P", "mobile" => "96899125742", "last_otp_request" => now()]);
        [$acceptance] = $this->reported($customer);

        $this->actingAs($customer, "customer")->get(route("acceptances.show", $acceptance->id))
            ->assertOk()
            ->assertInertia(fn($page) => $page->where("acceptance.acceptance_items.0.has_clinical_comment", false));
        $this->assertFalse(cache()->has("clinicalComment.5140"));
    }
}
