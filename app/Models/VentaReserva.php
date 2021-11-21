<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VentaReserva extends Model
{
    use HasFactory;

    protected $primarykey = ['dia', 'hora', 'prevension_id', 'porcentaje_desc', 'sub_total', 'precio_desc', 'total', 'reserva_id', 'estado_pago_id', 'sucursal_id'];
}
