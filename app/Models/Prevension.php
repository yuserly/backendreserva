<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prevension extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'id_prevension';

    protected $fillable = ['nombre'];
}
