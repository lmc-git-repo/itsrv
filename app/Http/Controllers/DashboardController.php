<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $selectedDate = $request->week_date
            ? Carbon::parse($request->week_date, 'Asia/Manila')
            : Carbon::now('Asia/Manila');

        $weekStart = $selectedDate->copy()->startOfWeek(Carbon::MONDAY)->startOfDay();
        $weekEnd = $selectedDate->copy()->endOfWeek(Carbon::SUNDAY)->endOfDay();

        //STATUS
        $totals = [
            'open'     => DB::table('tickets')->where('status', 'Open')->count() ?? 0,
            'ongoing'  => DB::table('tickets')->where('status', 'Ongoing')->count() ?? 0,
            'resolved' => DB::table('tickets')->where('status', 'Resolved')->count() ?? 0,
        ];

        //CATEGORY LIST
        $categories = [
            'Application & System Support',
            'Hardware Support & Device Setup',
            'Account & Access Management',
            'File, Data & Document Management',
            'Network & Connectivity Support',
            'IT Operations & Maintenance',
            'Asset & Equipment Handling',
            'Security & Permissions',
        ];

        //TOTAL COUNT PER CATEGORY
        $categoryStats = [];

        foreach ($categories as $cat) {
            $categoryStats[] = [
                'name' => $cat,
                'total' => DB::table('tickets')
                    ->where('category', $cat)
                    ->count() ?? 0,
            ];
        }

        $tickets = DB::table('tickets')
            ->select(
                'id',
                'employee_name',
                'department',
                'category',
                'status',
                'problem_description'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($t) => (array) $t)
            ->toArray();

        $weeklyTasks = DB::table('tickets')
            ->leftJoin('users as resolvers', 'tickets.resolved_by', '=', 'resolvers.id')
            ->select(
                'tickets.id',
                'tickets.ticket_no',
                'tickets.employee_name',
                'tickets.department',
                'tickets.category',
                'tickets.status',
                'tickets.problem_description',
                'tickets.date_opened',
                'tickets.resolved_at',
                'resolvers.name as resolved_by_name',
                'tickets.created_at',
                'tickets.updated_at'
            )
            ->where(function ($query) use ($weekStart, $weekEnd) {
                $query->whereBetween('tickets.date_opened', [$weekStart->toDateString(), $weekEnd->toDateString()])
                    ->orWhereBetween('tickets.resolved_at', [$weekStart, $weekEnd]);
            })
            ->orderBy('tickets.date_opened', 'desc')
            ->get()
            ->map(fn ($t) => (array) $t)
            ->toArray();

        return Inertia::render('Dashboard', [
            'totals' => $totals,
            'categories' => $categoryStats,
            'tickets' => $tickets,
            'weeklyTasks' => $weeklyTasks,
            'weeklyRange' => [
                'start' => $weekStart->format('M d, Y'),
                'end' => $weekEnd->format('M d, Y'),
                'selectedDate' => $selectedDate->format('Y-m-d'),
            ],
        ]);
    }
}