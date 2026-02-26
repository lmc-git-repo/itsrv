<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['creator', 'resolver'])->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('ticket_no', 'like', "%{$request->search}%")
                  ->orWhere('employee_name', 'like', "%{$request->search}%")
                  ->orWhere('department', 'like', "%{$request->search}%")
                  ->orWhere('problem_description', 'like', "%{$request->search}%")
                  ->orWhere('status', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->department) {
            $query->where('department', $request->department);
        }

        if ($request->resolved_by) {
            $query->where('resolved_by', $request->resolved_by);
        }

        return Inertia::render('Tickets/Index', [
            'tickets' => $query->paginate(10)->withQueryString(),
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
            'date_opened' => 'required|date',
            'resolved_at' => 'nullable|date',
        ]);

        $ticket = Ticket::create([
            'employee_name' => $request->employee_name,
            'department' => $request->department,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'status' => $request->status,
            'date_opened' => $request->date_opened,
            'resolved_at' => $request->status === 'Resolved' ? $request->resolved_at : null,
            'created_by' => Auth::id(),
        ]);

        $ticket->update([
            'ticket_no' => 'TCK-' . str_pad($ticket->id, 4, '0', STR_PAD_LEFT),
        ]);

        return redirect()->route('tickets.index')->with('success', 'Ticket created successfully.');
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket->load(['creator', 'resolver']),
        ]);
    }

    public function edit(Ticket $ticket)
    {
        return Inertia::render('Tickets/Edit', ['ticket' => $ticket]);
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return redirect()->route('tickets.index')->with('success', 'Ticket deleted successfully.');
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
            'resolved_at' => 'nullable|date',
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
            'resolved_at' => $request->status === 'Resolved' ? $request->resolved_at : null,
        ]);

        return redirect()->route('tickets.index')->with('success', 'Ticket updated successfully.');
    }
}