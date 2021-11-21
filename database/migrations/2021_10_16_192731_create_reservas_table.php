<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservasTable extends Migration
{
    public function up()
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id('id_reserva');
            $table->string('codigo')->unique();
            $table->date('dia');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->unsignedBigInteger('paciente_id');
            $table->foreign('paciente_id')->references('id_paciente')->on('pacientes');
            $table->unsignedBigInteger('servicio_id');
            $table->foreign('servicio_id')->references('id_servicio')->on('servicios');
            $table->unsignedBigInteger('profesional_id');
            $table->foreign('profesional_id')->references('id_profesional')->on('profesionals');
            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id_estado')->on('estados');
            $table->unsignedBigInteger('sucursal_id');
            $table->foreign('sucursal_id')->references('id_sucursal')->on('sucursals');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reservas');
    }
}
