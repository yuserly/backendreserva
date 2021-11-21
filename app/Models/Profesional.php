<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profesional extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id_profesional";

    protected $fillable = ['rut','nombres', 'apellidos', 'profesion', 'url_perfil','user_id'];

    public function servicio()
    {
        return $this->belongsToMany(Servicio::class,'profesional_servicio', 'profesional_id_profesional', 'servicio_id_servicio')->withPivot('sucursal_id_sucursal');
    }

    public function sucursal()
    {
        return $this->belongsToMany(Sucursal::class,'profesional_servicio', 'profesional_id_profesional', 'sucursal_id_sucursal');
    }

    public function horarioM()
    {
        return $this->belongsToMany(Dia::class,'horario_profesionals', 'profesional_id_profesional', 'dia_id')->withPivot('hora_inicio','hora_fin');
    }

    public function horario()
    {
        return $this->belongsToMany(Dia::class,'horario_profesionals', 'profesional_id_profesional', 'dia_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
