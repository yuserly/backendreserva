<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Profesional;
use App\Models\Reserva;
use App\Models\Sucursal;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Mail\SendMailReserva;
use Mail;

class ReservaController extends Controller
{

    public function traerreserva($id)
    {
        return Reserva::where('id_reserva', $id)->with('paciente.prevision','servicio.especialidad')->first();
    }

    public function store(Request $request)
    {

        // creamos el paciente o lo actualizamos
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

        // creamos la reserva
        if($request->codigo){
            $codigo = $request->codigo;
        }else{

            $codigo = uniqid();
        }

        if($request->editservicio){
            $servicio = $request->editservicio["id_servicio"];
        }else{
            $servicio = $request->servicio_id_servicio["id_servicio"];
        }

        $reserva = Reserva::updateOrCreate(['id_reserva' => $request->id_reserva],[
            'dia' => $request->dia,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
            'paciente_id'  => $paciente->id_paciente,
            'profesional_id' => $request->id_profesional["profesional"]["id_profesional"],
            'estado_id' => 2,
            'codigo' => $codigo,
            'sucursal_id' => $request->id_sucursal,
            'servicio_id' => $servicio
        ]);

        $estado = 1;
        
        $sucursal = Sucursal::find($request->id_sucursal);

        $domain = explode('@', $request->email);
        if (checkdnsrr($domain[1], "MX")){
            Mail::to($request->email)->send(new SendMailReserva($request->rut, $request->nombres, 
                                                         $request->apellidos, $request->email, 
                                                         $request->dia, $request->hora_inicio,
                                                         $request->id_profesional["profesional"]["nombres"], 
                                                         $request->id_profesional["profesional"]["apellidos"],
                                                         $sucursal->nombre, $sucursal->direccion,
                                                         $estado
                                                        ));
        }
        
        return $reserva;
    }

    public function storeprofesional(Request $request)
    {
        // creamos el paciente o lo actualizamos
        $user = Auth::user();

        $profesional = Profesional::where('user_id',$user->id)->first();

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

        // creamos la reserva

        if($request->codigo){
            $codigo = $request->codigo;
        }else{

            $codigo = uniqid();
        }

        if($request->editservicio){

            $servicio = $request->editservicio["id_servicio"];

        }else{

            $servicio = $request->servicio_id_servicio["id_servicio"];
        }

        $reserva = Reserva::updateOrCreate(['id_reserva' => $request->id_reserva],[
            'dia' => $request->dia,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
            'paciente_id'  => $paciente->id_paciente,
            'profesional_id' => $profesional->id_profesional,
            'estado_id' => 2,
            'codigo' => $codigo,
            'sucursal_id' => $request->id_sucursal,
            'servicio_id' => $servicio
        ]);

        return $reserva;
    }

    public function validarhora(Request $request)
    {
        $reservas = Reserva::where([['dia','=',$request->dia],['profesional_id','=',$request->id_profesional],['sucursal_id','=',$request->id_sucursal]])->get();

        $ocupado = 0;


        if($reservas){

            foreach ($reservas as $key => $value) {

              $valid =  $this->checkhora($value["hora_inicio"], $value["hora_fin"], $request->hora);


                if($valid == 1){

                    $ocupado = 1;
                }
            }

            return $ocupado;

        }else{

            return 0;
        }

    }

    public function validarhoraprofesional(Request $request)
    {

        $user = Auth::user();

        $profesional = Profesional::where('user_id',$user->id)->first();

        $reservas = Reserva::where([['dia','=',$request->dia],['profesional_id','=', $profesional->id_profesional],['sucursal_id','=',$request->id_sucursal]])->get();

        $ocupado = 0;


        if($reservas){

            foreach ($reservas as $key => $value) {

              $valid =  $this->checkhora($value["hora_inicio"], $value["hora_fin"], $request->hora);


                if($valid == 1){

                    $ocupado = 1;
                }
            }

            return $ocupado;

        }else{

            return 0;
        }

    }

    public function checkhora($inicio, $fin, $hora)
    {

        $hora_inicio_reserva = date_format(date_create($inicio),"H:i:s");
        $hora_fin_reserva = date_format(date_create($fin),"H:i:s");
        $horacheck = date_format(date_create($hora),"H:i:s");

        if($hora_inicio_reserva == $horacheck){
            return 1;
        }else{
            return 0;
        }

    }

    public function editar(Request $request)
    {

       return Reserva::where('id_reserva', $request->id_reserva)->update([

            'dia' => $request->dia,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,

        ]);

    }

    public function buscarreserva(Request $request)
    {
        $paciente = Paciente::where('rut',$request->rut)->first();

        $reserva = Reserva::where([['paciente_id',$paciente->id_paciente],['sucursal_id',$request->id_sucursal],['estado_id', 2],['dia', $request->fecha]])
        ->with('paciente.prevision','profesional','servicio')->get();

        return $reserva;

    }

    public function traerreservadia(Request $request)
    {

            $reserva = Reserva::where([['sucursal_id',$request->id_sucursal],['dia', $request->fecha]])
            ->whereIn('estado_id', [2,3])
            ->with('paciente.prevision','profesional','servicio')->get();

            return $reserva;

    }

    public function confirmarAsistencia($reserva)
    {   
        Reserva::updateOrCreate(['id_reserva' => $reserva],['estado_id' => 3]);
        
        return $reserva;
    }

    public function deshacerConfirmarAsistencia($reserva)
    {
        Reserva::updateOrCreate(['id_reserva' => $reserva],['estado_id' => 2]);
        
        return $reserva;
    }

    public function destroy(Reserva $reserva)
    {   
        
        $reserva->delete();
        return "Reserva eliminada exitosamente.";
    }

    //METODO NO USARDO
    public function checkDomain($email)
    {
        $domain = explode('@', $email);
        if (checkdnsrr($domain[1], "MX")){
            return "hola";
        }else{
            return "adios";
        }
    }
}
