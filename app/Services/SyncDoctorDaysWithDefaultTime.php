<?php

namespace App\Services;

use App\Interfaces\AvailableTimeRepositoryInterface;
use App\Interfaces\DoctorRepositoryInterface;
use App\Models\Doctor;
use Carbon\Carbon;

class SyncDoctorDaysWithDefaultTime
{
    protected AvailableTimeRepositoryInterface $availableTimeRepository;
    protected DoctorRepositoryInterface $doctorRepository;

    public function __construct(AvailableTimeRepositoryInterface $availableTimeRepository, DoctorRepositoryInterface $doctorRepository)
    {
        $this->availableTimeRepository = $availableTimeRepository;
        $this->doctorRepository = $doctorRepository;
    }

    public function sync()
    {
        $doctors = $this->getDoctors();
        foreach ($doctors as $doctor) {
            if ($doctor->default_time_table)
                $this->checkNextWeekAvailableTime($doctor);
        }

    }

    private function getDoctors()
    {
        return $this->doctorRepository->getListDoctors();
    }

    private function checkNextWeekAvailableTime(Doctor $doctor)
    {
        $date = Carbon::now()->addWeek();
        while (Carbon::now()->addWeek()->gt($date)) {
            $weekDayIndex = $date->dayOfWeek;
            $timeTable = $doctor->default_time_table[$weekDayIndex - 1];
            if (count($timeTable) && !$this->countDoctorOneWeekLaterAvailableTime($doctor, $date)) {
                $this->createAvailableTimeSlots($doctor, $timeTable, $date);
            }
            $date->addDay();
        }
    }

    private function createAvailableTimeSlots(Doctor $doctor, array $timeTable, $date)
    {
        foreach ($timeTable as $value) {
            $this->availableTimeRepository->createAvailableTime([
                "doctor" => $doctor,
                "started_at" => $value["started_at"],
                "ended_at" => $value["ended_at"],
                "only_online" => $value["only_online"],
                "date" => $date
            ]);
        }
    }

    private function countDoctorOneWeekLaterAvailableTime(Doctor $doctor, Carbon $date)
    {
        return $this->availableTimeRepository->countAvailableTimes(["doctor" => $doctor, "date" => [$date->startOfDay(), $date->clone()->endOfDay()]]);
    }

}
