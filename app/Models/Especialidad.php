<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'id_especialidad';

    protected $fillable = ['nombre', 'intervalo'];
}
