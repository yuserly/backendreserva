<?php

namespace App\Notifications;

use App\Channels\Messages\WhatsAppMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;
use App\Models\Reserva;

class ReservaNotificacion extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public $reserva;
    public function __construct(Reserva $reserva)
    {
        $this->reserva = $reserva;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [WhatsAppChannel::class];
    }

    public function toWhatsApp($notifiable)
  {
    $company = 'Empresa';


    return (new WhatsAppMessage)
        ->content("{$company}, tu reserva {$this->reserva->codigo} para el día {$this->reserva->dia} a las {$this->reserva->hora_inicio} ha sido agenda correctamente.");
  }
}
