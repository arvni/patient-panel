<?php

namespace App\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function getAllUsers(array $queryData = []);

    public function getUserById(User $user): User;

    public function deleteUser(User $user): ?bool;

    public function createUser(array $userDetails): User;

    public function updateUser(User $user, array $newDetails): bool;
}
