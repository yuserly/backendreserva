<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrevensionsTable extends Migration
{

    public function up()
    {
        Schema::create('prevensions', function (Blueprint $table) {
            $table->id('id_prevension');
            $table->string('nombre');
            $table->softDeletes();
            $table->timestamps();
        });

        DB::table('prevensions')->insert(['nombre' => 'Particular']);
        DB::table('prevensions')->insert(['nombre' => 'Fonasa']);
        DB::table('prevensions')->insert(['nombre' => 'Banmedica']);
        DB::table('prevensions')->insert(['nombre' => 'Cruz Blanca']);
        DB::table('prevensions')->insert(['nombre' => 'Mas Vida']);
        DB::table('prevensions')->insert(['nombre' => 'Vida Tres']);
        DB::table('prevensions')->insert(['nombre' => 'Colmena']);
        DB::table('prevensions')->insert(['nombre' => 'Consalud']);
    }

    public function down()
    {
        Schema::dropIfExists('prevensions');
    }
}
