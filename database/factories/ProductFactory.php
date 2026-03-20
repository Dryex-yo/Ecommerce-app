<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends Factory<Product~>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
    $name = fake()->words(3, true);

    return [
        'name' => $name,
        'slug' => Str::slug($name . '-' . fake()->unique()->numberBetween(1, 9999)),
        'description' => fake()->sentence(),
        'price' => fake()->numberBetween(10000, 1000000),
        'image' => 'https://picsum.photos/400?random=' . rand(1, 1000),
        'stock' => fake()->numberBetween(1, 100),
    ];
    }
}
