<?php


namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class UserRepository implements UserRepositoryInterface
{

    /**
     * @var Builder
     */
    private Builder $query;
    private User $user;
    public function __construct( User $user)
    {
        $this->query=$user->newQuery();
        $this->user=$user;
    }

    /**
     * @param array $queryData
     * @return LengthAwarePaginator
     */
    public function getAllUsers(array $queryData = []): LengthAwarePaginator
    {
        if (isset($queryData["search"])) {
            $this->query->where("name", "like", "%" . $queryData["search"] . "%");
        }
        if (isset($queryData["orderBy"])) {
            $this->query->orderBy($queryData["orderBy"]["field"], $queryData["orderBy"]["type"]);
        }
        if (isset($queryData["pageSize"])) {
            return $this->query->paginate($queryData["pageSize"]);
        } else
            return $this->query->paginate();

    }

    /**
     * @param User $user
     * @return User
     */
    public function getUserById(User $user): User
    {
        return $user;
    }

    /**
     * @param User $user
     * @return bool|null
     */
    public function deleteUser(User $user): ?bool
    {
        return $user->delete();
    }

    /**
     * @param array $userDetails
     * @return User
     */
    public function createUser(array $userDetails): User
    {
        return $this->query->create($userDetails);
    }

    /**
     * @param User $user
     * @param array $newDetails
     * @return bool
     */
    public function updateUser(User $user, array $newDetails): bool
    {
        return $user->update($newDetails);
    }
}
