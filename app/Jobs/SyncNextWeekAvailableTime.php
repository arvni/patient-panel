<?php

namespace App\Jobs;

use App\Services\SyncDoctorDaysWithDefaultTime;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncNextWeekAvailableTime implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    protected SyncDoctorDaysWithDefaultTime $syncDoctorDaysWithDefaultTime;
    public function __construct(SyncDoctorDaysWithDefaultTime $syncDoctorDaysWithDefaultTime)
    {
        $this->syncDoctorDaysWithDefaultTime=$syncDoctorDaysWithDefaultTime;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->syncDoctorDaysWithDefaultTime->sync();
    }
}
