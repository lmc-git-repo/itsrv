<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Route;
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
        }

        return redirect()->intended(route('dashboard'));
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