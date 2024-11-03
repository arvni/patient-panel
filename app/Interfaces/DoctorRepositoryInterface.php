<?php

namespace App\Interfaces;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Collection;

interface DoctorRepositoryInterface
{
    public function getAllDoctors(array $queryData = []);

    public function getListDoctors($with = []);

    public function getDoctorById(Doctor $doctor): Doctor;

    public function deleteDoctor(Doctor $doctor): ?bool;

    public function createDoctor(array $doctorDetails): Doctor;

    public function updateDoctor(Doctor $doctor, array $newDetails): bool;
}
