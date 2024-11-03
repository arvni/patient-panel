<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Interfaces\AvailableTimeRepositoryInterface;
use App\Interfaces\ReservationRepositoryInterface;
use App\Services\AvailableTimeService;
use Illuminate\Http\Request;

class GetFutureReserved extends Controller
{
    protected $reservationRepository;
    public function __construct(ReservationRepositoryInterface $reservationRepository)
    {
        $this->reservationRepository=$reservationRepository;
    }
    /**
     * Handle the incoming request.
     *
     */
    public function __invoke()
    {
        $count=$this->reservationRepository->countAllFutureReservations();

        return response()->json(["reserved"=>$count]);
    }
}
