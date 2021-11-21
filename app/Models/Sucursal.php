<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sucursal extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'id_sucursal';

    protected $fillable = ['nombre', 'direccion'];

    public function serviciosucursal()
    {
        return $this->belongsToMany(Servicio::class,'servicio_sucursal', 'sucursal_id_sucursal', 'servicio_id_servicio');
    }
}
