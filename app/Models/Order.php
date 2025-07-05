<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $casts = [
        'shipping_address' => 'array',
        'payment_details' => 'array',
    ];
    protected $guarded = []; 
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
