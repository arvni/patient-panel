<?php

namespace App\Http\Requests;

use App\Services\ConvertMobileNumberService;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OTPRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "mobile" => ["required", function (string $attribute, mixed $value, $fail): void {
                if (!preg_match("/^((\+|00)?968)?[279]\d{7}$/", $value))
                    $fail(trans("auth.wrong_number1"));
            }]
        ];
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        // Check both IP-based and mobile-based rate limiting
        $ipKey = $this->ipThrottleKey();
        $mobileKey = $this->mobileThrottleKey();

        // IP-based: max 10 requests per 10 minutes
        if (RateLimiter::tooManyAttempts($ipKey, 10)) {
            event(new Lockout($this));

            $seconds = RateLimiter::availableIn($ipKey);

            throw ValidationException::withMessages([
                'mobile' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        // Mobile-based: max 5 requests per 10 minutes per phone number
        if (RateLimiter::tooManyAttempts($mobileKey, 5)) {
            event(new Lockout($this));

            $seconds = RateLimiter::availableIn($mobileKey);

            throw ValidationException::withMessages([
                'mobile' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        // Hit both rate limiters
        RateLimiter::hit($ipKey, 600); // 10 minutes decay
        RateLimiter::hit($mobileKey, 600); // 10 minutes decay
    }

    /**
     * Get the IP-based rate limiting throttle key for the request.
     */
    protected function ipThrottleKey(): string
    {
        return 'otp-request-ip:' . Str::transliterate($this->ip());
    }

    /**
     * Get the mobile-based rate limiting throttle key for the request.
     */
    protected function mobileThrottleKey(): string
    {
        // Key off the *normalised* number so that submitting the same phone
        // number in different formats (91234567, +96891234567, 0096891234567)
        // cannot be used to bypass the per-mobile rate limit.
        return 'otp-request-mobile:' . Str::transliterate($this->getMobile());
    }

    /**
     * Get the rate limiting throttle key for the request.
     * @deprecated Use ipThrottleKey() and mobileThrottleKey() instead
     */
    public function throttleKey(): string
    {
        return $this->ipThrottleKey();
    }

    public function getMobile()
    {
        return ConvertMobileNumberService::convert($this->get("mobile"));
    }
}
