<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloqueoHora extends Model
{
    use HasFactory;

    protected $primaryKey = "id_bloqueohora";

    protected $fillable = ['dia', 'hora_inicio', 'hora_fin','profesional_id_profesional'];

    public function profesional()
    {
        return $this->belongsTo(Profesional::class,'profesional_id_profesional');
    }
}
