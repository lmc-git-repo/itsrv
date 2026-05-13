<?php

namespace App\Http\Controllers;

use App\Models\CPTransferSlip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpWord\TemplateProcessor;

class CPTransferSlipController extends Controller
{
    public function index()
    {
        return Inertia::render('CPTransferSlip/Index', [
            'records' => CPTransferSlip::with('creator')
                ->latest()
                ->paginate(10)
                ->through(fn ($record) => [
                    'id' => $record->id,
                    'cp_transfer_slip_no' => $record->cp_transfer_slip_no,
                    'to' => $record->to,
                    'from' => $record->from,
                    'date' => optional($record->date)->format('Y-m-d'),
                    'equipment' => $record->equipment,
                    'quantity' => $record->quantity,
                    'description' => $record->description,
                    'origin' => $record->origin,
                    'destination' => $record->destination,
                    'remarks' => $record->remarks,
                    'items' => $record->items,
                    'created_by' => $record->created_by,
                    'created_by_name' => $record->creator?->name,
                    'creator' => $record->creator,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'to' => 'required|string|max:255',
            'from' => 'required|string|max:255',
            'date' => 'required|date',
            'equipment' => 'required|string|max:255',
            'quantity' => 'nullable|string',
            'description' => 'nullable|string',
            'origin' => 'nullable|string',
            'destination' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $cpTransferSlip = CPTransferSlip::create([
            'to' => $request->to,
            'from' => $request->from,
            'date' => $request->date,
            'equipment' => $request->equipment,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'origin' => $request->origin,
            'destination' => $request->destination,
            'remarks' => $request->remarks,
            'created_by' => Auth::id(),
        ]);

        $cpTransferSlip->update([
            'cp_transfer_slip_no' => 'CPTS-' . str_pad($cpTransferSlip->id, 4, '0', STR_PAD_LEFT),
        ]);

        return redirect()->route('cptransferslip.index')
            ->with('success', 'Cellphone transfer slip created successfully.');
    }

    public function update(Request $request, CPTransferSlip $cptransferslip)
    {
        $request->validate([
            'to' => 'required|string|max:255',
            'from' => 'required|string|max:255',
            'date' => 'required|date',
            'equipment' => 'required|string|max:255',
            'quantity' => 'nullable|string',
            'description' => 'nullable|string',
            'origin' => 'nullable|string',
            'destination' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $cptransferslip->update([
            'to' => $request->to,
            'from' => $request->from,
            'date' => $request->date,
            'equipment' => $request->equipment,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'origin' => $request->origin,
            'destination' => $request->destination,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('cptransferslip.index')
            ->with('success', 'Cellphone transfer slip updated successfully.');
    }

    public function destroy(CPTransferSlip $cptransferslip)
    {
        $cptransferslip->delete();

        return redirect()->route('cptransferslip.index')->with('success', 'Cellphone transfer slip deleted successfully.');
    }

    public function downloadWord(CPTransferSlip $cptransferslip)
    {
        $templatePath = resource_path('templates/Company Mobile Phone Transfer Slip.docx');

        if (!file_exists($templatePath)) {
            abort(404, 'Template file not found: ' . $templatePath);
        }

        $templateProcessor = new TemplateProcessor($templatePath);

        $templateProcessor->setValue('to', $cptransferslip->to ?? '');
        $templateProcessor->setValue('from', $cptransferslip->from ?? '');
        $templateProcessor->setValue('date', optional($cptransferslip->date)->format('m/d/y') ?? '');
        $templateProcessor->setValue('equipment', $cptransferslip->equipment ?? '');

        $templateProcessor->setValue('qty', $cptransferslip->quantity ?? '');
        $templateProcessor->setValue('description', $cptransferslip->description ?? '');
        $templateProcessor->setValue('origin', $cptransferslip->origin ?? '');
        $templateProcessor->setValue('destination', $cptransferslip->destination ?? '');
        $templateProcessor->setValue('remarks', $cptransferslip->remarks ?? '');

        $tempFolder = storage_path('app/temp');

        if (!file_exists($tempFolder)) {
            mkdir($tempFolder, 0755, true);
        }

        $fileName = ($cptransferslip->cp_transfer_slip_no ?? 'CP-Transfer-Slip') . '.docx';
        $tempPath = $tempFolder . '/' . $fileName;

        $templateProcessor->saveAs($tempPath);

        return response()->download($tempPath)->deleteFileAfterSend(true);
    }
}