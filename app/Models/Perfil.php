<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory;
    protected $primaryKey = "id_perfil";

    protected $fillable = [
        'nombre'
    ];
}
