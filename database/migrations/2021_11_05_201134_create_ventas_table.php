<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentasTable extends Migration
{

    public function up()
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id('id_venta');
            $table->unsignedBigInteger('reserva_id');
            $table->foreign('reserva_id')->references('id_reserva')->on('reservas');
            $table->unsignedBigInteger('paciente_id');
            $table->foreign('paciente_id')->references('id_paciente')->on('pacientes');
            $table->unsignedBigInteger('mediopago_id');
            $table->foreign('mediopago_id')->references('id_mediopago')->on('medio_pagos');
            $table->integer('sub_total');
            $table->integer('porcentaje_desc')->nullable();
            $table->integer('precio_desc')->nullable();
            $table->integer('iva');
            $table->integer('total');
            $table->string('codigo_boucher')->nullable();
            $table->string('codigo_bono_fonasa')->nullable();
            $table->boolean('boleta_honorario')->nullable();
            $table->integer('n_honorario')->nullable();
            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id_estado')->on('estados');
            $table->unsignedBigInteger('sucursal_id');
            $table->foreign('sucursal_id')->references('id_sucursal')->on('sucursals');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ventas');
    }
}
