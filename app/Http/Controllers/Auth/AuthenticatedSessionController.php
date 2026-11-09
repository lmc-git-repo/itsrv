<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'name.required' => 'Username is required.',
            'password.required' => 'Password is required.',
        ]);

        $credentials = $request->only('name', 'password');

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'name' => 'Invalid username or password.',
            ]);
        }

        $request->session()->regenerate();

        $user = $request->user();

        if (
            $user &&
            $user->role === 'superadmin' &&
            in_array(strtolower($user->name), [
                'r.pasion',
                'j.tubaying',
                'l.larracas',
            ])
        ) {
            $user->update([
                'last_seen_at' => now(),
            ]);

            // Create only one shared Daily IT Checksheet ticket.
            // Reuse an existing Open or Ongoing ticket,
            // even when another IT personnel logs in.
            $today = Carbon::now('Asia/Manila');

            $dailyTrackingCode =
                'DAILY-IT-' . $today->format('Ymd');

            $dailyDescription =
                'Perform the Daily IT Checksheet and verify all required daily IT operational checks.';

            DB::transaction(function () use (
                $today,
                $dailyTrackingCode,
                $dailyDescription,
                $user
            ) {
                // Lock the same IT user record during ticket creation.
                // This prevents simultaneous IT logins from
                // creating separate Daily IT Checksheet tickets.
                DB::table('users')
                    ->whereIn('name', [
                        'r.pasion',
                        'j.tubaying',
                        'l.larracas',
                    ])
                    ->orderBy('id')
                    ->lockForUpdate()
                    ->first();

                $dailyTickets = function () use ($dailyDescription) {
                    return DB::table('tickets')
                        ->where('employee_name', 'IT Department')
                        ->where('department', 'IT')
                        ->where(function ($query) use ($dailyDescription) {
                            $query->where(
                                'problem_description',
                                $dailyDescription
                            )->orWhere(
                                'tracking_code',
                                'like',
                                'DAILY-IT-%'
                            );
                        });
                };

                // First, check for an unfinished checksheet
                // from today or any previous date.
                $existingTicket = $dailyTickets()
                    ->whereIn('status', [
                        'Open',
                        'Ongoing',
                    ])
                    ->orderBy('date_opened', 'desc')
                    ->orderBy('id', 'desc')
                    ->first();

                // If no unfinished ticket exists,
                // check whether today's ticket already exists,
                // including a Resolved ticket.
                if (!$existingTicket) {
                    $existingTicket = $dailyTickets()
                        ->whereDate(
                            'date_opened',
                            $today->toDateString()
                        )
                        ->orderBy('id', 'desc')
                        ->first();
                }

                if ($existingTicket) {
                    // Repair a missing ticket number without
                    // creating another ticket.
                    if (empty($existingTicket->ticket_no)) {
                        DB::table('tickets')
                            ->where('id', $existingTicket->id)
                            ->update([
                                'ticket_no' => 'TCK-' . str_pad(
                                    $existingTicket->id,
                                    4,
                                    '0',
                                    STR_PAD_LEFT
                                ),
                            ]);
                    }

                    return;
                }

                // Only create a ticket if no unfinished
                // checksheet exists and no ticket was
                // already created today.
                $ticketId = DB::table('tickets')
                    ->insertGetId([
                        'tracking_code' => $dailyTrackingCode,
                        'employee_name' => 'IT Department',
                        'department' => 'IT',
                        'category' => 'IT Operations & Maintenance',
                        'problem_description' => $dailyDescription,
                        'date_opened' => $today->toDateString(),
                        'status' => 'Open',
                        'created_by' => $user->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                DB::table('tickets')
                    ->where('id', $ticketId)
                    ->update([
                        'ticket_no' => 'TCK-' . str_pad(
                            $ticketId,
                            4,
                            '0',
                            STR_PAD_LEFT
                        ),
                    ]);
            });

            // A new token is generated only after successful IT login.
            // It allows one reminder per login, not per page refresh.
            $request->session()->put(
                'daily_it_login_token',
                (string) Str::uuid()
            );
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Return the shared unfinished Daily IT Checksheet
     * for the authenticated IT personnel's notification.
     */
    public function dailyChecksheetNotification(Request $request)
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

        $loginToken = $request->session()->get(
            'daily_it_login_token'
        );

        if (!$loginToken) {
            return response()->json([
                'ticket' => null,
                'login_token' => null,
            ]);
        }

        $dailyDescription =
            'Perform the Daily IT Checksheet and verify all required daily IT operational checks.';

        // Find the same shared unfinished ticket
        // regardless of which IT personnel created it.
        $ticket = DB::table('tickets')
            ->where('employee_name', 'IT Department')
            ->where('department', 'IT')
            ->where(function ($query) use ($dailyDescription) {
                $query->where(
                    'problem_description',
                    $dailyDescription
                )->orWhere(
                    'tracking_code',
                    'like',
                    'DAILY-IT-%'
                );
            })
            ->whereIn('status', [
                'Open',
                'Ongoing',
            ])
            ->orderBy('date_opened', 'desc')
            ->orderBy('id', 'desc')
            ->select(
                'id',
                'ticket_no',
                'employee_name',
                'department',
                'status'
            )
            ->first();

        return response()->json([
            'ticket' => $ticket,
            'login_token' => $loginToken,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (
            $user &&
            $user->role === 'superadmin' &&
            in_array(strtolower($user->name), [
                'r.pasion',
                'j.tubaying',
                'l.larracas',
            ])
        ) {
            $user->update([
                'last_seen_at' => null,
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}