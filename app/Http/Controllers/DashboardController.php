<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // ✅ STATUS TOTALS (UNCHANGED)
        $totals = [
            'open'     => DB::table('tickets')->where('status', 'Open')->count() ?? 0,
            'ongoing'  => DB::table('tickets')->where('status', 'Ongoing')->count() ?? 0,
            'resolved' => DB::table('tickets')->where('status', 'Resolved')->count() ?? 0,
        ];

        // ✅ CATEGORY LIST (UNCHANGED)
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

        // ✅ TOTAL COUNT PER CATEGORY (UNCHANGED)
        $categoryStats = [];

        foreach ($categories as $cat) {
            $categoryStats[] = [
                'name' => $cat,
                'total' => DB::table('tickets')
                    ->where('category', $cat)
                    ->count() ?? 0,
            ];
        }

        // ✅ FIX: FORCE PLAIN ARRAY FOR REACT FILTERING
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

        return Inertia::render('Dashboard', [
            'totals' => $totals,
            'categories' => $categoryStats,
            'tickets' => $tickets, // ✅ NOW FILTERS CORRECTLY
        ]);
    }
}