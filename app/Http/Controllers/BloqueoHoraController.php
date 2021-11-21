<?php

namespace App\Http\Controllers;

use App\Models\BloqueoHora;
use Illuminate\Http\Request;

class BloqueoHoraController extends Controller
{

    public function validardia($dia)
    {
        $hora =  BloqueoHora::where('dia', $dia)->first();

        if($hora){
            return 1;
        }else{

            return 0;
        }
    }

    public function store(Request $request)
    {
        $hora = BloqueoHora::updateOrCreate(['id_bloqueohora'=>$request->id_bloqueohora],
        [
            'dia' => $request->dia,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
            'profesional_id_profesional' => $request->profesional_id_profesional["id_profesional"]
        ]);

        return $hora;
    }


    public function show(BloqueoHora $bloqueoHora)
    {
        return BloqueoHora::with('profesional')->get();
    }


    public function destroy(BloqueoHora $bloqueoHora)
    {
        return $bloqueoHora->delete();
    }
}
