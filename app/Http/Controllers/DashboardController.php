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
        $timezone = 'Asia/Manila';
        $now = Carbon::now($timezone);

        $period = in_array($request->query('period'), ['weekly', 'monthly', 'yearly'])
            ? $request->query('period')
            : 'yearly';

        $year = filter_var($request->query('year'), FILTER_VALIDATE_INT);
        $year = $year && $year >= 2000 && $year <= 2100
            ? $year
            : $now->year;

        $month = filter_var($request->query('month'), FILTER_VALIDATE_INT);
        $month = $month && $month >= 1 && $month <= 12
            ? $month
            : ($year === $now->year ? $now->month : 1);

        $selectedDate = $request->week_date
            ? Carbon::parse($request->week_date, $timezone)
            : $now->copy();

        if ($period === 'weekly') {
            $start = $selectedDate->copy()->startOfWeek(Carbon::MONDAY)->startOfDay();
            $end = $selectedDate->copy()->endOfWeek(Carbon::SUNDAY)->endOfDay();
        } elseif ($period === 'monthly') {
            $start = Carbon::create($year, $month, 1, 0, 0, 0, $timezone)->startOfMonth();
            $end = $start->copy()->endOfMonth();
        } else {
            $start = Carbon::create($year, 1, 1, 0, 0, 0, $timezone)->startOfYear();
            $end = $start->copy()->endOfYear();
        }

        $weekStart = $selectedDate->copy()->startOfWeek(Carbon::MONDAY)->startOfDay();
        $weekEnd = $selectedDate->copy()->endOfWeek(Carbon::SUNDAY)->endOfDay();

        $startDate = $start->toDateString();
        $endDate = $end->toDateString();

        // Ticket counts use the date the ticket was opened.
        $periodTickets = DB::table('tickets')
            ->whereBetween('date_opened', [$startDate, $endDate]);

        $totalTickets = (clone $periodTickets)->count();

        $totals = [
            'open' => (clone $periodTickets)->where('status', 'Open')->count(),
            'ongoing' => (clone $periodTickets)->where('status', 'Ongoing')->count(),
            'resolved' => (clone $periodTickets)->where('status', 'Resolved')->count(),
        ];

        $resolutionRate = $totalTickets > 0
            ? round(($totals['resolved'] / $totalTickets) * 100, 1)
            : 0;

        // Resolved ticket performance
        $resolvedInPeriod = DB::table('tickets')
            ->where('status', 'Resolved')
            ->whereNotNull('resolved_at')
            ->whereBetween('resolved_at', [
                $start->toDateTimeString(),
                $end->toDateTimeString(),
            ]);

        $resolutionRecords = (clone $resolvedInPeriod)
            ->select('date_opened', 'resolved_at')
            ->get();

        $resolutionDays = [];

        foreach ($resolutionRecords as $record) {
            if (!$record->date_opened || !$record->resolved_at) {
                continue;
            }

            $opened = Carbon::parse($record->date_opened, $timezone);
            $resolved = Carbon::parse($record->resolved_at, $timezone);

            if ($resolved->greaterThanOrEqualTo($opened)) {
                $resolutionDays[] = $opened->diffInSeconds($resolved) / 86400;
            }
        }

        $averageResolutionDays = count($resolutionDays) > 0
            ? round(array_sum($resolutionDays) / count($resolutionDays), 1)
            : null;

        // Category statistics
        $categoryStats = (clone $periodTickets)
            ->whereNotNull('category')
            ->where('category', '<>', '')
            ->select(
                'category as name',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($category) => [
                'name' => $category->name,
                'total' => (int) $category->total,
            ])
            ->toArray();

        // Ticket volume trend
        $trend = [];

        if ($period === 'yearly') {
            for ($i = 1; $i <= 12; $i++) {
                $monthStart = Carbon::create($year, $i, 1, 0, 0, 0, $timezone);
                $monthEnd = $monthStart->copy()->endOfMonth();

                $trend[] = [
                    'label' => $monthStart->format('M'),
                    'total' => DB::table('tickets')
                        ->whereBetween('date_opened', [
                            $monthStart->toDateString(),
                            $monthEnd->toDateString(),
                        ])
                        ->count(),
                ];
            }
        } else {
            $cursor = $start->copy();

            while ($cursor->lessThanOrEqualTo($end)) {
                $trend[] = [
                    'label' => $period === 'weekly'
                        ? $cursor->format('D')
                        : $cursor->format('j'),
                    'total' => DB::table('tickets')
                        ->whereDate('date_opened', $cursor->toDateString())
                        ->count(),
                ];

                $cursor->addDay();
            }
        }

        // Resolved tickets per IT personnel
        $personnelPerformance = (clone $resolvedInPeriod)
            ->join('users', 'tickets.resolved_by', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(tickets.id) as total')
            )
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($person) => [
                'id' => $person->id,
                'name' => $person->name,
                'total' => (int) $person->total,
            ])
            ->toArray();

        $tickets = (clone $periodTickets)
            ->select(
                'id',
                'ticket_no',
                'employee_name',
                'department',
                'category',
                'status',
                'date_opened',
                'problem_description'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($t) => (array) $t)
            ->toArray();

        // Weekly IT Tasks
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
                $query->whereBetween('tickets.date_opened', [
                    $weekStart->toDateString(),
                    $weekEnd->toDateString(),
                ])->orWhereBetween('tickets.resolved_at', [
                    $weekStart->toDateTimeString(),
                    $weekEnd->toDateTimeString(),
                ]);
            })
            ->orderBy('tickets.date_opened', 'desc')
            ->orderBy('tickets.id', 'desc')
            ->get()
            ->map(fn ($t) => (array) $t)
            ->toArray();

        return Inertia::render('Dashboard', [
            'totals' => $totals,
            'totalTickets' => $totalTickets,
            'resolutionRate' => $resolutionRate,
            'averageResolutionDays' => $averageResolutionDays,
            'categories' => $categoryStats,
            'personnelPerformance' => $personnelPerformance,
            'trend' => $trend,
            'period' => $period,
            'selectedYear' => $year,
            'selectedMonth' => $month,
            'periodLabel' => $start->format('M d, Y') . ' - ' . $end->format('M d, Y'),
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