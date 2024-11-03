<?php

namespace App\Http\Controllers;

use App\Interfaces\DoctorRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FirstPageController extends Controller
{
    protected DoctorRepositoryInterface $doctorRepository;

    public function __construct(DoctorRepositoryInterface $doctorRepository)
    {
        $this->doctorRepository = $doctorRepository;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return Inertia::render('Home/Home', ["doctors" => $this->getDoctors()]);
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

}
