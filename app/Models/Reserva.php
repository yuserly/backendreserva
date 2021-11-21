<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $primaryKey = "id_reserva";

    protected $fillable = ['dia', 'hora_inicio', 'hora_fin', 'paciente_id', 'profesional_id', 'estado_id', 'codigo', 'sucursal_id', 'servicio_id'];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class,'paciente_id');
    }

    public function profesional()
    {
        return $this->belongsTo(Profesional::class,'profesional_id');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class,'servicio_id');
    }
}
