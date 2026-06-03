<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\VerificationRequest;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Request OTP for mobile login
     */
    public function requestOtp(Request $request)
    {
        \Log::info('OTP Request received', ['mobile' => $request->mobile, 'ip' => $request->ip()]);

        $request->validate([
            'mobile' => 'required|string|regex:/^968[0-9]{8}$/',
        ]);

        // Rate limiting
        $key = 'otp-request:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again in ' . ceil($seconds / 60) . ' minutes.'
            ], 429);
        }

        RateLimiter::hit($key, 600); // 10 minutes

        try {
            // Get or create customer
            $customer = Customer::where('mobile', $request->mobile)->first();

            if (!$customer) {
                \Log::warning('Customer not found', ['mobile' => $request->mobile]);
                return response()->json([
                    'success' => false,
                    'message' => 'Mobile number not registered.'
                ], 404);
            }

            // Send OTP
            dispatch(new \App\Jobs\SendVerificationSMS($request->mobile));
            \Log::info('OTP dispatched successfully', ['mobile' => $request->mobile]);

            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully.',
                'mobile' => $request->mobile
            ]);
        } catch (\Exception $e) {
            \Log::error('OTP request failed', ['error' => $e->getMessage(), 'mobile' => $request->mobile]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP. Please try again.'
            ], 500);
        }
    }

    /**
     * Verify OTP and login
     */
    public function verifyOtp(Request $request)
    {
        \Log::info('OTP Verification request received', [
            'mobile' => $request->mobile,
            'otp' => substr($request->otp, 0, 2) . '****',
            'ip' => $request->ip()
        ]);

        $request->validate([
            'mobile' => 'required|string|regex:/^968[0-9]{8}$/',
            'otp' => 'required|string|min:4|max:6',
        ]);

        // Rate limiting
        $key = 'otp-verify:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 10)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Too many attempts. Please try again later.'
            ], 429);
        }

        RateLimiter::hit($key, 600);

        try {
            $otpService = new OtpService();
            $isValid = $otpService->checkOtp($request->mobile, $request->otp);

            \Log::info('OTP validation result', ['mobile' => $request->mobile, 'isValid' => $isValid]);

            if (!$isValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP code.'
                ], 401);
            }

            // Get customer
            $customer = Customer::where('mobile', $request->mobile)->first();

            if (!$customer) {
                \Log::warning('Customer not found during OTP verification', ['mobile' => $request->mobile]);
                return response()->json([
                    'success' => false,
                    'message' => 'User not found.'
                ], 404);
            }

            // Create token
            $token = $customer->createToken('mobile-app')->plainTextToken;

            \Log::info('OTP verification successful', ['mobile' => $request->mobile, 'customer_id' => $customer->id]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful.',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'mobile' => $customer->mobile,
                        'email' => $customer->email,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('OTP verification exception', [
                'mobile' => $request->mobile,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Verification failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed.'
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'mobile' => $request->user()->mobile,
                'email' => $request->user()->email,
            ]
        ]);
    }
}
