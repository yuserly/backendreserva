<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HorarioProfesional extends Model
{
    use HasFactory;

    protected $primarykey = "id_horarioprofesional";

    protected $fillable = ['horario_inicio', 'horario_fin', 'dia_id'];
}
