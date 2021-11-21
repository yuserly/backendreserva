<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedioPagosTable extends Migration
{

    public function up()
    {
        Schema::create('medio_pagos', function (Blueprint $table) {
            $table->id('id_mediopago');
            $table->string('nombre');
            $table->timestamps();
        });

        DB::table('medio_pagos')->insert(['nombre' => 'Efectivo']);
        DB::table('medio_pagos')->insert(['nombre' => 'Debito']);
        DB::table('medio_pagos')->insert(['nombre' => 'Credito']);
        DB::table('medio_pagos')->insert(['nombre' => 'Transferencia']);
    }

    public function down()
    {
        Schema::dropIfExists('medio_pagos');
    }
}
