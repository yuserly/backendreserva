<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiasTable extends Migration
{

    public function up()
    {
        Schema::create('dias', function (Blueprint $table) {
            $table->id('id_dia');
            $table->string('nombre');
            $table->integer('dia');
            $table->timestamps();
        });


        DB::table('dias')->insert(['nombre' => 'Lunes', 'dia' => 1]);
        DB::table('dias')->insert(['nombre' => 'Martes', 'dia' => 2]);
        DB::table('dias')->insert(['nombre' => 'Miercoles', 'dia' => 3]);
        DB::table('dias')->insert(['nombre' => 'Jueves', 'dia' => 4]);
        DB::table('dias')->insert(['nombre' => 'Viernes', 'dia' => 5]);
        DB::table('dias')->insert(['nombre' => 'Sabados', 'dia' => 6]);
        DB::table('dias')->insert(['nombre' => 'Domingo', 'dia' => 7]);
    }

    public function down()
    {
        Schema::dropIfExists('dias');
    }
}
