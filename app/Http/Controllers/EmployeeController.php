<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('creator')->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('id', 'like', "%{$request->search}%")
                    ->orWhere('name', 'like', "%{$request->search}%")
                    ->orWhere('department', 'like', "%{$request->search}%")
                    ->orWhere('status', 'like', "%{$request->search}%");
            });
        }

        $employees = $query->paginate(10)->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'department' => 'required|string',
            'status' => 'required|string',
        ]);

        Employee::create([
            'name' => $request->name,
            'department' => $request->department,
            'status' => $request->status,
            'created_by' => Auth::id(),
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'name' => 'required|string',
            'department' => 'required|string',
            'status' => 'required|string',
        ]);

        $employee->update([
            'name' => $request->name,
            'department' => $request->department,
            'status' => $request->status,
        ]);

        return redirect()->back();
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->back();
    }
}