<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('items.product') 
            ->latest()
            ->paginate(10); 

        return Inertia::render('Order/Index', [
            'orders' => $orders,
        ]);
    }
}
