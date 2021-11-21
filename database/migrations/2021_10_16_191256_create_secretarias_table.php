<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSecretariasTable extends Migration
{

    public function up()
    {
        Schema::create('secretarias', function (Blueprint $table) {
            $table->id('id_secretaria');
            $table->string('nombres');
            $table->string('apellidos');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->softDeletes();
            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('secretarias');
    }
}
