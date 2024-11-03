<?php


namespace App\Repositories;

use App\Interfaces\CustomerRepositoryInterface;
use App\Models\Customer;

use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class CustomerRepository implements CustomerRepositoryInterface
{

    /**
     * @var Builder
     */
    private Builder $query;
    public function __construct(Customer $customer)
    {
        $this->query = $customer->newQuery();
    }

    /**
     * @param array $queryData
     * @return LengthAwarePaginator
     */
    public function getAllCustomers(array $queryData = []): LengthAwarePaginator
    {
        if (isset($queryData["filter"]))
            $this->applyFilter($queryData["filter"]);
        if (isset($queryData["orderBy"])) {
            $this->query->orderBy($queryData["orderBy"]["field"], $queryData["orderBy"]["type"]);
        }

        if (isset($queryData["pageSize"])) {
            return $this->query->paginate($queryData["pageSize"]);
        } else
            return $this->query->paginate();

    }

    private function applyFilter(array $filter)
    {
        if (isset($filter["mobile"]))
            $this->query->search("mobile", $filter["mobile"]);
        if (isset($filter["email"]))
            $this->query->search("email", $filter["email"]);
        if (isset($filter["name"]))
            $this->query->search("name", $filter["name"]);
        if (isset($filter["search"]))
            $this->search($filter["search"]);
    }

    /**
     * @param Customer $customer
     * @return Customer
     */
    public function getCustomerById(Customer $customer): Customer
    {
        return $customer;
    }

    /**
     * @param Customer $customer
     * @return bool|null
     */
    public function deleteCustomer(Customer $customer): ?bool
    {
        return $customer->delete();
    }

    /**
     * @param $mobile
     * @param array $customerDetails
     * @return Customer
     */
    public function createCustomer($mobile, array $customerDetails): Customer
    {
        $customer = $this->query->make([...$customerDetails, "mobile" => $mobile]);
        $customer->save();
        return $customer;
    }

    /**
     * @param Customer $customer
     * @param array $newDetails
     * @return bool
     */
    public function updateCustomer(Customer $customer, array $newDetails): bool
    {
        return $customer->update($newDetails);
    }

    public function getCustomerByMobile($mobile): Customer|null
    {
        return $this->query->where("mobile", $mobile)->first();
    }

}
