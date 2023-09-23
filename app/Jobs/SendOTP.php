<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;

class SendOTP implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public User $user;

    /**
     * The number of seconds after which the job's unique lock will be released.
     *
     * @var int
     */
    public $uniqueFor = 120;

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return $this->user->mobile;
    }

    /**
     * Create a new job instance.
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $sid = config("services.twilio.sid");
        $token = config("services.twilio.token");
        $serviceSid = config("services.twilio.serviceSid");
        try {
            $twilio = new Client($sid, $token);
            $twilio->verify->v2->services($serviceSid)
                ->verifications
                ->create("+968" . $this->user->mobile, "sms");

        } catch (TwilioException $exception) {
            $this->fail($exception->getMessage());
        }
    }
}
