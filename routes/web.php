<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TroubleReportController;
use App\Http\Controllers\TransferSlipController;
use App\Http\Controllers\CPTransferSlipController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| PUBLIC EMPLOYEE TICKETS
|--------------------------------------------------------------------------
*/
Route::get('/employee/tickets', [TicketController::class, 'employeeIndex'])
    ->name('employee.tickets');

Route::post('/employee/tickets', [TicketController::class, 'employeeStore'])
    ->name('employee.tickets.store');

Route::get('/employee/tickets/{ticket}', [TicketController::class, 'employeeShow'])
    ->name('employee.tickets.show');
Route::get('/employee/tickets/{ticket}/edit', [TicketController::class, 'employeeEdit'])
    ->name('employee.tickets.edit');

Route::put('/employee/tickets/{ticket}', [TicketController::class, 'employeeUpdate'])
    ->name('employee.tickets.update');

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth','role:superadmin,admin']) 
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Tickets
|--------------------------------------------------------------------------
*/

Route::middleware(['auth','role:superadmin,admin'])->group(function () {

    Route::get('/tickets', [TicketController::class, 'index'])
        ->name('tickets.index');

    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])
        ->name('tickets.show');

});

Route::middleware(['auth','role:superadmin'])->group(function () {

    Route::get('/tickets/latest/employee', [TicketController::class, 'latestEmployeeTicket'])
        ->name('tickets.latest.employee');

    Route::post('/tickets', [TicketController::class, 'store'])
        ->name('tickets.store');

    Route::post('/tickets/{id}/solution', [TicketController::class, 'addSolution']);

    Route::get('/tickets/create', [TicketController::class, 'create'])
        ->name('tickets.create');

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
Route::middleware(['auth','role:superadmin,admin'])->group(function () { 

    Route::get('/records/trouble-report', [TroubleReportController::class, 'index'])
        ->name('troublereport.index');

});

Route::middleware(['auth','role:superadmin'])->group(function () {

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
Route::middleware(['auth','role:superadmin,admin'])->group(function () { 

    Route::prefix('records/transfer-slip')->name('transferslip.')->group(function () {

        Route::get('/', [TransferSlipController::class, 'index'])
            ->name('index');

    });

});

/*
|--------------------------------------------------------------------------
| Cellphone Transfer Slip
|--------------------------------------------------------------------------
*/
Route::middleware(['auth','role:superadmin,admin'])->group(function () {

    Route::get('/records/cp-transfer-slip', [CPTransferSlipController::class, 'index'])
        ->name('cptransferslip.index');

});

Route::middleware(['auth','role:superadmin'])->group(function () {

    Route::post('/records/cp-transfer-slip', [CPTransferSlipController::class, 'store'])
        ->name('cptransferslip.store');

    Route::put('/records/cp-transfer-slip/{cptransferslip}', [CPTransferSlipController::class, 'update'])
        ->name('cptransferslip.update');

    Route::delete('/records/cp-transfer-slip/{cptransferslip}', [CPTransferSlipController::class, 'destroy'])
        ->name('cptransferslip.destroy');
    
    Route::get('/records/cp-transfer-slip/{cptransferslip}/download', [CPTransferSlipController::class, 'downloadWord'])
    ->name('cptransferslip.download');

});

Route::middleware(['auth','role:superadmin'])->group(function () {

    Route::prefix('records/transfer-slip')->name('transferslip.')->group(function () {

        Route::post('/', [TransferSlipController::class, 'store'])
            ->name('store');

        Route::put('/{transferslip}', [TransferSlipController::class, 'update'])
            ->name('update');

        Route::delete('/{transferslip}', [TransferSlipController::class, 'destroy'])
            ->name('destroy');

        Route::get(
            '/{transferslip}/download',
            [TransferSlipController::class, 'downloadWord']
        )->name('download');

    });

});

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/
Route::middleware(['auth','role:superadmin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

/*
|--------------------------------------------------------------------------
| Employees
|--------------------------------------------------------------------------
*/
Route::middleware(['auth','role:superadmin'])->group(function () {
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
});

/*
|--------------------------------------------------------------------------
| IT Tools
|--------------------------------------------------------------------------
*/
Route::get('/it-tools', function () {
    return Inertia::render('ITTools/Index');
    })->name('ittools.index');
});

require __DIR__.'/auth.php';