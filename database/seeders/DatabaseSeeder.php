<?php

namespace Database\Seeders;
use App\Models\User;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $user1 = User::create([
            'name' => 'Yuserly Bracho',
            'email'     => 'yuserlybracho@gmail.com',
            'password'  => Hash::make('12345678'),
            'perfil_id' => 1
         ]);
    }
}
