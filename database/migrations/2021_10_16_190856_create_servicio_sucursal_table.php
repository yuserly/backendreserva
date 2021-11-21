<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicioSucursalTable extends Migration
{

    public function up()
    {
        Schema::create('servicio_sucursal', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('servicio_id_servicio'); 
            $table->foreign('servicio_id_servicio')->references('id_servicio')->on('servicios');
            $table->unsignedBigInteger('sucursal_id_sucursal'); 
            $table->foreign('sucursal_id_sucursal')->references('id_sucursal')->on('sucursals');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('servicio_sucursal');
    }
}
