<?php

namespace App\Http\Requests;

use App\Rules\AvailableTimeUniqueness;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAvailableTimeRequest extends FormRequest
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
            "doctor" => ["required", new AvailableTimeUniqueness],
            "doctor.id" => ["required", "exists:doctors,id"],
            "started_at" => "required",
            "ended_at" => "required",
            "date" => "required"
        ];
    }
}
