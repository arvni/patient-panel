<?php

namespace App\Interfaces;

use App\Models\Customer;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

interface ReservationRepositoryInterface
{
    public function getAllReservations(array $queryData = []);
    public function countAllFutureReservations();

    public function getReservationById(Reservation $reservation): Reservation;

    public function deleteReservation(Reservation $reservation): ?bool;

    public function createReservation(Customer $customer,array $reservationDetails): Reservation;

    public function updateReservation(Reservation $reservation, array $newDetails): bool;

    public function getReservationByMobile($mobile): Reservation|null;
}
