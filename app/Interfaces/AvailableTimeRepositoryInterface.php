<?php

namespace App\Interfaces;

use App\Models\AvailableTime;
use App\Models\Doctor;

interface AvailableTimeRepositoryInterface
{
    public function getAllAvailableTimes(array $queryData = []);

    public function countAvailableTimes(array $queryData = []);

    public function getAvailableTimeById(AvailableTime $availableTime): AvailableTime;

    public function deleteAvailableTime(AvailableTime $availableTime): ?bool;

    public function createAvailableTime(array $availableTimeDetails): AvailableTime;

    public function updateAvailableTime(AvailableTime $availableTime, array $newDetails): bool;

    public function toggleAvailableTime(AvailableTime $availableTime);
}
