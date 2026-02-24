<?php

namespace App\Http\Controllers;

use App\Models\TransferSlip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/* ✅ INSERTED ONLY */
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\DB;

class TransferSlipController extends Controller
{
    public function index()
    {
        /* ✅ FIX ONLY: normalize wrong equipment values to "Desktop" */
        DB::table('transfer_slips')
            ->whereIn('equipment', [
                'Desktop-peripherals',
                'Desktop pheriperals',
                'Desktop-pheriperals',
                'Desktop peripheral',
            ])
            ->update(['equipment' => 'Desktop']);

        $records = TransferSlip::latest()
            ->leftJoin('users', 'transfer_slips.created_by', '=', 'users.id')
            ->select(
                'transfer_slips.*',
                'users.name as created_by_name'
            )
            ->get();

        return Inertia::render('TransferSlip/Index', [
            'records' => $records,
            'user' => Auth::user()->name,
        ]);
    }

    public function store(Request $request)
    {
        /* =====================================================
           ✅ FIX ONLY: USE AUTO-INCREMENT ID FOR TS NUMBER
           ===================================================== */

        $latestId = TransferSlip::max('id') ?? 0;
        $nextNumber = $latestId + 1;

        $transferSlipNo = 'TS-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        TransferSlip::create([
            'transfer_slip_no' => $transferSlipNo,
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

        return redirect()->back();
    }

    public function update(Request $request, TransferSlip $transferslip)
    {
        $transferslip->update($request->all());
        return redirect()->back();
    }

    public function destroy(TransferSlip $transferslip)
    {
        $transferslip->delete();
        return redirect()->back();
    }

    public function downloadWord(TransferSlip $transferslip)
    {
        $templatePath = resource_path('templates/Transfer Slip Sample.docx');
        $template = new TemplateProcessor($templatePath);

        $template->setValue('transfer_slip_no', $transferslip->transfer_slip_no);
        $template->setValue('to', $transferslip->to);
        $template->setValue('from', $transferslip->from);
        $template->setValue('date', $transferslip->date);
        $template->setValue('equipment', $transferslip->equipment);

        $qty         = preg_split("/\r\n|\n|\r/", $transferslip->quantity);
        $desc        = preg_split("/\r\n|\n|\r/", $transferslip->description ?? '');
        $origin      = preg_split("/\r\n|\n|\r/", $transferslip->origin ?? '');
        $destination = preg_split("/\r\n|\n|\r/", $transferslip->destination ?? '');
        $remarks     = preg_split("/\r\n|\n|\r/", $transferslip->remarks ?? '');

        $rowCount = max(
            count($qty),
            count($desc),
            count($origin),
            count($destination),
            count($remarks)
        );

        $template->cloneRow('qty', $rowCount);

        for ($i = 0; $i < $rowCount; $i++) {
            $template->setValue('qty#' . ($i + 1), trim($qty[$i] ?? ''));
            $template->setValue('desc#' . ($i + 1), trim($desc[$i] ?? ''));
            $template->setValue('origin#' . ($i + 1), trim($origin[$i] ?? ''));
            $template->setValue('destination#' . ($i + 1), trim($destination[$i] ?? ''));
            $template->setValue('remarks#' . ($i + 1), trim($remarks[$i] ?? ''));
        }

        $fileName = 'Transfer_Slip_' . $transferslip->transfer_slip_no . '.docx';

        return response()->streamDownload(function () use ($template) {
            $template->saveAs('php://output');
        }, $fileName);
    }
}