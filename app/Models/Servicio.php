<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id_servicio";

    protected $fillable = ['nombre', 'precio_particular', 'precio_fonasa', 'precio_isapre', 'especialidad_id'];

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class,'especialidad_id');
    }

    public function sucursal()
    {
        return $this->belongsToMany(Sucursal::class,'servicio_id_servicio');
    }
}
