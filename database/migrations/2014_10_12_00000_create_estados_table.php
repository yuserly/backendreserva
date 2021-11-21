<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstadosTable extends Migration
{

    public function up()
    {
        Schema::create('estados', function (Blueprint $table) {
            $table->id('id_estado');
            $table->string('nombre');
            $table->timestamps();
        });

        DB::table('estados')->insert(['nombre' => "Activo"]);
        DB::table('estados')->insert(['nombre' => "Pendiente"]);
        DB::table('estados')->insert(['nombre' => "Confirmada"]);
        DB::table('estados')->insert(['nombre' => "Pagada"]);
        DB::table('estados')->insert(['nombre' => "Pendiente Pago"]);
        DB::table('estados')->insert(['nombre' => "Rechazada"]);

    }

    public function down()
    {
        Schema::dropIfExists('estados');
    }
}
