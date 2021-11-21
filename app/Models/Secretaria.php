<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Secretaria extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = "id_secretaria";

    protected $fillable = ['nombres', 'apellidos', 'user_id'];

    public function secretariasucursal()
    {
        return $this->belongsToMany(Sucursal::class,'secretaria_sucursals', 'secretaria_id_secretaria', 'sucursal_id_sucursal');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
