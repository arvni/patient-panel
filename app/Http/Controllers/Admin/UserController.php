<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = $this->userRepository->getAllUsers($request->all());
        return Inertia::render("Admin/User/Index", ["users" => $users, "request" => $request->all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->userRepository->createUser([
            ...$request->except("password"),
            'password' => Hash::make($request->get('password'))
        ]);
        return redirect()->route("admin.users.index")->with(["status" => __("messages.successfullyAdded", ["type" => "user", "title" => $request->get("name")])]);
    }

    /**
     * Display the specified resource.
     *
     *
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->userRepository->updateUser($user, $request->except(["password"]));
        return redirect()->route("admin.users.index")->with(["status" => __("messages.successfullyAdded", ["type" => "user", "title" => $request->get("name")])]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {

    }
}
