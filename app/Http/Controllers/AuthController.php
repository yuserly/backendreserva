<?php

namespace App\Http\Controllers;

use App\Models\Profesional;
use App\Models\Secretaria;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Builder\Use_;

class AuthController extends Controller
{
    //
    public function login(Request $request){
        // return $request;

        if(Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])){
            $user = Auth::user();

            $sucursales = [];

            // si es secretaria
            if($user->perfil_id == 2){

                $secretaria = Secretaria::where('user_id',$user->id)->with('secretariasucursal')->first();

                $sucursales = $secretaria->secretariasucursal;

            }elseif($user->perfil_id == 1){

                $sucursales = Sucursal::all();

            }else{

                $profesional = Profesional::where('user_id',$user->id)->with('sucursal')->first();

                $sucursales = $profesional->sucursal;

            }

            $response = [
                'token' => $user->createToken('tahuCoding')->plainTextToken,
                'email' => $user->email,
                'name' => $user->name,
                'perfil' => $user->perfil_id,
                'sucursales' => $sucursales
            ];
            return $response;
        }else{
            return "0";
        }

    }

    public function logout(Request $request){

        $user = Auth::user();
        $user->tokens()->delete();
        return 1;


    }
}
