<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorResource;
use App\Interfaces\DoctorRepositoryInterface;
use Illuminate\Http\Request;

class ListDoctorsController extends Controller
{
    protected DoctorRepositoryInterface $doctorRepository;
    public function __construct(DoctorRepositoryInterface $doctorRepository)
    {
        $this->doctorRepository=$doctorRepository;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $doctors=$this->doctorRepository->getAllDoctors($request->all());
        return DoctorResource::collection($doctors);
    }
}
