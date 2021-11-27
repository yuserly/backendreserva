<?php

namespace App\Http\Controllers;

use App\Models\Especialidad;
use App\Models\User;
use Illuminate\Http\Request;

class EspecialidadController extends Controller
{

    public function validarnombre($nombre)
    {
        $especialidad =  Especialidad::where('nombre', $nombre)->first();

        if($especialidad){
            return 1;
        }else{

            return 0;
        }
    }

    public function store(Request $request)
    {

        $especialidad = Especialidad::updateOrCreate(['id_especialidad'=>$request->id_especialidad],
                                                    [
                                                      'nombre' => $request->nombre,
                                                      'intervalo' => $request->intervalo["name"]
                                                    ]);

        return $especialidad;
    }


    public function show(Especialidad $especialidad)
    {
        return Especialidad::all();
    }

    public function showMisEspecialidades($id)
    {   
        $especialidad = User::find($id);
        $especialidad->load('profesional.especialidad');

        return $especialidad;
    }

    public function edit(Especialidad $especialidad)
    {
        //
    }


    public function update(Request $request, Especialidad $especialidad)
    {
        //
    }

    public function destroy(Especialidad $especialidad)
    {
       return $especialidad->delete();
    }
}
