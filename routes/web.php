<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TroubleReportController;
use App\Http\Controllers\TransferSlipController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Tickets
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    Route::get('/tickets', [TicketController::class, 'index'])
        ->name('tickets.index');

    Route::post('/tickets', [TicketController::class, 'store'])
        ->name('tickets.store');

    Route::get('/tickets/create', [TicketController::class, 'create'])
        ->name('tickets.create');

    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])
        ->name('tickets.show');

    Route::get('/tickets/{ticket}/edit', [TicketController::class, 'edit'])
        ->name('tickets.edit');
    
    Route::put('/tickets/{ticket}', [TicketController::class, 'update'])
        ->name('tickets.update');
    
    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy'])
        ->name('tickets.destroy');
});

/*
|--------------------------------------------------------------------------
| Trouble Report
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/records/trouble-report', [TroubleReportController::class, 'index'])
        ->name('troublereport.index');

    Route::post('/records/trouble-report', [TroubleReportController::class, 'store'])
        ->name('troublereport.store');

    Route::put('/records/trouble-report/{troublereport}', [TroubleReportController::class, 'update'])
        ->name('troublereport.update');

    Route::post('/records/trouble-report/{troublereport}', [TroubleReportController::class, 'update']);

    Route::delete('/records/trouble-report/{troublereport}', [TroubleReportController::class, 'destroy'])
        ->name('troublereport.destroy');

    Route::get(
        '/records/trouble-report/{troublereport}/download',
        [TroubleReportController::class, 'downloadExcel']
    )->name('troublereport.download');
});

/*
|--------------------------------------------------------------------------
| Transfer Slip
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::prefix('records/transfer-slip')->name('transferslip.')->group(function () {
        Route::get('/', [TransferSlipController::class, 'index'])->name('index');
        Route::post('/', [TransferSlipController::class, 'store'])->name('store');
        Route::put('/{transferslip}', [TransferSlipController::class, 'update'])->name('update');
        Route::delete('/{transferslip}', [TransferSlipController::class, 'destroy'])->name('destroy');

        Route::get(
            '/{transferslip}/download',
            [TransferSlipController::class, 'downloadWord']
        )->name('download');
    });
});

/*
|--------------------------------------------------------------------------
| USERS (✅ INSERTED ONLY)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/auth.php';