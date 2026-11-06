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

            // Create one shared Daily IT Checksheet ticket
            // only when an authorized IT personnel logs in.
            $today = Carbon::now('Asia/Manila');

            $dailyTrackingCode = 'DAILY-IT-' . $today->format('Ymd');

            DB::transaction(function () use ($today, $dailyTrackingCode, $user) {
                // tracking_code is unique in the existing tickets table.
                // This prevents duplicate daily tickets from simultaneous logins.
                $inserted = DB::table('tickets')->insertOrIgnore([
                    'tracking_code' => $dailyTrackingCode,
                    'employee_name' => 'IT Department',
                    'department' => 'IT',
                    'category' => 'IT Operations & Maintenance',
                    'problem_description' => 'Perform the Daily IT Checksheet and verify all required daily IT operational checks.',
                    'date_opened' => $today->toDateString(),
                    'status' => 'Open',
                    'created_by' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                if ($inserted === 1) {
                    $dailyTicket = DB::table('tickets')
                        ->where('tracking_code', $dailyTrackingCode)
                        ->first();

                    if ($dailyTicket) {
                        DB::table('tickets')
                            ->where('id', $dailyTicket->id)
                            ->update([
                                'ticket_no' => 'TCK-' . str_pad(
                                    $dailyTicket->id,
                                    4,
                                    '0',
                                    STR_PAD_LEFT
                                ),
                            ]);
                    }
                }
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
     * Return today's shared Daily IT Checksheet ticket
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

        $today = Carbon::now('Asia/Manila');

        $dailyTrackingCode =
            'DAILY-IT-' . $today->format('Ymd');

        $ticket = DB::table('tickets')
            ->where('tracking_code', $dailyTrackingCode)
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