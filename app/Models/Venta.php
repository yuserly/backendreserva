<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Venta extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id_venta";

    protected $fillable = [
        'reserva_id',
        'paciente_id',
        'mediopago_id',
        'sub_total',
        'porcentaje_desc',
        'precio_desc',
        'iva',
        'total',
        'codigo_boucher',
        'codigo_bono_fonasa',
        'boleta_honorario',
        'n_honorario',
        'estado_id',
        'sucursal_id'
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class,'reserva_id');
    }
    public function medio()
    {
        return $this->belongsTo(MedioPago::class,'mediopago_id');
    }
    public function estado()
    {
        return $this->belongsTo(Estado::class,'estado_id');
    }
}
