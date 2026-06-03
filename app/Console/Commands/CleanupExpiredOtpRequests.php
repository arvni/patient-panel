<?php

namespace App\Console\Commands;

use App\Models\VerificationRequest;
use Illuminate\Console\Command;

class CleanupExpiredOtpRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otp:cleanup {--force : Delete all expired and locked OTP requests}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup expired and locked OTP verification requests';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting OTP cleanup...');

        // Delete expired OTP requests (older than 24 hours)
        $expiredCount = VerificationRequest::where('expires_at', '<', now()->subDay())
            ->delete();

        $this->info("Deleted {$expiredCount} expired OTP requests (older than 24 hours)");

        // Unlock accounts that have been locked for more than 1 hour
        $unlockedCount = VerificationRequest::where('locked', true)
            ->where('updated_at', '<', now()->subHour())
            ->update(['locked' => false, 'failed_attempts' => 0]);

        $this->info("Unlocked {$unlockedCount} accounts (locked for more than 1 hour)");

        if ($this->option('force')) {
            // Delete ALL old verification requests
            $totalDeleted = VerificationRequest::where('updated_at', '<', now()->subDays(7))
                ->delete();

            $this->warn("Force cleanup: Deleted {$totalDeleted} old verification requests (older than 7 days)");
        }

        $this->info('OTP cleanup completed successfully!');

        return Command::SUCCESS;
    }
}
