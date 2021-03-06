<?php

namespace App\Http\Controllers;

use App\Models\BloqueoHora;
use App\Models\Dia;
use App\Models\HorarioProfesional;
use App\Models\Especialidad;
use App\Models\Profesional;
use App\Models\profesional_servicio;
use App\Models\Reserva;
use App\Models\User;
use App\Models\Servicio;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

use App\Mail\SendMailUser;
use Mail;


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
        if($request->password){

            $password = $request->password;

            }else{
            
            $code = Str::random(8);
            $password = Hash::make($code);

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
                                                    'rut'               => $request->rut,
                                                    'nombres'           => $request->nombres,
                                                    'apellidos'         => $request->apellidos,
                                                    'profesion'         => $request->profesion,
                                                    'url_perfil'        => $img,
                                                    'user_id'           => $id_user,
                                                    'especialidad_id'   => $request->especialidad 
                                                    ]);
            $estado = 1;
            
            Mail::to($request->email)->send(new SendMailUser($request->nombres, $request->apellidos, $request->email, $code, $estado));

            return $profesional;
    }

    public function configprofesional(Request $request)
    {

        HorarioProfesional::where('sucursal_id', $request->sucursal['id_sucursal'])->where('profesional_id_profesional', $request->id_profesional)->delete();
        
        foreach($request->horario as $item){
            HorarioProfesional::create(['hora_inicio' => $item["hora_inicio"], 
                                        'hora_fin' => $item["hora_fin"], 
                                        'dia_id' => $item["id_dia"]["id_dia"], 
                                        'profesional_id_profesional' => $request->id_profesional, 
                                        'sucursal_id' => $request->sucursal['id_sucursal']]);
        }

        return "Horario Actualizado exitosamente.";

    }

    public function servicioprofesional(Request $request){

         // insertamos los servicios
         $arrayServicio = array();

         for ($i=0; $i < count($request->servicios) ; $i++) {
                $servicios = $request->servicios[$i];
             foreach ($servicios["servicio_id_servicio"] as $key => $item) {

                $existe = profesional_servicio::where("servicio_id_servicio", $item["id_servicio"])
                                        ->where("sucursal_id_sucursal", $servicios["sucursal_id_sucursal"]["id_sucursal"])
                                        ->where('profesional_id_profesional', $request->id_profesional)->first();
                if(empty($existe)){
                    profesional_servicio::create(["servicio_id_servicio" => $item["id_servicio"], "sucursal_id_sucursal" => $servicios["sucursal_id_sucursal"]["id_sucursal"],'profesional_id_profesional' => $request->id_profesional]);
                }

             }
         }

         return "Servicio a??adido a profesional exitosamente.";

    }

    public function show(Profesional $profesional)
    {   
        $profesional = Profesional::all();
        $profesional->load('servicio','horarioM','user', 'especialidad');

        $especialidades = Especialidad::all();

        return ['profesional' => $profesional, 'especialidades' => $especialidades];
    }

    public function showxservicio($id){

        return profesional_servicio::where('servicio_id_servicio', $id)->with('profesional')->get();
    }

    public function showserviciosucursal($id_servicio, $id_sucursal){

        $telemedicina = Servicio::select('telemedicina')->where('id_servicio', $id_servicio)->first();
        $profesional = profesional_servicio::where([['servicio_id_servicio', $id_servicio],['sucursal_id_sucursal', $id_sucursal]])->with('profesional')->get();

        return ['profesional' => $profesional, 'telemedicina' => $telemedicina];

    }

    
    public function traerhorario(Request $request){

        // consultar el numero del dia ya que 0 es domingo y tenemos guardado es el id_dia

        $diasHabiles = array();
        $diasDisponibles = HorarioProfesional::where([['profesional_id_profesional','=',$request->id_profesional],['sucursal_id', '=', $request->id_sucursal]])->with('dia')->get();
        
        foreach ($diasDisponibles as $key => $value) {
            if($value->dia->dia == 7){
                array_push($diasHabiles, 0);
            }else{
                array_push($diasHabiles, $value->dia->dia);
            }
        }

        sort($diasHabiles);

        if(in_array($request->diasemana,$diasHabiles)){
            
            $dia = Dia::where('dia', $request->diasemana)->first();
        }else{
            
            $num = $request->diasemana;

            do {
                if($num == 6){
                    $num = 0;
                }else{
                    $num++;
                }

                if(in_array($num, $diasHabiles) == 1){
                    $resultado = true;
                }else{
                    $resultado = false;
                }

            } while ($resultado != true);

            $dia = Dia::where('dia', $num)->first();
        }
        

        if($dia){

            $id_dia = $dia->id_dia;

            $horario = HorarioProfesional::where([['dia_id','=', $id_dia],['profesional_id_profesional','=',$request->id_profesional],['sucursal_id', '=', $request->id_sucursal]])->first();

        }else{

            $horario = [];

        }

        // horas bloqueadas

        $bloqueo = BloqueoHora::where('profesional_id_profesional',$request->id_profesional)->get();

        // traer reservas

        $reserva = Reserva::where([['profesional_id',$request->id_profesional],['sucursal_id','=', $request->id_sucursal]])->get(); 
        $reserva->load('paciente');

        return ["horario" => $horario, "bloqueo" => $bloqueo, "reserva" => $reserva, 'diasDisponibles' => $diasDisponibles];

    }

    public function traerhorariounico(Request $request){

        // consultar el numero del dia ya que 0 es domingo y tenemos guardado es el id_dia
        

        $user = Auth::user();

        $diasHabiles = array();
        $diasDisponibles = HorarioProfesional::where([['profesional_id_profesional','=',$user->profesional[0]->id_profesional],['sucursal_id', '=', $request->id_sucursal]])->with('dia')->get();
        
        

        foreach ($diasDisponibles as $key => $value) {
            if($value->dia->dia == 7){
                array_push($diasHabiles, 0);
            }else{
                array_push($diasHabiles, $value->dia->dia);
            }
        }

        sort($diasHabiles);

        if(in_array($request->diasemana,$diasHabiles)){
            
            $dia = Dia::where('dia', $request->diasemana)->first();
        }else{
            
            $num = $request->diasemana;

            do {
                if($num == 6){
                    $num = 0;
                }else{
                    $num++;
                }

                if(in_array($num, $diasHabiles) == 1){
                    $resultado = true;
                }else{
                    $resultado = false;
                }

            } while ($resultado != true);

            $dia = Dia::where('dia', $num)->first();
        }

        if($dia){

            $id_dia = $dia->id_dia;

            $horario = HorarioProfesional::where([['dia_id','=', $id_dia],['profesional_id_profesional','=',$user->profesional[0]->id_profesional]])->first();

        }else{

            $horario = [];

        }

        
        // horas bloqueadas

        $bloqueo = BloqueoHora::where('profesional_id_profesional', $user->profesional[0]->id_profesional)->get();

      

        // traer reservas

        $reserva = Reserva::where([['profesional_id', $user->profesional[0]->id_profesional] ,['sucursal_id','=', $request->id_sucursal]])->get();


        return ["horario" => $horario, "bloqueo" => $bloqueo, "reserva" => $reserva, 'diasDisponibles' => $diasDisponibles];

    }

    public function destroy(Profesional $profesional)
    {
        $profesional->user->delete();
        return $profesional->delete(); 
    }

    public function eliminarServicioProfesional($servicio, $sucursal, $profesional)
    {
        $delete = profesional_servicio::where('sucursal_id_sucursal', $sucursal)
                                        ->where('servicio_id_servicio', $servicio)
                                        ->where('profesional_id_profesional', $profesional)
                                        ->delete();

        return "Servicio eliminado exitosamente del profesional";
    }

    public function getHorarioProfesionalSucursal($sucursal, $profesional)
    {
        $horario = HorarioProfesional::where('sucursal_id', $sucursal)->where('profesional_id_profesional', $profesional)->get();
        $horario->load('dia');
        return $horario;
    }

    public function changePasswordProfesional(Request $request)
    {
        User::updateOrCreate(['id' => $request->profesional['user_id']],['password' => Hash::make($request->contrasena)]);

        $estado = 2;
            
        Mail::to($request->profesional['user']['email'])->send(new SendMailUser($request->profesional['nombres'], $request->profesional['apellidos'], $request->profesional['user']['email'], $request->contrasena, $estado));

        return "Contrase??a actualizada exitosamente.";
    }
}
