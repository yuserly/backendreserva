<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHorarioProfesionalsTable extends Migration
{

    public function up()
    {
        Schema::create('horario_profesionals', function (Blueprint $table) {
            $table->id('id_horaprofesional');
            $table->unsignedBigInteger('profesional_id_profesional');
            $table->foreign('profesional_id_profesional')->references('id_profesional')->on('profesionals');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->unsignedBigInteger('dia_id');
            $table->foreign('dia_id')->references('id_dia')->on('dias');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('horario_profesionals');
    }
}
