<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEspecialidadsTable extends Migration
{

    public function up()
    {
        Schema::create('especialidads', function (Blueprint $table) {
            $table->id('id_especialidad');
            $table->string('nombre');
            $table->string('intervalo');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('especialidads');
    }
}
