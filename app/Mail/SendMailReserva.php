<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendMailReserva extends Mailable
{
    use Queueable, SerializesModels;

    public $title = "RESEVAS NOVAKIMEN - Información Reserva";
    public $rut;
    public $nombres;
    public $apellidos;
    public $correo;
    public $dia;
    public $horario;
    public $pnombres;
    public $papellidos;
    public $sucursal;
    public $sucursaldireccion;
    public $estado;

    public function __construct($rut, $nombres, $apellidos, $correo, $dia, $horario, $pnombres, $papellidos, $sucursal, $sucursaldireccion, $estado)
    {
        $this->title = $this->title;
        $this->rut = $rut;
        $this->nombres = $nombres;
        $this->apellidos = $apellidos;
        $this->correo = $correo;
        $this->dia = $dia;
        $this->horario = $horario;
        $this->pnombres = $pnombres;
        $this->papellidos = $apellidos;
        $this->sucursal = $sucursal;
        $this->sucursaldireccion = $sucursaldireccion;
        $this->estado = $estado;
    }

    public function build()
    {   
        $send_title = $this->title;
        $send_rut   = $this->rut;
        $send_nombres = $this->nombres;
        $send_apellidos = $this->apellidos;
        $send_correo = $this->correo;
        $send_dia = $this->dia;
        $send_horario = $this->horario;
        $send_pnombres = $this->pnombres;
        $send_papellidos = $this->papellidos;
        $send_sucursal = $this->sucursal;
        $send_sucursaldireccion = $this->sucursaldireccion;
        $send_estado = $this->estado;

        return $this->view('mail.sendReservas', compact('send_rut', 'send_nombres', 'send_apellidos', 'send_correo', 'send_dia', 'send_horario', 'send_pnombres', 'send_papellidos', 'send_sucursal', 'send_sucursaldireccion','send_estado'))->subject($send_title);
    }
}
