<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePerfilsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('perfils', function (Blueprint $table) {
            $table->id('id_perfil');
            $table->string('nombre');
            $table->timestamps();
        });

        DB::table('perfils')->insert(['nombre' => "admnistrador"]);
        DB::table('perfils')->insert(['nombre' => "secretaria"]);
        DB::table('perfils')->insert(['nombre' => "profesional"]);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('perfils');
    }
}
