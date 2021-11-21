<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBloqueoHorasTable extends Migration
{

    public function up()
    {
        Schema::create('bloqueo_horas', function (Blueprint $table) {
            $table->id('id_bloqueohora');
            $table->date('dia');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->unsignedBigInteger('profesional_id_profesional');
            $table->foreign('profesional_id_profesional')->references('id_profesional')->on('profesionals');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bloqueo_horas');
    }
}
