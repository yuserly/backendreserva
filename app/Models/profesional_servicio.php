<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class profesional_servicio extends Model
{
    use HasFactory;

    protected $table = "profesional_servicio";

    public function profesional()
    {
        return $this->belongsTo(Profesional::class,'profesional_id_profesional');
    }
}
