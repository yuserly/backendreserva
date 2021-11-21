<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BloqueoHoraController;
use App\Http\Controllers\DiaController;
use App\Http\Controllers\EspecialidadController;
use App\Http\Controllers\MedioPagoController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\PrevensionController;
use App\Http\Controllers\ProfesionalController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\SecretariaController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\VentaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// login

Route::post('login',[AuthController::class,'login']);


Route::middleware('auth:sanctum')->group(function(){

    // especialidades

    Route::get('obtenerespecialidad',[EspecialidadController::class,'show']);
    Route::get('validarnombreespecialidad/{nombre}',[EspecialidadController::class,'validarnombre']);
    Route::post('crearespecialidad',[EspecialidadController::class,'store']);
    Route::delete('eliminarespecialidad/{especialidad}',[EspecialidadController::class,'destroy']);

    // servicios


    Route::get('obtenerservicios',[ServicioController::class,'show']);
    Route::get('obtenerservicios/sucursal/{id}',[SucursalController::class,'showServicios']);
    Route::get('validarnombreservicio/{nombre}',[ServicioController::class,'validarnombre']);
    Route::post('crearservicio',[ServicioController::class,'store']);
    Route::delete('eliminarservicio/{servicio}',[ServicioController::class,'destroy']);
    Route::get('obtenerservicios/{id_especialidad}/{id_sucursal}',[SucursalController::class,'showserviciosucursal']);
    Route::get('obtenerserviciosprofesional/{id_especialidad}/{id_sucursal}',[SucursalController::class,'showserviciosucursalprofesional']);


    // dias

    Route::get('obtenerdia',[DiaController::class,'show']);

    // paciente

    Route::get('obtenerpaciente',[PacienteController::class,'show']);
    Route::get('validaremailpaciente/{email}',[PacienteController::class,'validaremail']);
    Route::get('validarrutpaciente/{rut}',[PacienteController::class,'validarrut']);
    Route::post('crearpaciente',[PacienteController::class,'store']);
    Route::delete('eliminarpaciente/{paciente}',[PacienteController::class,'destroy']);
    Route::post('cambiarprevisionpaciente',[PacienteController::class,'cambiarprevisionpaciente']);
    // prevision

    Route::get('obtenerprevision',[PrevensionController::class,'show']);
    Route::get('validarnombreprevision/{nombre}',[PrevensionController::class,'validarnombre']);
    Route::post('crearprevision',[PrevensionController::class,'store']);
    Route::delete('eliminarprevision/{prevension}',[PrevensionController::class,'destroy']);

    // validaremail en user


    Route::get('validaremail/{email}',[ProfesionalController::class,'validaremail']);


    // profesionales

    Route::get('obtenerprofesional',[ProfesionalController::class,'show']);
    Route::get('obtenerprofesional/{id}',[ProfesionalController::class,'showxservicio']);
    Route::get('validarrutprofesional/{rut}',[ProfesionalController::class,'validarrut']);
    Route::post('crearprofesional',[ProfesionalController::class,'store']);
    Route::delete('eliminarprofesional/{profesional}',[ProfesionalController::class,'destroy']);
    Route::post('configprofesional',[ProfesionalController::class,'configprofesional']);
    Route::post('traerhorario',[ProfesionalController::class,'traerhorario']);
    Route::post('serviciosprofesional',[ProfesionalController::class,'servicioprofesional']);
    Route::get('obtenerprofesional/{id_servicio}/{id_sucursal}',[ProfesionalController::class,'showserviciosucursal']);

    Route::post('traerhorariounico',[ProfesionalController::class,'traerhorariounico']);

    // secretarias

    Route::get('obtenersecretaria',[SecretariaController::class,'show']);
    Route::post('crearsecretaria',[SecretariaController::class,'store']);
    Route::delete('eliminarsecretaria/{secretaria}',[SecretariaController::class,'destroy']);

    // sucursal

    Route::get('obtenersucursal',[SucursalController::class,'show']);
    Route::get('validarnombresucursal//{nombre}',[SucursalController::class,'validarnombre']);
    Route::post('crearsucursal',[SucursalController::class,'store']);
    Route::delete('eliminarsucursal/{sucursal}',[SucursalController::class,'destroy']);

    // reserva

    Route::post('crearreserva',[ReservaController::class,'store']);
    Route::get('traerreserva/{id}',[ReservaController::class,'traerreserva']);
    Route::post('editarreserva',[ReservaController::class,'editar']);
    Route::post('validarhora',[ReservaController::class,'validarhora']);
    Route::delete('deletereserva/{reserva}',[ReservaController::class,'destroy']);
    Route::post('validarhoraprofesional',[ReservaController::class,'validarhoraprofesional']);
    Route::post('crearreservaprofesional',[ReservaController::class,'storeprofesional']);
    Route::post('buscarreserva',[ReservaController::class,'buscarreserva']);
    Route::post('traerreservadia',[ReservaController::class,'traerreservadia']);

    // venta

    Route::post('confirmarreserva',[VentaController::class,'store']);
    Route::get('obtenerventas/{id_sucursal}',[VentaController::class,'show']);
    Route::post('buscarventafecha',[VentaController::class,'buscarventafecha']);
    Route::post('cambiarestadoventa',[VentaController::class,'cambiarestadoventa']);
    Route::post('eliminarventa',[VentaController::class,'eliminarventa']);
    // bloqueo hora

    Route::get('obtenerbloqueohora',[BloqueoHoraController::class,'show']);
    Route::get('validardia/{dia}',[BloqueoHoraController::class,'validardia']);
    Route::post('crearbloqueohora',[BloqueoHoraController::class,'store']);
    Route::delete('eliminarbloqueohora/{bloqueoHora}',[BloqueoHoraController::class,'destroy']);

    // medios de pagos
    Route::get('obtenermediopago',[MedioPagoController::class,'show']);

    // logout
    Route::post('logout',[AuthController::class,'logout']);
});


