<?php


namespace App\Repositories;

use App\Interfaces\CustomerRepositoryInterface;
use App\Interfaces\ReservationRepositoryInterface;
use App\Models\Customer;
use App\Models\Reservation;

use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ReservationRepository implements ReservationRepositoryInterface
{

    /**
     * @var Builder
     */
    private Builder $query;
    private CustomerRepositoryInterface $customerRepository;

    public function __construct(Reservation $reservation, CustomerRepositoryInterface $customerRepository)
    {
        $this->query = $reservation->newQuery();
        $this->customerRepository = $customerRepository;
    }

    /**
     * @param array $queryData
     * @return LengthAwarePaginator
     */
    public function getAllReservations(array $queryData = []): LengthAwarePaginator
    {
        $this->query
            ->with(["Time", "Customer"])
            ->withAggregate("Doctor as doctor_title", "doctors.title");
        if (isset($queryData["filter"]))
            $this->applyFilter($queryData["filter"]);
        if (isset($queryData["orderBy"])) {
            $this->query->orderBy($queryData["orderBy"]["field"], $queryData["orderBy"]["type"]);
        }

        if (isset($queryData["pageSize"])) {
            return $this->query->paginate($queryData["pageSize"]);
        } else
            return $this->query->paginate();

    }

    public function countAllFutureReservations()
    {
        $this->query->whereHas("Time", function ($q) {
            $q->whereDate("started_at", ">=", Carbon::now());
        });
        return $this->query->count();

    }

    private function applyFilter(array $filter)
    {
        if (isset($filter["doctor"])) {
            $this->query->whereHas("Doctor", function ($q) use ($filter) {
                $q->where("id", $filter["doctor"]["id"]);
            });
        }
        if (isset($filter["mobile"]))
            $this->query->search("mobile", $filter["mobile"]);
        if (isset($filter["email"]))
            $this->query->search("email", $filter["email"]);
        if (isset($filter["name"]))
            $this->query->search("name", $filter["name"]);
        if (isset($filter["verified"]))
            $filter["verified"] ? $this->query->verified() : $this->query->notVerified();
        if (isset($filter["date"])) {
            $this->query->whereHas("Time", function ($q) use ($filter) {
                $q->whereBetween("started_at", [Carbon::parse($filter["date"])->startOfDay(), Carbon::parse($filter["date"])->endOfDay()]);
            });
        }
    }

    /**
     * @param Reservation $reservation
     * @return Reservation
     */
    public function getReservationById(Reservation $reservation): Reservation
    {
        return $reservation;
    }

    /**
     * @param Reservation $reservation
     * @return bool|null
     */
    public function deleteReservation(Reservation $reservation): ?bool
    {
        return $reservation->delete();
    }

    /**
     * @param $mobile
     * @param array $reservationDetails
     * @return Reservation
     */
    public function createReservation(Customer $customer, array $reservationDetails): Reservation
    {
        $reservation = $customer->Reservations()->make($reservationDetails);
        $reservation->Time()->associate($reservationDetails["time"]["id"]);
        $reservation->save();
        return $reservation;
    }

    /**
     * @param Reservation $reservation
     * @param array $newDetails
     * @return bool
     */
    public function updateReservation(Reservation $reservation, array $newDetails): bool
    {
        return $reservation->update($newDetails);
    }

    public function getReservationByMobile($mobile): Reservation|null
    {
        return $this->query
            ->whereHas("Customer", function ($q) use ($mobile) {
                $q->where("mobile", $mobile);
            })
            ->whereHas("Time", function ($q) {
                $q->whereBetween("started_at", [
                    Carbon::now(),
                    Carbon::now()->addDays(7)->endOfDay()
                ]);
            })
            ->first();
    }

}
