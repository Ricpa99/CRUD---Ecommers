<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Menampilkan halaman keranjang belanja.
     */
    public function index()
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('product') // Eager load data produk
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });
        
        $tax = $subtotal * 0.10; // Contoh pajak 10%
        $total = $subtotal + $tax;

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'orderSummary' => [
                'subtotal' => number_format($subtotal, 2, '.', ''),
                'tax' => number_format($tax, 2, '.', ''),
                'total' => number_format($total, 2, '.', ''),
            ]
        ]);
    }

    /**
     * Menambah produk ke keranjang atau menambah kuantitas jika sudah ada.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Cari item di keranjang, atau buat instance baru jika tidak ada
        $cartItem = Cart::firstOrNew([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        // Tambah kuantitas dan simpan
        $cartItem->quantity += 1;
        $cartItem->save();

        // Redirect kembali ke halaman sebelumnya dengan notifikasi
        return Redirect::back()->with('message', $product->name . ' has been added to your cart.');
    }

    /**
     * Mengupdate kuantitas item di keranjang.
     */
    public function update(Request $request, Cart $cart)
    {
        // Pastikan user hanya bisa update cart miliknya
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }
        
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cart->update(['quantity' => $request->quantity]);
        
        return Redirect::back();
    }

    /**
     * Menghapus satu item dari keranjang.
     */
    public function destroy(Cart $cart)
    {
        // Pastikan user hanya bisa delete cart miliknya
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();
        return Redirect::back()->with('message', 'Item removed from cart.');
    }

    /**
     * Menghapus semua isi keranjang.
     */
    public function clear()
    {
        Cart::where('user_id', Auth::id())->delete();
        return Redirect::back()->with('message', 'All items have been removed from your cart.');
    }
}
