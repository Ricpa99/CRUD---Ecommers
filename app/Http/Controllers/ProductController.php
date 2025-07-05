<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    public function home(Request $request)
    {
        //Data untuk Kartu Statistik
        $totalProducts = Product::count();
        $totalUsers = User::count();
        $activeCarts = Product::where('stock', '<', 20)->count();
        $totalRevenue = Product::sum(DB::raw('price * stock'));

        //Data untuk Bar & Pie Chart 
        $productsByCategory = Product::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        $categoryDistribution = $productsByCategory->map(function ($item) {
            return ['name' => $item->category, 'value' => $item->count];
        });

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
                'activeCarts' => $activeCarts,
                'totalRevenue' => number_format($totalRevenue, 2, '.', ','),
            ],
            'productsByCategory' => $productsByCategory,
            'categoryDistribution' => $categoryDistribution,
        ]);
    }
    
    
    
    public function index(Request $request){
        // Mengambil daftar kategori unik dari database
        $categories = Product::select('category')->distinct()->pluck('category');

        $products = Product::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('description', 'like', "%{$search}%");
                });
            })
            // ============================
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    
    }
  

    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Validasi semua input dari form
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|string|max:255',
        ]);

        Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'category' => $request->category,
            'rating' => $request->rating ??  (mt_rand(350, 500) / 100),
            'image_url' => $request->image_url ?? 'https://picsum.photos/600/400?random=' . fake()->numberBetween(1, 1000),
        ]);

        //Redirect kembali ke halaman produk dengan pesan sukses
        return Redirect::route('products.index')->with('message', 'Product added successfully.');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product, Request $request)
    {
       //
    
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
     
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|string|max:255',
        ]);

        try {
            $updated = $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'category' => $request->category,
            ]);

            if (!$updated) {
                // Redirect kembali dengan pesan error
                return Redirect::back()->with('error', 'Failed to update product. Please try again.');
            }else{
                return Redirect::back()->with('message', 'Product update successfully.');

            }

        } catch (Exception $e) {
            return Redirect::back()->with('error', 'An unexpected error occurred. Could not update product.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $product->delete();
        } catch (Exception $e) {
            return Redirect::back()->with('error', 'Failed to delete product.');
        }

        return Redirect::route('products.index')->with('message', 'Product deleted successfully.');
    }
}
