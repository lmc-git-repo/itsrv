<?php

namespace App\Console\Commands;

use App\Mail\OpenTicketsReminderMail;
use App\Models\Ticket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendOpenTicketsReminder extends Command
{
    protected $signature = 'tickets:send-open-reminders';

    protected $description = 'Send reminder email to superadmins for open and ongoing tickets';

    public function handle()
    {
        $tickets = Ticket::whereIn('status', ['Open', 'Ongoing'])
            ->latest()
            ->get();

        if ($tickets->isEmpty()) {
            $this->info('No open or ongoing tickets found.');
            return Command::SUCCESS;
        }

        // TEMPORARY HARDCODED EMAILS FOR TESTING
        $superadminEmails = collect([
            'l.larracas@lagunametts.com',
            'j.tubaying@lagunametts.com',
            'r.pasion@lagunametts.com',
        ]);

        Mail::to($superadminEmails)->send(new OpenTicketsReminderMail($tickets));

        $this->info('Open/Ongoing tickets reminder email sent successfully.');

        return Command::SUCCESS;
    }
}