<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AwbDetail extends Model
{
    use UsesUuid;
    protected $table = 'awb_detail';
    protected $primaryKey = 'id';
    protected $fillable = [
        'awb', 'agent', 'weight', 'image_link', 'total_piece'
    ];
    protected $guarded = [];
}
