<?php

namespace App\Interfaces;

use App\Models\Time;
use App\Models\Doctor;

interface TimeRepositoryInterface
{
    public function getAllTimes(array $queryData = []);

    public function getTimeById($id): Time;

    public function deleteTime(Time $time): ?bool;

    public function createTime(array $timeDetails): Time;

    public function updateTime(Time $time, array $newDetails);
}
