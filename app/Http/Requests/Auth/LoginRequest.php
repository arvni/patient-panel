<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'mobile' => ["required", "exists:users,mobile"],
            'code' => ["required", "size:6"]
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (!$this->checkOTP()) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'mobile' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'mobile' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('mobile')) . '|' . $this->ip());
    }

    public function getMobile()
    {
        if (preg_match("/^((\+|00)?968)?([279]\d{7})$/", $this->mobile, $matches))
            return $matches[3];
    }

    private function checkOTP()
    {
        try {
            $sid = config("services.twilio.sid");
            $token = config("services.twilio.token");
            $serviceSid = config("services.twilio.serviceSid");
            $twilio = new Client($sid, $token);
            $result = $twilio->verify->v2->services($serviceSid)
                ->verificationChecks
                ->create([
                        "to" => "+968" . $this->getMobile(),
                        "code" => $this->code
                    ]
                );
            return $result->valid;
        } catch (TwilioException $exception) {
            return false;
        }

    }
}
