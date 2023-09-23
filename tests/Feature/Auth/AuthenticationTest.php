<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;


class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $this->get('/login')
            ->assertInertia(fn(Assert $page) => $page->component('Auth/Login'));
    }

    public function test_users_can_not_authenticate_with_invalid_mobile()
    {
        $this->post('/login', [
            'mobile' => "123465",
        ])->assertInvalid(["mobile" => __("auth.wrong_number")]);
    }

    public function test_users_can_request_for_otp(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'mobile' => $user->mobile,
        ])->assertRedirect(route("verify", ["mobile" => $user->mobile]));
    }

    public function test_users_can_not_request_for_new_otp_less_than_2_minuets()
    {

        $this->post('/login', [
            'mobile' => "+96878454640",
        ])->assertRedirect(route("verify", ["mobile" => "+96878454640", "last_opt_request" => Carbon::now()]));
        $user = User::where("mobile", "+96878454640")->first();
        sleep(20);
        $this->post('/login', [
            'mobile' => $user->mobile,
        ])->assertRedirect(route("verify", ["mobile" => $user->mobile, "last_opt_request" => $user->last_opt_request]));
    }

    public function test_users_can_request_for_new_otp_after_2_minuets()
    {

        $this->post('/login', [
            'mobile' => "+96878454640",
        ])->assertRedirect(route("verify", ["mobile" => "+96878454640", "last_opt_request" => Carbon::now()]));
        $user = User::where("mobile", "+96878454640")->first();
        sleep(121);
        $this->post('/login', [
            'mobile' => $user->mobile,
        ])->assertRedirect(route("verify", ["mobile" => $user->mobile, "last_opt_request" => Carbon::now()]));
    }

    public function test_users_can_not_authenticate_with_invalid_otp(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'mobile' => $user->mobile,
        ])->assertRedirect(route("verify", ["mobile" => $user->mobile]));

        $response = $this->post('/verify', [
            "mobile" => $user->mobile,
            "code" => "123456"
        ])->assertInvalid(["mobile" => __("auth.failed")]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
