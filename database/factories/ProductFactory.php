<?php
// database/factories/ProductFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $categories = [
            'Beauty', 'Fragrances', 'Furniture','Groceries', 
            'Laptops', 'Mens Shirts','Mens Shoes', 'Mens Wathes',
            'Tablets', 'Accessories',
        ];

        $price = fake()->randomFloat(2, 10, 200);
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(20),
            'category' => fake()->randomElement($categories),
            'price' => fake()->randomFloat(2, 5, 200),
            'original_price' => fake()->optional(0.7)->randomFloat(2, $price + 5, $price + 50),
            'rating' => fake()->randomFloat(2, 3.5, 5),
            'stock' => fake()->numberBetween(0, 150),
            'image_url' => 'https://picsum.photos/600/400?random=' . fake()->numberBetween(1, 1000),
        ];
    }
}