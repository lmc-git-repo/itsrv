<?php

namespace App\Http\Controllers;

use App\Models\TroubleReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Inertia\Inertia;
use Carbon\Carbon;

class TroubleReportController extends Controller
{
    /* =====================================================
       INDEX
    ===================================================== */
    public function index()
    {
        $reports = TroubleReport::latest()->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'tr_no' => $r->tr_no,
                'computer_no' => $r->computer_no,
                'work_group' => $r->work_group,
                'section' => $r->section,
                'username' => $r->username,
                'date_issued' => $r->date_issued,
                'computer_type' => $r->computer_type === 'OTHERS'
                    ? $r->computer_type_other
                    : $r->computer_type,
                'computer_type_other' => $r->computer_type_other,
                'problem_report' => $r->problem_report,
                'troubleshooting_report' => $r->troubleshooting_report,
                'final_recommendations' => $r->final_recommendations,
                'item' => $r->item,
                'quantity' => $r->quantity,
                'unit_price' => $r->unit_price,
                'total_amount' => $r->total_amount,
                'photograph' => $r->photograph ? Storage::url($r->photograph) : null,
                'remarks' => $r->remarks,
                'it_prepared_by' => $r->it_prepared_by,
                'it_checked_by' => $r->it_checked_by,
                'it_approved_by' => $r->it_approved_by,
                'user_reported_by' => $r->user_reported_by,
                'user_checked_by' => $r->user_checked_by,
                'user_approved_by' => $r->user_approved_by,
                'created_by' => optional($r->createdByUser)->name ?? '—',
            ];
        });

        return Inertia::render('TroubleReport/Index', [
            'reports' => $reports,
        ]);
    }

    /* =====================================================
       STORE
    ===================================================== */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'computer_no' => ['nullable', 'string', 'max:255'],
            'work_group' => ['nullable', 'string', 'max:255'],
            'section' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255'],
            'date_issued' => ['nullable', 'date'],
            'computer_type' => ['nullable', 'string', 'max:255'],
            'computer_type_other' => ['nullable', 'string', 'max:255'],
            'problem_report' => ['nullable', 'string'],
            'troubleshooting_report' => ['nullable', 'string'],
            'final_recommendations' => ['nullable', 'string'],
            'item' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer'],
            'unit_price' => ['nullable', 'numeric'],
            'total_amount' => ['nullable', 'numeric'],
            'remarks' => ['nullable', 'string'],
            'photograph' => ['nullable', 'image', 'max:5120'],
            'it_prepared_by' => ['nullable', 'string'],
            'it_checked_by' => ['nullable', 'string'],
            'it_approved_by' => ['nullable', 'string'],
            'user_reported_by' => ['nullable', 'string'],
            'user_checked_by' => ['nullable', 'string'],
            'user_approved_by' => ['nullable', 'string'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photograph')) {
            $photoPath = $request->file('photograph')->store('trouble_reports', 'public');
        }

        $totalAmount = null;
        if (!empty($validated['quantity']) && !empty($validated['unit_price'])) {
            $totalAmount = $validated['quantity'] * $validated['unit_price'];
        }

        $totalAmount = $validated['total_amount'] ?? $totalAmount;

        $report = TroubleReport::create([
        'tr_no' => 'TEMP',
        'computer_no' => $validated['computer_no'] ?? null,
        'work_group' => $validated['work_group'] ?? null,
        'section' => $validated['section'] ?? null,
        'username' => $validated['username'] ?? null,
        'date_issued' => $validated['date_issued'] ?? null,
        'computer_type' => $validated['computer_type'] ?? null,
        'computer_type_other' => $validated['computer_type_other'] ?? null,
        'problem_report' => $validated['problem_report'] ?? null,
        'troubleshooting_report' => $validated['troubleshooting_report'] ?? null,
        'final_recommendations' =>
            $validated['final_recommendations']
            ?? $validated['troubleshooting_report']
            ?? null,
        'item' => $validated['item'] ?? null,
        'quantity' => $validated['quantity'] ?? null,
        'unit_price' => $validated['unit_price'] ?? null,
        'total_amount' => $totalAmount,
        'photograph' => $photoPath,
        'remarks' => $validated['remarks'] ?? null,
        'it_prepared_by' => $validated['it_prepared_by'] ?? null,
        'it_checked_by' => $validated['it_checked_by'] ?? null,
        'it_approved_by' => $validated['it_approved_by'] ?? null,
        'user_reported_by' => $validated['user_reported_by'] ?? null,
        'user_checked_by' => $validated['user_checked_by'] ?? null,
        'user_approved_by' => $validated['user_approved_by'] ?? null,
        'created_by' => Auth::id(),
    ]);

    $report->update([
        'tr_no' => 'TR-' . str_pad($report->id, 4, '0', STR_PAD_LEFT),
    ]);

        return redirect()->route('troublereport.index')
            ->with('success', 'Trouble report created.');
    }

    /* =====================================================
       UPDATE
    ===================================================== */
    public function update(Request $request, TroubleReport $troublereport)
    {
        $validated = $request->validate([
            'computer_no' => ['nullable', 'string', 'max:255'],
            'work_group' => ['nullable', 'string', 'max:255'],
            'section' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255'],
            'date_issued' => ['nullable', 'date'],
            'computer_type' => ['nullable', 'string', 'max:255'],
            'computer_type_other' => ['nullable', 'string', 'max:255'],
            'problem_report' => ['nullable', 'string'],
            'troubleshooting_report' => ['nullable', 'string'],
            'final_recommendations' => ['nullable', 'string'],
            'item' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer'],
            'unit_price' => ['nullable', 'numeric'],
            'total_amount' => ['nullable', 'numeric'],
            'remarks' => ['nullable', 'string'],
            'photograph' => ['nullable', 'image', 'max:5120'],
            'remove_photograph' => ['nullable', 'boolean'],
            'it_prepared_by' => ['nullable', 'string'],
            'it_checked_by' => ['nullable', 'string'],
            'it_approved_by' => ['nullable', 'string'],
            'user_reported_by' => ['nullable', 'string'],
            'user_checked_by' => ['nullable', 'string'],
            'user_approved_by' => ['nullable', 'string'],
        ]);

        if ($request->boolean('remove_photograph') && $troublereport->photograph) {
            Storage::disk('public')->delete($troublereport->photograph);
            $troublereport->photograph = null;
        }

        if ($request->hasFile('photograph')) {
            if ($troublereport->photograph) {
                Storage::disk('public')->delete($troublereport->photograph);
            }
            $troublereport->photograph =
                $request->file('photograph')->store('trouble_reports', 'public');
        }

        $totalAmount = null;
        if (!empty($validated['quantity']) && !empty($validated['unit_price'])) {
            $totalAmount = $validated['quantity'] * $validated['unit_price'];
        }

        $troublereport->update([
            'computer_no' => $validated['computer_no'] ?? null,
            'work_group' => $validated['work_group'] ?? null,
            'section' => $validated['section'] ?? null,
            'username' => $validated['username'] ?? null,
            'date_issued' => $validated['date_issued'] ?? null,
            'computer_type' => $validated['computer_type'] ?? null,
            'computer_type_other' => $validated['computer_type_other'] ?? null,
            'problem_report' => $validated['problem_report'] ?? null,
            'troubleshooting_report' => $validated['troubleshooting_report'] ?? null,
            'final_recommendations' =>
                $validated['final_recommendations']
                ?? $validated['troubleshooting_report']
                ?? null,
            'item' => $validated['item'] ?? null,
            'quantity' => $validated['quantity'] ?? null,
            'unit_price' => $validated['unit_price'] ?? null,
            'total_amount' => $totalAmount,
            'remarks' => $validated['remarks'] ?? null,
            'it_prepared_by' => $validated['it_prepared_by'] ?? null,
            'it_checked_by' => $validated['it_checked_by'] ?? null,
            'it_approved_by' => $validated['it_approved_by'] ?? null,
            'user_reported_by' => $validated['user_reported_by'] ?? null,
            'user_checked_by' => $validated['user_checked_by'] ?? null,
            'user_approved_by' => $validated['user_approved_by'] ?? null,
        ]);

        return redirect()->back();
    }

    /* =====================================================
       DESTROY
    ===================================================== */
    public function destroy(TroubleReport $troublereport)
    {
        if ($troublereport->photograph) {
            Storage::disk('public')->delete($troublereport->photograph);
        }

        $troublereport->delete();
        return redirect()->back();
    }

    /* =====================================================
       EXCEL EXPORT
    ===================================================== */
    public function downloadExcel(TroubleReport $troublereport)
    {
        return $this->exportExcel($troublereport);
    }

    public function exportExcel(TroubleReport $troublereport)
    {
        $spreadsheet = IOFactory::load(
            storage_path('app/templates/Trouble Report Sample.xlsx')
        );

        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('D5', $troublereport->computer_no);
        $sheet->setCellValue('D6', $troublereport->work_group);
        $sheet->setCellValue('D7', $troublereport->username);
        $sheet->setCellValue('D8', $troublereport->section);

        $sheet->setCellValue(
            'L5',
            $troublereport->date_issued
                ? Carbon::parse($troublereport->date_issued)->format('m/d/Y')
                : ''
        );

        /* PHOTO */
        if (
            $troublereport->photograph &&
            file_exists(public_path('storage/' . $troublereport->photograph))
        ) {
            $drawing = new Drawing();
            $drawing->setName('Photograph');
            $drawing->setPath(public_path('storage/' . $troublereport->photograph));
            $drawing->setCoordinates('B28');
            $drawing->setHeight(260);
            $drawing->setWorksheet($sheet);
        }

        $ct  = $troublereport->computer_type;
        $cto = $troublereport->computer_type_other;
        
        foreach (['B53','D53','F53','I53','K53','M53'] as $cell) {
            $sheet->getStyle($cell)->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                ->setVertical(Alignment::VERTICAL_BOTTOM)
                ->setWrapText(true);
        }

        foreach (['B53','D53','F53','I53','K53','M53'] as $cell) {
            $rich = $sheet->getCell($cell)->getValue();
            if (is_string($rich) && str_contains($rich, "\n")) {
                [$name, $pos] = explode("\n", $rich, 2);
                $rt = new \PhpOffice\PhpSpreadsheet\RichText\RichText();
                $rt->createText($name . "\n");
                $rt->createTextRun($pos)->getFont()->setBold(true);
                $sheet->getCell($cell)->setValue($rt);
            }
        }

        /* ✅ UNDERLINE AFTER "OTHERS (SPECIFY)" — REAL FORM LINE */
        foreach (['C23','D23','E23','F23','G23','H23','I23','J23'] as $cell) {
            $sheet->getStyle($cell)->getBorders()->getBottom()
                ->setBorderStyle(Border::BORDER_THIN);
        }

        $sheet->setCellValue(
            'L7',
            ($ct === 'Laptop' ? '☑' : '☐') . ' LAPTOP   ' .
            ($ct === 'Desktop' ? '☑' : '☐') . ' DESKTOP   ' .
            ($ct === 'Server' ? '☑' : '☐') . ' SERVER'
        );

        $sheet->setCellValue(
            'L8',
            ($ct === 'OTHERS' ? '☑' : '☐') . ' OTHERS'
        );

        if ($ct === 'OTHERS') {
            $sheet->setCellValue('M8', $cto);
        }

        $sheet->setCellValue(
            'B23',
            ($ct === 'Monitor' ? '☑' : '☐') . ' MONITOR   ' .
            ($ct === 'Keyboard' ? '☑' : '☐') . ' KEY BOARD   ' .
            ($ct === 'Mouse' ? '☑' : '☐') . ' MOUSE   ' .
            ($ct === 'Hard Disk' ? '☑' : '☐') . ' HARD DISK   ' .
            ($ct === 'CPU' ? '☑' : '☐') . ' CPU   ' .
            ($ct === 'Power Supply' ? '☑' : '☐') . ' POWER SUPPLY   ' .
            ($ct === 'Memory Card' ? '☑' : '☐') . ' MEMORY CARD   ' .
            ($ct === 'LAN Card' ? '☑' : '☐') . ' LAN CARD   ' .
            ($ct === 'OTHERS' ? '☑' : '☐') . ' OTHERS (SPECIFY) ' .
            ($ct === 'OTHERS' ? $cto : '____________________')
        );

         $sheet->setCellValue(
            'M23',
            $ct === 'OTHERS' ? $cto : ''
        );

        $sheet->setCellValue('B11', $troublereport->problem_report);
        $sheet->setCellValue('I11', $troublereport->troubleshooting_report);
        $sheet->setCellValue('F21', $troublereport->final_recommendations);
        $sheet->setCellValue('I43', $troublereport->remarks);

        $sheet->setCellValue('B44', $troublereport->item);
        $sheet->setCellValue('D44', $troublereport->quantity);
        $sheet->setCellValue('E44', $troublereport->unit_price);
        $sheet->setCellValue('F44', $troublereport->total_amount);

        // IT SECTION
        $sheet->setCellValue('B53', $troublereport->it_prepared_by);
        $sheet->setCellValue('D53', $troublereport->it_checked_by);
        $sheet->setCellValue('F53', $troublereport->it_approved_by);

        // USER DEPARTMENT
        $sheet->setCellValue('I53', $troublereport->user_reported_by);
        $sheet->setCellValue('K53', $troublereport->user_checked_by);
        $sheet->setCellValue('M53', $troublereport->user_approved_by);

        /* FORCE CENTER ALIGNMENT FOR MERGED CELLS */
        foreach (['B53','D53','F53','I53','K53','M53'] as $cell) {
            $sheet->getStyle($cell)->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                ->setVertical(Alignment::VERTICAL_CENTER)
                ->setWrapText(true);
        }

        return response()->streamDownload(function () use ($spreadsheet) {
            if (ob_get_length()) {
                ob_end_clean();
            }

            IOFactory::createWriter($spreadsheet, 'Xlsx')->save('php://output');
        }, 'Trouble_Report_' . $troublereport->tr_no . '.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }
}