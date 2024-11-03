<?php

namespace App\Http\Controllers\Reservation;

use App\Enums\ReservationType;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReservationRequest;
use App\Interfaces\CustomerRepositoryInterface;
use App\Interfaces\DoctorRepositoryInterface;
use App\Interfaces\ReservationRepositoryInterface;
use App\Models\Reservation;
use App\Models\Time;
use App\Services\ConvertMobileNumberService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    protected ReservationRepositoryInterface $reservationRepository;
    protected CustomerRepositoryInterface $customerRepository;
    protected DoctorRepositoryInterface $doctorRepository;

    public function __construct(
        ReservationRepositoryInterface $reservationRepository,
        CustomerRepositoryInterface    $customerRepository,
        DoctorRepositoryInterface      $doctorRepository)
    {
        $this->reservationRepository = $reservationRepository;
        $this->customerRepository = $customerRepository;
        $this->doctorRepository = $doctorRepository;
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $reservations = $this->reservationRepository->getAllReservations([...$request->all(), "customer_id" => auth()->user()->id]);
        return Inertia::render("Reservations/Index", ["request" => count($request->all()) ? $request->all() : null, "reservations" => $reservations]);
    }

    public function create()
    {
        return Inertia::render('Reservations/Create', ["doctors" => $this->getDoctors()]);
    }

    /**
     * Handle the incoming request.
     */
    public function store(ReservationRequest $request)
    {
        $customer = auth("customer")->user();
        $reservation = $this->reservationRepository->getReservationByMobile($customer->mobile);
        if ($reservation)
            return back()->withErrors("Currently you have an active reservation");

        $time = Time::make([
            "title" => $request->get("time")["title"],
            "started_at" => Carbon::parse($request->get("time")["started_at"], "Asia/Muscat"),
            "ended_at" => Carbon::parse($request->get("time")["ended_at"], "Asia/Muscat"),
            "disabled" => true,
            "price" => 30,
            "is_online" => $request->get("type") == ReservationType::ONLINE->value
        ]);
        $time->Doctor()->associate($request->get("doctor")["id"]);
        $time->save();
        $reservation = $this->reservationRepository->createReservation($customer, [...$request->only(["type"]), "time" => $time->toArray()]);
        return redirect()->route("reservations.show", $reservation);
    }


    private function getDoctors()
    {
        return $this->doctorRepository
            ->getListDoctors()
            ->map(fn($doctor) => [
                "id" => $doctor->id,
                "title" => $doctor->title,
                "subtitle" => $doctor->subtitle,
                "specialty" => $doctor->specialty,
                "image" => $doctor->image
            ]);
    }

    public function show(Reservation $reservation)
    {
        $reservation->load(["Time","Time.Doctor:title,id,image", "Transaction", "Customer"]);
        $time = $reservation->Time->started_at;
        $date = Carbon::parse($time)->format("D, M d");
        return Inertia::render("Reservations/Show", [
            "paymentMessage"=>__("messages.paymentMessage"),
            "reservation" => $reservation,
            "timeCardData"=>[
                "day"=>$date,
                "time"=>$reservation->Time->toArray(),
                "doctor"=>$reservation->Time->Doctor->toArray()
            ]
        ]);
    }

}
