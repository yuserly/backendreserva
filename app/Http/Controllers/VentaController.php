<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Venta;
use Illuminate\Http\Request;

date_default_timezone_set("America/Santiago");


class VentaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $venta  = Venta::create([
            'reserva_id' => $request->id_reserva ,
            'paciente_id' => $request->id_paciente,
            'mediopago_id' => $request->mediopago["id_mediopago"],
            'sub_total' => (int)$request->subtotal,
            'porcentaje_desc' => $request->porcentajedescuento,
            'precio_desc' => $request->precio_descuento,
            'iva' => $request->iva,
            'total' => $request->total,
            'codigo_boucher' => $request->codigo_boucher,
            'codigo_bono_fonasa' => $request->codigo_bono_fonasa,
            'boleta_honorario' => $request->picked,
            'n_honorario' => $request->n_honorario,
            'estado_id' => 4,
            'sucursal_id' => $request->id_sucursal,
            'retencion' => $request->retencion
        ]);

        if($venta){

            Reserva::where('id_reserva',$request->id_reserva)->update([
                'estado_id' => 4
            ]);

            return 1;

        }else{
            return 0;
        }
    }


    public function show($id_sucursal)
    {
        return Venta::where([['sucursal_id',$id_sucursal],['estado_id', '!=', 7]])->whereDate('created_at', '=', date('Y-m-d'))->with('medio','estado','reserva.paciente.prevision','reserva.profesional','reserva.servicio')->get();
    }

    public function buscarventafecha(Request $request)
    {
        return Venta::where([['sucursal_id',$request->id_sucursal]])->whereDate('created_at', '=', $request->fecha)->with('medio','estado','reserva.paciente.prevision','reserva.profesional','reserva.servicio')->get();

    }


    public function buscarinformediario(Request $request)
    {

        if($request->especialidad_id){


            $ventas = Venta::select('*','pacientes.nombres as nombres_paciente', 'pacientes.apellidos as apellidos_paciente',
                                    'pacientes.rut as rut_paciente','pacientes.email as email_paciente','profesionals.nombres as nombres_profesional', 'profesionals.apellidos as apellidos_profesional',
                                    'profesionals.rut as rut_profesional', 'ventas.estado_id as estado_venta', 'servicios.nombre as nombre_servicio',
                                    'ventas.created_at as fecha_venta','prevensions.nombre as prevension_nombre', 'medio_pagos.nombre as mediopago')
                            ->join('reservas','reservas.id_reserva','=','ventas.reserva_id')
                            ->join('pacientes','pacientes.id_paciente','=','reservas.paciente_id')
                            ->join('prevensions','prevensions.id_prevension','=','pacientes.prevension_id')
                            ->join('profesionals','profesionals.id_profesional','=','reservas.profesional_id')
                            ->join('servicios','servicios.id_servicio','=','reservas.servicio_id')
                            ->join('estados','estados.id_estado','=','ventas.estado_id')
                            ->join('medio_pagos','medio_pagos.id_mediopago','=','ventas.mediopago_id')
                            ->where('ventas.sucursal_id','=',$request->id_sucursal)
                            ->where('servicios.especialidad_id','=',$request->especialidad_id["id_especialidad"])
                            ->where('ventas.estado_id','=',4)
                            ->whereDate('ventas.created_at', '=', $request->fecha)
                            ->get();

        }else{
            $ventas = Venta::select('*','pacientes.nombres as nombres_paciente', 'pacientes.apellidos as apellidos_paciente',
                                    'pacientes.rut as rut_paciente','pacientes.email as email_paciente','profesionals.nombres as nombres_profesional', 'profesionals.apellidos as apellidos_profesional',
                                    'profesionals.rut as rut_profesional', 'ventas.estado_id as estado_venta', 'servicios.nombre as nombre_servicio',
                                    'ventas.created_at as fecha_venta','prevensions.nombre as prevension_nombre', 'medio_pagos.nombre as mediopago')
                            ->join('reservas','reservas.id_reserva','=','ventas.reserva_id')
                            ->join('pacientes','pacientes.id_paciente','=','reservas.paciente_id')
                            ->join('prevensions','prevensions.id_prevension','=','pacientes.prevension_id')
                            ->join('profesionals','profesionals.id_profesional','=','reservas.profesional_id')
                            ->join('servicios','servicios.id_servicio','=','reservas.servicio_id')
                            ->join('estados','estados.id_estado','=','ventas.estado_id')
                            ->join('medio_pagos','medio_pagos.id_mediopago','=','ventas.mediopago_id')
                            ->where('ventas.sucursal_id','=',$request->id_sucursal)
                            ->where('ventas.estado_id','=',4)
                            ->whereDate('ventas.created_at', '=', $request->fecha)
                            ->get();

        }

        return $ventas;

    }



    public function buscarinformemensual(Request $request)
    {

        if($request->especialidad_id){


            $ventas = Venta::select('*','pacientes.nombres as nombres_paciente', 'pacientes.apellidos as apellidos_paciente',
                                    'pacientes.rut as rut_paciente','pacientes.email as email_paciente','profesionals.nombres as nombres_profesional', 'profesionals.apellidos as apellidos_profesional',
                                    'profesionals.rut as rut_profesional', 'ventas.estado_id as estado_venta', 'servicios.nombre as nombre_servicio',
                                    'ventas.created_at as fecha_venta','prevensions.nombre as prevension_nombre', 'medio_pagos.nombre as mediopago')
                            ->join('reservas','reservas.id_reserva','=','ventas.reserva_id')
                            ->join('pacientes','pacientes.id_paciente','=','reservas.paciente_id')
                            ->join('prevensions','prevensions.id_prevension','=','pacientes.prevension_id')
                            ->join('profesionals','profesionals.id_profesional','=','reservas.profesional_id')
                            ->join('servicios','servicios.id_servicio','=','reservas.servicio_id')
                            ->join('estados','estados.id_estado','=','ventas.estado_id')
                            ->join('medio_pagos','medio_pagos.id_mediopago','=','ventas.mediopago_id')
                            ->where('ventas.sucursal_id','=',$request->id_sucursal)
                            ->where('servicios.especialidad_id','=',$request->especialidad_id["id_especialidad"])
                            ->where('ventas.estado_id','=',4)
                            ->whereBetween('ventas.created_at', [$request->fecha_inicio." 00:00:00", $request->fecha_fin." 23:59:59"])
                            ->get();

        }else{
            $ventas = Venta::select('*','pacientes.nombres as nombres_paciente', 'pacientes.apellidos as apellidos_paciente',
                                    'pacientes.rut as rut_paciente','pacientes.email as email_paciente','profesionals.nombres as nombres_profesional', 'profesionals.apellidos as apellidos_profesional',
                                    'profesionals.rut as rut_profesional', 'ventas.estado_id as estado_venta', 'servicios.nombre as nombre_servicio',
                                    'ventas.created_at as fecha_venta','prevensions.nombre as prevension_nombre', 'medio_pagos.nombre as mediopago')
                            ->join('reservas','reservas.id_reserva','=','ventas.reserva_id')
                            ->join('pacientes','pacientes.id_paciente','=','reservas.paciente_id')
                            ->join('prevensions','prevensions.id_prevension','=','pacientes.prevension_id')
                            ->join('profesionals','profesionals.id_profesional','=','reservas.profesional_id')
                            ->join('servicios','servicios.id_servicio','=','reservas.servicio_id')
                            ->join('estados','estados.id_estado','=','ventas.estado_id')
                            ->join('medio_pagos','medio_pagos.id_mediopago','=','ventas.mediopago_id')
                            ->where('ventas.sucursal_id','=',$request->id_sucursal)
                            ->where('ventas.estado_id','=',4)
                            ->whereBetween('ventas.created_at', [$request->fecha_inicio." 00:00:00", $request->fecha_fin." 23:59:59"])
                            ->get();

        }

        return $ventas;

    }




    public function cambiarestadoventa(Request $request)
    {
       $venta =  Venta::where('id_venta',$request->id_venta)->update([
                              'estado_id' => $request->estado
                            ]);

        if($venta){

            if($request->estado == 4 ){
                Reserva::where('id_reserva', $request->id_reserva)->update([
                    'estado_id' => 3
                ]);
            }else if($request->estado == 5){

                Reserva::where('id_reserva', $request->id_reserva)->update([
                    'estado_id' => 2
                ]);
            }

            return 1;

        }else{

            return 0;
        }

    }

    public function eliminarventa(Request $request)
    {   
       Venta::updateOrCreate(['id_venta' => $request->id_venta],['estado_id' => $request->estado]);

       Reserva::where('id_reserva', $request->id_reserva)->update([
        'estado_id' => $request->estado
       ]);

       return "Venta a sido anulada exitosamente";

    }

}
