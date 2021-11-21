<?php

namespace App\Http\Controllers;

use App\Models\BloqueoHora;
use App\Models\Dia;
use App\Models\HorarioProfesional;
use App\Models\Profesional;
use App\Models\profesional_servicio;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


class ProfesionalController extends Controller
{
    public function validaremail($email)
    {
        $user =  User::where('email', $email)->first();

        if($user){
            return 1;
        }else{

            return 0;
        }
    }
    public function validarrut($rut)
    {
        $profesional =  Profesional::where('rut', $rut)->first();

        if($profesional){
            return 1;
        }else{

            return 0;
        }
    }
    public function store(Request $request)
    {
        // creamos el usuario

        if($request->password){

            $password = $request->password;

            }else{

            $password = Hash::make(Str::random(8));

            }


            $user = User::updateOrCreate(['id' => $request->user_id],[
                                        'name' => $request->nombres ." ".$request->apellidos ,
                                        'email' => $request->email,
                                        'password' => $password,
                                        'perfil_id' => 3
                                        ]);

            if($request->id_user){

                $id_user = $request->id_user;
            }else{

                $id_user = $user->id;
            }

            if($request->file("url_perfil")){
                $path = public_path().'/storage/foto_perfil/';


                    $file = $request->file('url_perfil');
                    $fileName = uniqid().$file->getClientOriginalName();
                    $file->move($path, $fileName);

                $img = "foto_perfil/".$fileName;
            }else{

                $img = "";
            }

            $profesional = Profesional::updateOrCreate(['id_profesional' => $request->id_profesional],[
                                                    'rut' => $request->rut,
                                                    'nombres' => $request->nombres,
                                                    'apellidos' => $request->apellidos,
                                                    'profesion' => $request->profesion,
                                                    'url_perfil' => $img,
                                                    'user_id'=>$id_user]);



            return $profesional;
    }

    public function configprofesional(Request $request){

        $profesional = Profesional::where('id_profesional', $request->id_profesional)->first();

        // insertamos el horario

        $arrayHorario = [];

        foreach($request->horario as $item){

            $arrays  = ["hora_inicio" => $item["hora_inicio"], "hora_fin" => $item["hora_fin"], "dia_id" => $item["id_dia"]["id_dia"]];
            array_push($arrayHorario, $arrays);
        }

        $profesional->horario()->sync($arrayHorario);

        return $profesional;

    }

    public function servicioprofesional(Request $request){

         // insertamos los servicios


         $arrayServicio = array();

         for ($i=0; $i < count($request->servicios) ; $i++) {
                $servicios = $request->servicios[$i];
             foreach ($servicios["servicio_id_servicio"] as $key => $item) {

                $arrays  = ["servicio_id_servicio" => $item["id_servicio"], "sucursal_id_sucursal" => $servicios["sucursal_id_sucursal"]["id_sucursal"]];
                array_push($arrayServicio, $arrays);
             }
         }

         $profesional = Profesional::where('id_profesional', $request->id_profesional)->first();

         $profesional->servicio()->sync($arrayServicio);

         return $profesional;

    }

    public function show(Profesional $profesional)
    {
        $profesional = Profesional::all();
        $profesional->load('servicio','horarioM','user');

        return $profesional;
    }

    public function showxservicio($id){

        return profesional_servicio::where('servicio_id_servicio', $id)->with('profesional')->get();
    }
    public function showserviciosucursal($id_servicio, $id_sucursal){


        // $servicio = profesional_servicio::select('profesionals.*')
        //                     ->join('profesionals','profesionals.id_profesional','=','profesional_servicio.profesional_id_profesional')
        //                     ->where('profesional_servicio.sucursal_id_sucursal','=', $id_sucursal)
        //                     ->where('profesional_servicio.servicio_id_servicio','=',$id_servicio)
        //                     ->get();

        $profesional = profesional_servicio::where([['servicio_id_servicio', $id_servicio],['sucursal_id_sucursal', $id_sucursal]])->with('profesional')->get();

        return $profesional;

    }

    public function traerhorario(Request $request){

        // consultar el numero del dia ya que 0 es domingo y tenemos guardado es el id_dia

        $dia = Dia::where('dia', $request->diasemana)->first();

        if($dia){

            $id_dia = $dia->id_dia;

            $horario = HorarioProfesional::where([['dia_id','=', $id_dia],['profesional_id_profesional','=',$request->id_profesional]])->first();

        }else{

            $horario = [];

        }

        // horas bloqueadas

        $bloqueo = BloqueoHora::where('profesional_id_profesional',$request->id_profesional)->get();

        // traer reservas

        $reserva = Reserva::where([['profesional_id',$request->id_profesional],['sucursal_id','=', $request->id_sucursal]])->get();

        return ["horario" => $horario, "bloqueo" => $bloqueo, "reserva" => $reserva];

    }


    public function traerhorariounico(Request $request){

        // consultar el numero del dia ya que 0 es domingo y tenemos guardado es el id_dia

        $dia = Dia::where('dia', $request->diasemana)->first();

        $user = Auth::user();

        $profesional = Profesional::where('user_id',$user->id)->with('sucursal')->first();

        if($dia){

            $id_dia = $dia->id_dia;

            $horario = HorarioProfesional::where([['dia_id','=', $id_dia],['profesional_id_profesional','=',$profesional->id_profesional]])->first();

        }else{

            $horario = [];

        }

        // horas bloqueadas

        $bloqueo = BloqueoHora::where('profesional_id_profesional',$profesional->id_profesional)->get();

        // traer reservas

        $reserva = Reserva::where('profesional_id',$profesional->id_profesional)->get();

        return ["horario" => $horario, "bloqueo" => $bloqueo, "reserva" => $reserva];

    }


    public function destroy(Profesional $profesional)
    {
        $profesional->user->delete();
        return $profesional->delete();
    }
}
