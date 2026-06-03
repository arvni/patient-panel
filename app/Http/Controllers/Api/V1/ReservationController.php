<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ReservationType;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReservationRequest;
use App\Interfaces\CustomerRepositoryInterface;
use App\Interfaces\DoctorRepositoryInterface;
use App\Interfaces\ReservationRepositoryInterface;
use App\Models\Reservation;
use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
     * Create new reservation (mobile app version)
     */
    public function store(Request $request)
    {
        \Log::info('API V1 Reservation: Store request received', $request->all());

        try {
            $customer = $request->user();

            // Check if customer already has an active reservation
            $existingReservation = $this->reservationRepository->getReservationByMobile($customer->mobile);
            if ($existingReservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'You currently have an active reservation'
                ], 400);
            }

            // Validate request
            $request->validate([
                'type' => 'required|string',
                'doctor.id' => 'required|exists:doctors,id',
                'time.title' => 'required|string',
                'time.started_at' => 'required',
                'time.ended_at' => 'required',
            ]);

            // Create time record
            $time = Time::make([
                "title" => $request->input('time.title'),
                "started_at" => Carbon::parse($request->input('time.started_at'), "Asia/Muscat"),
                "ended_at" => Carbon::parse($request->input('time.ended_at'), "Asia/Muscat"),
                "disabled" => true,
                "price" => config('reservation.default_price', 30),
                "is_online" => $request->get("type") == ReservationType::ONLINE->value || $request->get("type") == 'online'
            ]);
            $time->doctor()->associate($request->input('doctor.id'));
            $time->save();

            // Create reservation
            $reservation = $this->reservationRepository->createReservation(
                $customer,
                [
                    'type' => $request->type == 'online' ? ReservationType::ONLINE->value : ReservationType::IN_PERSON->value,
                    'time' => $time->toArray()
                ]
            );

            \Log::info('API V1 Reservation: Created successfully', ['reservation_id' => $reservation->id]);

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully.',
                'data' => [
                    'id' => $reservation->id,
                    'type' => $reservation->type,
                    'created_at' => $reservation->created_at->toDateTimeString(),
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('API V1 Reservation: Validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('API V1 Reservation: Error creating reservation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation.'
            ], 500);
        }
    }
}
