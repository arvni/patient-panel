<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWhatsappMessageRequest;
use App\Http\Requests\UpdateWhatsappMessageRequest;
use App\Models\WhatsappMessage;

class WhatsappMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWhatsappMessageRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WhatsappMessage $whatsappMessage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWhatsappMessageRequest $request, WhatsappMessage $whatsappMessage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WhatsappMessage $whatsappMessage)
    {
        //
    }
}
