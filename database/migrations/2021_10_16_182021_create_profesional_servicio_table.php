<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfesionalServicioTable extends Migration
{

    public function up()
    {
        Schema::create('profesional_servicio', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('profesional_id_profesional');
            $table->foreign('profesional_id_profesional')->references('id_profesional')->on('profesionals');
            $table->unsignedBigInteger('servicio_id_servicio');
            $table->foreign('servicio_id_servicio')->references('id_servicio')->on('servicios');
            $table->unsignedBigInteger('sucursal_id_sucursal');
            $table->foreign('sucursal_id_sucursal')->references('id_sucursal')->on('sucursals');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('profesional_servicio');
    }
}
