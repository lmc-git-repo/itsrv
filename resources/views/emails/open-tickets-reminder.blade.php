<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Open/Ongoing Tickets Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; color: #101E33;">
    <h2>ITS-LMC Open/Ongoing Tickets Reminder</h2>

    <p>
        Good day IT Team,
    </p>

    <p>
        This is an automatic reminder for tickets that are still <strong>Open</strong> or <strong>Ongoing</strong>.
    </p>

    <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
        <thead>
            <tr style="background: #f1f5f9;">
                <th>Ticket No.</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date Opened</th>
                <th>Problem Description</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($tickets as $ticket)
                <tr>
                    <td>{{ $ticket->ticket_no }}</td>
                    <td>{{ $ticket->employee_name }}</td>
                    <td>{{ $ticket->department }}</td>
                    <td>{{ $ticket->category }}</td>
                    <td>{{ $ticket->status }}</td>
                    <td>{{ $ticket->date_opened }}</td>
                    <td>{{ $ticket->problem_description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 20px;">
        Please check the IT Ticketing System for updates.
    </p>

    <p>
        Thank you.
    </p>
</body>
</html>