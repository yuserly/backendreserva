<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendMailUser extends Mailable
{
    use Queueable, SerializesModels;

    public $title = "RESEVAS NOVAKIMEN - Información Usuario";
    public $nombres;
    public $apellidos;
    public $correo;
    public $password;
    public $estado;

    public function __construct($nombres, $apellidos, $correo, $password, $estado)
    {
        $this->title = $this->title;
        $this->nombres = $nombres;
        $this->apellidos = $apellidos;
        $this->correo = $correo;
        $this->password = $password;
        $this->estado = $estado;
    }

    public function build()
    {   
        $send_title = $this->title;
        $send_nombres = $this->nombres;
        $send_apellidos = $this->apellidos;
        $send_correo = $this->correo;
        $send_password = $this->password;
        $send_estado = $this->estado;

        return $this->view('mail.sendUsuario', compact('send_title', 'send_nombres', 'send_apellidos', 'send_correo', 'send_password', 'send_estado'))->subject($send_title);
    }
}
