<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class profesional_servicio extends Model
{
    use HasFactory;

    protected $table = "profesional_servicio";

    protected $fillable = ['profesional_id_profesional', 'servicio_id_servicio', 'sucursal_id_sucursal'];

    public function profesional()
    {
        return $this->belongsTo(Profesional::class,'profesional_id_profesional');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class,'sucursal_id_sucursal');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class,'servicio_id_servicio');
    }
}
