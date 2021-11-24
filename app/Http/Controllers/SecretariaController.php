<?php

namespace App\Http\Controllers;

use App\Models\Secretaria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Mail\SendMailUser;
use Mail;

class SecretariaController extends Controller
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

    public function store(Request $request)
    {
        if($request->password){

        $password = $request->password;

        }else{

            $code = Str::random(8);
            $password = Hash::make($code);


        }

        $user = User::updateOrCreate(['id' => $request->id_user],[
                                    'name' => $request->nombres ." ".$request->apellidos ,
                                    'email' => $request->email,
                                    'password' => $password,
                                    'perfil_id' => 2
                                    ]);

        if($request->id_user){

            $id_user = $request->id_user;
        }else{

            $id_user = $user->id;
        }

        $secretaria = Secretaria::updateOrCreate(['id_secretaria' => $request->id_secretaria],[
                                                'nombres' => $request->nombres,
                                                'apellidos' => $request->apellidos,
                                                'user_id'=>$id_user]);

        $arraySucursal = array();
        foreach($request->sucursal_id as $item){
            array_push($arraySucursal, $item['id_sucursal']);
        }

        $secretaria->secretariasucursal()->sync($arraySucursal);

        $estado = 1;
            
        Mail::to($request->email)->send(new SendMailUser($request->nombres, $request->apellidos, $request->email, $code, $estado));

        return $secretaria;
    }


    public function show(Secretaria $secretaria)
    {
        $secretaria = Secretaria::all();
        $secretaria->load('secretariasucursal','user');

        return $secretaria;
    }

    public function changePasswordSecretaria(Request $request)
    {   
        User::updateOrCreate(['id' => $request->secretaria['user_id']],['password' => Hash::make($request->contrasena)]);

        $estado = 2;
            
        Mail::to($request->secretaria['user']['email'])->send(new SendMailUser($request->secretaria['nombres'], $request->secretaria['apellidos'], $request->secretaria['user']['email'], $request->contrasena, $estado));

        return "Contraseña actualizada exitosamente.";
    }

    public function destroy(Secretaria $secretaria)
    {
        $secretaria->user->delete();
        return $secretaria->delete();
    }
}
