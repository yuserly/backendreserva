<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HorarioProfesional extends Model
{
    use HasFactory;

    protected $primarykey = "id_horarioprofesional";

    protected $fillable = ['profesional_id_profesional', 'sucursal_id','hora_inicio', 'hora_fin', 'dia_id'];

    public function dia()
    {
        return $this->belongsTo(Dia::class, 'dia_id', 'id_dia');
    }
}
