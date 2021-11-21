<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    public function validaremail($email)
    {
        $paciente =  Paciente::where('email', $email)->first();

        if($paciente){
            return 1;
        }else{

            return 0;
        }
    }

    public function validarrut($rut)
    {
        $paciente =  Paciente::where('rut', $rut)->with('prevision')->first();

        if($paciente){
            return $paciente;
        }else{

            return 0;
        }
    }

    public function store(Request $request)
    {
        $paciente = Paciente::updateOrCreate(['id_paciente'=>$request->id_paciente],
        [
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'rut' => $request->rut,
            'celular' => $request->celular,
            'direccion' => $request->direccion,
            'prevension_id' => $request->prevension_id["id_prevension"]
        ]);

        return $paciente;
    }

    public function cambiarprevisionpaciente(Request $request)
    {
        $paciente = Paciente::where('id_paciente',$request->id_paciente)->update([
            'prevension_id' => $request->id_prevision["id_prevension"]
        ]);

        return $paciente;
    }



    public function show(Paciente $paciente)
    {
        return Paciente::with('prevision')->get();
    }

    public function destroy(Paciente $paciente)
    {
        return $paciente->delete();
    }
}
