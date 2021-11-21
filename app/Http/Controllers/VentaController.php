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
            'porcentaje_desc' => $request->porcentajedescuent,
            'precio_desc' => $request->precio_descuento,
            'iva' => $request->iva,
            'total' => $request->total,
            'codigo_boucher' => $request->codigo_boucher,
            'codigo_bono_fonasa' => $request->codigo_bono_fonasa,
            'boleta_honorario' => $request->boleta_honorario,
            'n_honorario' => $request->boleta_honorario,
            'estado_id' => $request->estado["id_estado"],
            'sucursal_id' => $request->id_sucursal
        ]);

        if($venta){

            Reserva::where('id_reserva',$request->id_reserva)->update([
                'estado_id' => 3
            ]);

            return 1;

        }else{

            return 0;

        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function show($id_sucursal)
    {
        return Venta::where('sucursal_id',$id_sucursal)->whereDate('created_at', '=', date('Y-m-d'))->with('medio','estado','reserva.paciente.prevision','reserva.profesional','reserva.servicio')->get();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function buscarventafecha(Request $request)
    {
        return Venta::where([['sucursal_id',$request->id_sucursal]])->whereDate('created_at', '=', $request->fecha)->with('medio','estado','reserva.paciente.prevision','reserva.profesional','reserva.servicio')->get();

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
       $venta =  Venta::find($request->id_venta)->delete();

        if($venta){

            Reserva::where('id_reserva', $request->id_reserva)->update([
                'estado_id' => 2
            ]);
            return 1; 

        }else{

            return 0;
        }

    }
    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Venta $venta)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Venta  $venta
     * @return \Illuminate\Http\Response
     */
    public function destroy(Venta $venta)
    {
        //
    }
}
