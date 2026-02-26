<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('Tickets/Index', [
            'tickets' => Ticket::with(['creator', 'resolver'])->latest()->paginate(10), // ✅ CHANGED (added resolver)
            'users'   => User::select('id', 'name')->orderBy('name')->get(),
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
            'date_opened' => 'required|date', // ✅ INSERTED
        ]);

        $ticket = Ticket::create([
            'employee_name' => $request->employee_name,
            'department' => $request->department,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'status' => $request->status,
            'date_opened' => $request->date_opened, // ✅ INSERTED
            'created_by' => Auth::id(),
        ]);

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
            'ticket' => $ticket->load(['creator', 'resolver']), // ✅ CHANGED (added resolver)
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
            'date_opened' => 'required|date', 
            'problem_solution' => 'nullable|string',
            'resolved_by' => 'nullable|exists:users,id',
        ]);

        $ticket->update([
            'employee_name' => $request->employee_name,
            'department' => $request->department,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'status' => $request->status,
            'date_opened' => $request->date_opened, 
            'problem_solution' => $request->problem_solution,
            'resolved_by' => $request->resolved_by,
        ]);

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket updated successfully.');
    }
}