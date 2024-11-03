<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $doctors = [[
            "image" => "/images/dr-saber.png",
            "title" => "Dr.Siamak Saber",
            "subtitle" => "(MD;PHD)",
            "specialty" => "Genetic Consultant",
        ], [
            "image" => "/images/dr-abeer.png",
            "title" => "Dr.Abeer Alsayegh",
            "subtitle" => "(MD;PHD)",
            "specialty" => "Genetic Consultant",
        ]
        ];
        foreach ($doctors as $doctor){
            Doctor::factory()->create($doctor);
        }
        User::factory()->create(["email"=>"admin@bion.com"]);
    }
}
