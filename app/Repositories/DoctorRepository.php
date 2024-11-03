<?php


namespace App\Repositories;

use App\Interfaces\DoctorRepositoryInterface;
use App\Models\Doctor;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class DoctorRepository implements DoctorRepositoryInterface
{

    /**
     * @var Builder
     */
    private Builder $query;
    public function __construct( Doctor $doctor)
    {
        $this->query=$doctor->newQuery();
    }

    /**
     * @param array $queryData
     * @return LengthAwarePaginator
     */
    public function getAllDoctors(array $queryData = []): LengthAwarePaginator
    {
        if (isset($queryData["search"])) {
            $this->query->where("title", "like", "%" . $queryData["search"] . "%");
        }
        if (isset($queryData["orderBy"])) {
            $this->query->orderBy($queryData["orderBy"]["field"], $queryData["orderBy"]["type"]);
        }
        if (isset($queryData["pageSize"])) {
            return $this->query->paginate($queryData["pageSize"]);
        } else
            return $this->query->paginate();

    }

    /**
     * @return Builder[]|Collection
     */
    public function getListDoctors($with=[])
    {
        $query=$this->query;
        if (count($with))
            $this->query->with($with);
        return $query->get();
    }

    /**
     * @param Doctor $doctor
     * @return Doctor
     */
    public function getDoctorById(Doctor $doctor): Doctor
    {
        return $doctor;
    }

    /**
     * @param Doctor $doctor
     * @return bool|null
     */
    public function deleteDoctor(Doctor $doctor): ?bool
    {
        return $doctor->delete();
    }

    /**
     * @param array $doctorDetails
     * @return Doctor
     */
    public function createDoctor(array $doctorDetails): Doctor
    {
        return $this->query->create($doctorDetails);
    }

    /**
     * @param Doctor $doctor
     * @param array $newDetails
     * @return bool
     */
    public function updateDoctor(Doctor $doctor, array $newDetails): bool
    {
        return $doctor->update($newDetails);
    }
}
