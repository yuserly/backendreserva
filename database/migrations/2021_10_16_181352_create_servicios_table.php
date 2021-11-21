<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiciosTable extends Migration
{

    public function up()
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->id('id_servicio');
            $table->string('nombre');
            $table->string('precio_particular');
            $table->string('precio_fonasa')->nullable();
            $table->string('precio_isapre')->nullable();
            $table->unsignedBigInteger('especialidad_id');
            $table->foreign('especialidad_id')->references('id_especialidad')->on('especialidads');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('servicios');
    }
}
