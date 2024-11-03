<?php

namespace App\Http\Requests;

use App\Enums\ReservationType;
use App\Rules\CheckMobileLocked;
use App\Rules\CheckTimeRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            "time" => ["required",/* new CheckTimeRule()*/],
            "doctor.id"=>"required|exists:doctors,id",
            "day" => ["required"],
            "type" => ["required", Rule::enum(ReservationType::class)]
        ];
    }
}
