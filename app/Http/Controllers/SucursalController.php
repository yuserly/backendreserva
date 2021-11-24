<?php

namespace App\Http\Controllers;

use App\Models\Profesional;
use App\Models\Servicio;
use App\Models\Sucursal;
use App\Models\profesional_servicio;
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

    public function showServicios($id, $profesional)
    {   
        $sucursal = Sucursal::where('id_sucursal',$id)->first();
        $sucursal->load('serviciosucursal');

        $idEspecialidad = Profesional::find($profesional); //obtenemos la ID de la especialidad
        $servicios = array();
        
        foreach ($sucursal->serviciosucursal as $key => $value) {
            if($value->especialidad_id == $idEspecialidad->especialidad_id){
                array_push($servicios, $value);
            }
        }

        $info = profesional_servicio::where('sucursal_id_sucursal', $id)->where('profesional_id_profesional', $profesional)->get();
        $info->load('sucursal', 'servicio');

        $datos = array();
        $servicio_id_servicio = array();
        $sucursal_id_sucursal = $sucursal;

        foreach ($info as $key => $value) {
          
            array_push($servicio_id_servicio, $value->servicio);
        }

        $datos = ['sucursal_id_sucursal' => $sucursal_id_sucursal, 'servicio_id_servicio' => $servicio_id_servicio];

        return ['serviciosSucursal' => $servicios, 'formrequest' => $datos];
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
