<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSucursalsTable extends Migration
{

    public function up()
    {
        Schema::create('sucursals', function (Blueprint $table) {
            $table->id('id_sucursal');
            $table->string('nombre');
            $table->string('direccion');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sucursals');
    }
}
