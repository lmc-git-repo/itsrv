<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with([
            'creator',
            'resolver',
            'assignee',
        ])->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('ticket_no', 'like', "%{$request->search}%")
                  ->orWhere('tracking_code', 'like', "%{$request->search}%")
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

        $tickets = $query->paginate(10)->withQueryString();

        if ($tickets->isEmpty() && $tickets->currentPage() > 1) {
            return redirect()->route('tickets.index', array_filter([
                'search' => $request->search,
                'status' => $request->status,
                'department' => $request->department,
                'resolved_by' => $request->resolved_by,
                'page' => $tickets->lastPage(),
            ]));
        }

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'users' => User::where('role', 'superadmin')
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function latestEmployeeTicket()
    {
        $ticket = Ticket::whereNull('created_by')
            ->latest()
            ->select(
                'id',
                'ticket_no',
                'employee_name',
                'department',
                'created_at'
            )
            ->first();

        return response()->json($ticket);
    }

    public function updateITHeartbeat(Request $request)
    {
        $user = $request->user();

        if (
            !$user ||
            $user->role !== 'superadmin' ||
            !in_array(strtolower($user->name), [
                'r.pasion',
                'j.tubaying',
                'l.larracas',
            ])
        ) {
            return response()->json([
                'success' => false,
            ], 403);
        }

        $user->update([
            'last_seen_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'last_seen_at' => $user->last_seen_at,
        ]);
    }

    public function employeeIndex(Request $request)
    {
        $ticketsQuery = Ticket::with('assignee')
            ->whereNull('created_by');

        if ($request->tracking_code) {
            $searchKeyword = strtoupper(
                trim($request->tracking_code)
            );

            $ticketsQuery->where(function ($query) use ($searchKeyword) {
                $query->where(
                    'tracking_code',
                    'like',
                    "%{$searchKeyword}%"
                )
                ->orWhere(
                    'ticket_no',
                    'like',
                    "%{$searchKeyword}%"
                )
                ->orWhere(
                    'employee_name',
                    'like',
                    "%{$searchKeyword}%"
                );
            });
        }

        $tickets = $ticketsQuery
            ->latest()
            ->get();

        $itUsers = User::whereIn('name', [
            'r.pasion',
            'j.tubaying',
            'l.larracas',
        ])
            ->select(
                'id',
                'name',
                'last_seen_at'
            )
            ->get()
            ->keyBy(function ($user) {
                return strtolower($user->name);
            });

        $itStaffOrder = [
            [
                'name' => 'r.pasion',
                'display_name' => 'R.Pasion',
            ],
            [
                'name' => 'j.tubaying',
                'display_name' => 'J.Tubaying',
            ],
            [
                'name' => 'l.larracas',
                'display_name' => 'L.Larracas',
            ],
        ];

        $itStaffStatuses = collect($itStaffOrder)
            ->map(function ($staff) use ($itUsers) {
                $user = $itUsers->get(
                    strtolower($staff['name'])
                );

                $isOnDuty = false;

                if ($user) {
                    $isOnDuty = DB::table('sessions')
                        ->where('user_id', $user->id)
                        ->exists();
                }

                return [
                    'name' => $staff['display_name'],
                    'on_duty' => $isOnDuty,
                ];
            })
            ->values();

        return Inertia::render('EmployeeTickets/Index', [
            'tickets' => $tickets,
            'tracking_code' => $request->tracking_code,
            'submitted_ticket_no' =>
                session('submitted_ticket_no'),
            'activeEmployees' => Employee::where(
                'status',
                'Employed'
            )
                ->select('id', 'name', 'department')
                ->orderBy('name')
                ->get(),
            'itStaffStatuses' => $itStaffStatuses,
        ]);
    }

    public function employeeStore(Request $request)
    {
        $request->validate([
            'employee_name' => [
                'required',
                'string',
                Rule::exists('employees', 'name')
                    ->where('status', 'Employed'),
            ],
            'department' => 'required|string',
            'category' => 'required|string',
            'problem_description' => 'required|string',
        ]);

        $employee = Employee::where(
            'name',
            $request->employee_name
        )
            ->where(
                'status',
                'Employed'
            )
            ->firstOrFail();

        $employeeCategory = $request->category;
        $itCategory =
            $this->mapEmployeeCategoryToITCategory(
                $employeeCategory
            );

        $ticket = Ticket::create([
            'employee_name' => $request->employee_name,
            'department' => $employee->department,
            'employee_category' => $employeeCategory,
            'category' => $itCategory,
            'problem_description' =>
                $request->problem_description,
            'status' => 'Open',
            'date_opened' => now(),
            'created_by' => null,
        ]);

        $ticketNo = 'TCK-' .
            str_pad(
                $ticket->id,
                4,
                '0',
                STR_PAD_LEFT
            );

        $ticket->update([
            'ticket_no' => $ticketNo,
            'tracking_code' => $ticketNo,
        ]);

        return redirect()
            ->route('employee.tickets')
            ->with(
                'submitted_ticket_no',
                $ticketNo
            );
    }

    public function employeeEdit(
        Request $request,
        Ticket $ticket
    ) {
        abort_if($ticket->created_by !== null, 403);
        abort_if($ticket->status !== 'Open', 403);

        abort_if(
            $ticket->tracking_code !==
                $request->tracking_code &&
            $ticket->ticket_no !==
                $request->tracking_code,
            403
        );

        return Inertia::render(
            'EmployeeTickets/Edit',
            [
                'ticket' => $ticket,
                'tracking_code' =>
                    $request->tracking_code,
            ]
        );
    }

    public function employeeUpdate(
        Request $request,
        Ticket $ticket
    ) {
        abort_if($ticket->created_by !== null, 403);
        abort_if($ticket->status !== 'Open', 403);

        abort_if(
            $ticket->tracking_code !==
                $request->tracking_code &&
            $ticket->ticket_no !==
                $request->tracking_code,
            403
        );

        $request->validate([
            'employee_name' => [
                'required',
                'string',
                Rule::exists('employees', 'name')
                    ->where('status', 'Employed'),
            ],
            'department' => 'required|string',
            'category' => 'required|string',
            'problem_description' => 'required|string',
            'tracking_code' => 'required|string',
        ]);

        $employee = Employee::where(
            'name',
            $request->employee_name
        )
            ->where(
                'status',
                'Employed'
            )
            ->firstOrFail();

        $employeeCategory = $request->category;

        $itCategory =
            $this->mapEmployeeCategoryToITCategory(
                $employeeCategory
            );

        $originalDateOpened = Carbon::parse(
            $ticket->date_opened
        );

        $editedDateOpened = Carbon::create(
            $originalDateOpened->year,
            $originalDateOpened->month,
            $originalDateOpened->day,
            now()->hour,
            now()->minute,
            now()->second
        );

        $ticket->update([
            'employee_name' =>
                $request->employee_name,
            'department' =>
                $employee->department,
            'employee_category' =>
                $employeeCategory,
            'category' =>
                $itCategory,
            'problem_description' =>
                $request->problem_description,
            'date_opened' =>
                $editedDateOpened,
        ]);

        return redirect()
            ->route('employee.tickets');
    }

    public function employeeShow(Ticket $ticket)
    {
        return Inertia::render(
            'EmployeeTickets/Show',
            [
                'ticket' => $ticket->load(
                    'assignee'
                ),
            ]
        );
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

        $selectedDateOpened = Carbon::parse(
            $request->date_opened
        );

        $dateOpened = Carbon::create(
            $selectedDateOpened->year,
            $selectedDateOpened->month,
            $selectedDateOpened->day,
            now()->hour,
            now()->minute,
            now()->second
        );

        $ticket = Ticket::create([
            'employee_name' =>
                $request->employee_name,
            'department' =>
                $request->department,
            'category' =>
                $request->category,
            'employee_category' => null,
            'problem_description' =>
                $request->problem_description,
            'status' =>
                $request->status,
            'date_opened' =>
                $dateOpened,
            'resolved_at' => null,
            'created_by' =>
                Auth::id(),
        ]);

        $ticketNo = 'TCK-' .
            str_pad(
                $ticket->id,
                4,
                '0',
                STR_PAD_LEFT
            );

        $ticket->update([
            'ticket_no' => $ticketNo,
            'tracking_code' => $ticketNo,
        ]);

        return redirect()
            ->route('tickets.index')
            ->with(
                'success',
                'Ticket created successfully.'
            );
    }

    public function show(Ticket $ticket)
    {
        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket->load([
                'creator',
                'resolver',
                'assignee',
            ]),
        ]);
    }

    public function edit(Ticket $ticket)
    {
        return Inertia::render(
            'Tickets/Edit',
            [
                'ticket' => $ticket->load(
                    'assignee'
                ),
            ]
        );
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return redirect()
            ->back()
            ->with(
                'success',
                'Ticket deleted successfully.'
            );
    }

    public function update(
        Request $request,
        Ticket $ticket
    ) {
        $request->validate([
            'employee_name' => 'required|string',
            'department' => 'required|string',
            'category' => 'required|string',
            'problem_description' => 'required|string',
            'status' => 'required|string',
            'date_opened' => 'required|date',
            'problem_solution' => 'nullable|string',
            'progress_update' => 'nullable|string',
            'resolved_by' =>
                'nullable|exists:users,id',
            'resolved_at' => [
                Rule::requiredIf(
                    $request->status === 'Resolved'
                ),
                'nullable',
                'date',
            ],
        ]);

        $assignedTo =
            $ticket->assigned_to;

        if ($request->status === 'Open') {
            $assignedTo = null;
        }

        if (
            $request->status === 'Ongoing' &&
            !$assignedTo
        ) {
            $assignedTo = Auth::id();
        }

        $newSolution =
            $request->problem_solution;

        if ($newSolution) {
            $user = Auth::user()->name;

            $existing =
                $ticket->problem_solution
                    ? $ticket->problem_solution .
                        "\n\n"
                    : '';

            $formatted =
                "{$user}: {$newSolution}";

            $ticket->problem_solution =
                $existing . $formatted;
        }

        $newProgress =
            $request->progress_update;

        if ($newProgress) {
            $user = Auth::user()->name;

            $existing =
                $ticket->progress_update
                    ? $ticket->progress_update .
                        "\n\n"
                    : '';

            $formatted =
                "{$user}: {$newProgress}";

            $ticket->progress_update =
                $existing . $formatted;
        }

        $requestedDateOpened =
            Carbon::parse($request->date_opened);

        if ($ticket->date_opened) {
            $existingDateOpened =
                Carbon::parse($ticket->date_opened);

            $dateOpened = Carbon::create(
                $requestedDateOpened->year,
                $requestedDateOpened->month,
                $requestedDateOpened->day,
                $existingDateOpened->hour,
                $existingDateOpened->minute,
                $existingDateOpened->second
            );
        } else {
            $dateOpened = Carbon::create(
                $requestedDateOpened->year,
                $requestedDateOpened->month,
                $requestedDateOpened->day,
                now()->hour,
                now()->minute,
                now()->second
            );
        }

        $resolvedAt = null;

        if (
            $request->status === 'Resolved' &&
            $request->resolved_at
        ) {
            $requestedResolvedAt =
                Carbon::parse(
                    $request->resolved_at
                );

            if ($ticket->resolved_at) {
                $existingResolvedAt =
                    Carbon::parse(
                        $ticket->resolved_at
                    );

                $resolvedAt =
                    Carbon::create(
                        $requestedResolvedAt->year,
                        $requestedResolvedAt->month,
                        $requestedResolvedAt->day,
                        $existingResolvedAt->hour,
                        $existingResolvedAt->minute,
                        $existingResolvedAt->second
                    );
            } else {
                $currentResolvedTime = now();

                $resolvedAt =
                    Carbon::create(
                        $requestedResolvedAt->year,
                        $requestedResolvedAt->month,
                        $requestedResolvedAt->day,
                        $currentResolvedTime->hour,
                        $currentResolvedTime->minute,
                        $currentResolvedTime->second
                    );
            }
        }

        $ticket->update([
            'employee_name' =>
                $request->employee_name,
            'department' =>
                $request->department,
            'category' =>
                $request->category,
            'problem_description' =>
                $request->problem_description,
            'status' =>
                $request->status,
            'assigned_to' =>
                $assignedTo,
            'date_opened' =>
                $dateOpened,
            'problem_solution' =>
                $ticket->problem_solution,
            'progress_update' =>
                $ticket->progress_update,
            'resolved_by' =>
                $request->resolved_by,
            'resolved_at' =>
                $resolvedAt,
        ]);

        return redirect()
            ->route('tickets.index')
            ->with(
                'success',
                'Ticket updated successfully.'
            );
    }

    private function mapEmployeeCategoryToITCategory(
        $employeeCategory
    ) {
        return [
            'Hardware' => 'Hardware',
            'Software / Application' =>
                'System / Application',
            'Account / Login' =>
                'Accounts & Access',
            'File / Folder Access' =>
                'Files & Shared Folder',
            'Network / Internet' =>
                'Network & Internet',
            'CCTV / Security' =>
                'Security',
            'Others' =>
                'Others',
        ][$employeeCategory] ?? 'Others';
    }
}