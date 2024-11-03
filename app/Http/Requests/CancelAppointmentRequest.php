<?php

namespace App\Http\Requests;

use App\Rules\CheckMobileExists;
use App\Rules\CheckMobileLocked;
use App\Services\ConvertMobileNumberService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class CancelAppointmentRequest extends FormRequest
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
            "mobile"=>["required",'regex:/^((\+|00)?968)?[279]\d{7}$/',new CheckMobileExists(), new CheckMobileLocked()]
        ];
    }
}
