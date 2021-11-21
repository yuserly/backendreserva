<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Paciente extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id_paciente";

    protected $fillable = ['nombres', 'apellidos','email' ,'rut', 'celular', 'direccion', 'prevension_id'];

    public function prevision()
    {
        return $this->belongsTo(Prevension::class,'prevension_id');
    }

    public function reserva()
    {
        return $this->belongsTo(Reserva::class,'paciente_id','id_paciente');
    }
}
