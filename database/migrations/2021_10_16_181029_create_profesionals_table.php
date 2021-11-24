<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfesionalsTable extends Migration
{

    public function up()
    {
        Schema::create('profesionals', function (Blueprint $table) {
            $table->id('id_profesional');
            $table->string('rut');
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('profesion');
            $table->string('url_perfil');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('especialidad_id');
            $table->foreign('especialidad_id')->references('id_especialidad')->on('especialidads');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('profesionals');
    }
}
