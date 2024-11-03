<?php

namespace App\Interfaces;

use App\Models\Customer;

interface CustomerRepositoryInterface
{
    public function getAllCustomers(array $queryData = []);

    public function getCustomerById(Customer $customer): Customer;

    public function deleteCustomer(Customer $customer): ?bool;

    public function createCustomer($mobile,array $customerDetails): Customer;

    public function updateCustomer(Customer $customer, array $newDetails): bool;

    public function getCustomerByMobile($mobile): Customer|null;
}
