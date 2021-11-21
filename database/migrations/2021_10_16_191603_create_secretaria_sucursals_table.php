<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSecretariaSucursalsTable extends Migration
{

    public function up()
    {
        Schema::create('secretaria_sucursals', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('secretaria_id_secretaria'); 
            $table->foreign('secretaria_id_secretaria')->references('id_secretaria')->on('secretarias');
            $table->unsignedBigInteger('sucursal_id_sucursal'); 
            $table->foreign('sucursal_id_sucursal')->references('id_sucursal')->on('sucursals');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('secretaria_sucursals');
    }
}
