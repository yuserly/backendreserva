<?php

namespace App\Http\Controllers;

use App\Models\Profesional;
use App\Models\Servicio;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SucursalController extends Controller
{

    public function validarnombre($nombre)
    {
        $sucursal =  Sucursal::where('nombre', $nombre)->first();

        if($sucursal){
            return 1;
        }else{

            return 0;
        }
    }

    public function store(Request $request)
    {
        // creamos la sucursal

        $sucursal = Sucursal::updateOrCreate(['id_sucursal' => $request->id_sucursal],
                                            ['nombre' => $request->nombre,
                                            'direccion' => $request->direccion]);

        $arrayServicio = array();
        foreach($request->servicio_id as $item){
            array_push($arrayServicio, $item['id_servicio']);
        }

        $sucursal->serviciosucursal()->sync($arrayServicio);

        return $sucursal;
    }


    public function show(Sucursal $sucursal)
    {
        $sucursal = Sucursal::all();
        $sucursal->load('serviciosucursal');

        return $sucursal;
    }

    public function showServicios($id)
    {
        $sucursal = Sucursal::where('id_sucursal',$id)->first();
        $sucursal->load('serviciosucursal');

        return $sucursal;
    }

    public function showserviciosucursal($id_especialidad, $id_sucursal){

        $servicio = Servicio::select('servicios.*')
                            ->join('servicio_sucursal','servicio_sucursal.servicio_id_servicio','=','servicios.id_servicio')
                            ->join('sucursals', 'sucursals.id_sucursal', '=', 'servicio_sucursal.sucursal_id_sucursal')
                            ->where('sucursals.id_sucursal','=', $id_sucursal)
                            ->where('servicios.especialidad_id',$id_especialidad)
                            ->get();

        return $servicio;

    }

    public function showserviciosucursalprofesional($id_especialidad, $id_sucursal){

        $user = Auth::user();

        $profesional = Profesional::where('user_id',$user->id)->with('sucursal')->first();

        $servicio = Servicio::select('servicios.*','profesional_servicio.*')
                            ->join('profesional_servicio','profesional_servicio.servicio_id_servicio','=','servicios.id_servicio')
                            ->join('sucursals', 'sucursals.id_sucursal', '=', 'profesional_servicio.sucursal_id_sucursal')
                            ->where('sucursals.id_sucursal','=', $id_sucursal)
                            ->where('servicios.especialidad_id',$id_especialidad)
                            ->where('profesional_servicio.profesional_id_profesional', $profesional->id_profesional)
                            ->get();

        return $servicio;

    }



    public function destroy(Sucursal $sucursal)
    {
        return $sucursal->delete();
    }
}
