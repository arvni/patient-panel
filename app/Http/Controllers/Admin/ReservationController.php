<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Interfaces\ReservationRepositoryInterface;
use App\Models\Reservation;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    protected ReservationRepositoryInterface $reservationRepository;

    public function __construct(ReservationRepositoryInterface $reservationRepository)
    {
        $this->reservationRepository = $reservationRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $reservations = $this->reservationRepository->getAllReservations($request->all());
        return Inertia::render("Admin/Reservation/Index", ["request" => count($request->all()) ? $request->all() : [], "reservations" => $reservations]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        $reservation->load([
            "Time",
            "Time.Doctor:title,id,image",
            "Time.Reservation",
            "Time.Reservation.Customer",
            "Transaction",
            "Customer",
            "Customer.WhatsappMessages"]);
        return Inertia::render("Admin/Reservation/Show", ["reservation" => $reservation]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        //
    }
}
