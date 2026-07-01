<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OpenTicketsReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $tickets;

    public function __construct($tickets)
    {
        $this->tickets = $tickets;
    }

    public function build()
    {
        return $this->subject('ITS-LMC Open/Ongoing Tickets Reminder')
            ->view('emails.open-tickets-reminder');
    }
}