<?php

namespace App\Http\Controllers;

use App\Models\Prevension;
use Illuminate\Http\Request;

class PrevensionController extends Controller
{
    public function validarnombre($nombre)
    {
        $prevision =  Prevension::where('nombre', $nombre)->first();

        if($prevision){
            return 1;
        }else{

            return 0;
        }
    }

    public function store(Request $request)
    {
        $prevision = Prevension::updateOrCreate(['id_prevension'=>$request->id_prevension],
                                                    [
                                                      'nombre' => $request->nombre
                                                    ]);

        return $prevision;
    }

    public function show(Prevension $prevension)
    {
        return Prevension::all();
    }

    public function destroy(Prevension $prevension)
    {
        return $prevension->delete();
    }
}
