<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AwbHistory extends Model
{
    use UsesUuid;
    protected $table = 'awb_history';
    protected $primaryKey = 'id';

    protected $fillable = [
        'awb', 'times_change'
    ];
}
