<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentaReservasTable extends Migration
{

    public function up()
    {
        Schema::create('venta_reservas', function (Blueprint $table) {
            $table->id('id_ventareserva');
            $table->date('dia');
            $table->integer('sub_total');
            $table->integer('porcentaje_desc')->nullable();
            $table->integer('precio_desc')->nullable();
            $table->integer('total');
            $table->unsignedBigInteger('prevension_id'); 
            $table->foreign('prevension_id')->references('id_prevension')->on('prevensions');
            $table->unsignedBigInteger('reserva_id'); 
            $table->foreign('reserva_id')->references('id_reserva')->on('reservas');
            $table->unsignedBigInteger('estado_pago_id'); 
            $table->foreign('estado_pago_id')->references('id_estado')->on('estados');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('venta_reservas');
    }
}
