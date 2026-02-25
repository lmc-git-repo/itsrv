<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('Tickets/Index', [
            'tickets' => Ticket::with('creator')->latest()->paginate(10), // ✅ PAGINATION ONLY
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_name' => 'required|string',
            'department' => 'required|string',
            'category' => 'required|string',
            'problem_description' => 'required|string',
            'status' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'employee_name' => $request->employee_name,
            'department' => $request->department,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'status' => $request->status,
            'created_by' => Auth::id(), // ✅ FIXED
        ]);

        // ✅ AUTO-GENERATE FORMATTED TICKET NO
        $ticket->update([
            'ticket_no' => 'TCK-' . str_pad($ticket->id, 4, '0', STR_PAD_LEFT),
        ]);

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket created successfully.'); // ✅ FLASH MESSAGE
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket->load('creator'),
        ]);
    }

    public function edit(Ticket $ticket)
    {
        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket,
        ]);
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket deleted successfully.');
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'employee_name' => 'required|string',
            'department' => 'required|string',
            'category' => 'required|string',
            'problem_description' => 'required|string',
            'status' => 'required|string',
            'problem_solution' => 'nullable|string',
        ]);

        $ticket->update([
            'employee_name' => $request->employee_name,
            'department' => $request->department,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'status' => $request->status,
            'problem_solution' => $request->problem_solution,
        ]);

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket updated successfully.');
    }
}