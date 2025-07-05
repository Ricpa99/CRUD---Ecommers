<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Exception;

class CheckoutController extends Controller
{
    // Menampilkan halaman checkout
    public function index()
    {
        $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();

        if ($cartItems->isEmpty()) {
            return Redirect::route('shop.index')->with('error', 'Your cart is empty.');
        }

        $subtotal = $cartItems->sum(fn($item) => $item->quantity * $item->product->price);
        $tax = $subtotal * 0.10;
        $total = $subtotal + $tax;

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'orderSummary' => [
                'subtotal' => number_format($subtotal, 2, '.', ''),
                'tax' => number_format($tax, 2, '.', ''),
                'total' => number_format($total, 2, '.', ''),
            ]
        ]);
    }

    // Memproses pesanan
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
        ]);

        $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();
        if ($cartItems->isEmpty()) {
            return Redirect::route('shop.index')->with('error', 'Your cart is empty.');
        }

        try {
            DB::beginTransaction();

            $totalPrice = $cartItems->sum(fn($item) => $item->quantity * $item->product->price) * 1.10; // Subtotal + 10% tax

            $order = Order::create([
                'user_id' => Auth::id(),
                'total_price' => $totalPrice,
                'status' => 'pending',
                'shipping_address' => $request->except(['card_holder', 'card_number', 'expiry_date', 'cvv']),
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);
            }

            Cart::where('user_id', Auth::id())->delete();

            DB::commit();

        } catch (Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'Something went wrong. Please try again. ' . $e->getMessage());
        }

        return Redirect::route('shop.index')->with('message', 'Your order has been placed successfully!');
    }
}