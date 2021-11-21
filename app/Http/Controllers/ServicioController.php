<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{

    public function show(Servicio $servicio)
    {
        return Servicio::with('especialidad')->get();
    }

    public function showxespecialidad($id){

        return Servicio::where('especialidad_id', $id)->get();
    }

    public function validarnombre($nombre)
    {
        $servicio =  Servicio::where('nombre', $nombre)->first();

        if($servicio){
            return 1;
        }else{

            return 0;
        }
    }

    public function store(Request $request)
    {
        $servicio = Servicio::updateOrCreate(['id_servicio'=>$request->id_servicio],
        [
            'nombre' => $request->nombre,
            'precio_particular' => $request->precio_particular,
            'precio_fonasa' => $request->precio_fonasa,
            'precio_isapre' => $request->precio_isapre,
            'especialidad_id' => $request->especialidad_id["id_especialidad"]
        ]);

        return $servicio;
    }

    public function destroy(Servicio $servicio)
    {
       return $servicio->delete();
    }



}
