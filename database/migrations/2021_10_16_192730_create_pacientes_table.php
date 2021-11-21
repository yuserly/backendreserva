<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePacientesTable extends Migration
{

    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id('id_paciente');
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('email')->unique();
            $table->string('rut');
            $table->string('celular');
            $table->string('direccion');
            $table->unsignedBigInteger('prevension_id');
            $table->foreign('prevension_id')->references('id_prevension')->on('prevensions');
            $table->softDeletes();
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
        Schema::dropIfExists('pacientes');
    }
}
