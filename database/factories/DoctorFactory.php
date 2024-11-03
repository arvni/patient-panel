<?php

namespace Database\Factories;

use App\Enums\CalendarDays;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "image" => "/images/dr-abeer.png",
            "title" => fake()->name(),
            "subtitle" => "(MD;PHD)",
            "specialty" => "Genetic Consultant",
            "default_time_table" => $this->makeWeekTimes()
        ];
    }

    private function makeWeekTimes()
    {
        return array_map(function () {
            return [
                [
                    "started_at" => fake()->time("H:i", Carbon::parse("21:00")),
                    "ended_at" => fake()->time("H:i", Carbon::parse("21:00")),
                    "id" => fake()->uuid()
                ],
                [
                    "started_at" => fake()->time("H:i", Carbon::parse("21:00")),
                    "ended_at" => fake()->time("H:i", Carbon::parse("21:00")),
                    "id" => fake()->uuid()
                ],
            ];
        }, CalendarDays::values());
    }
}
