// TroubleReport/Show.jsx
import { useEffect } from "react"; // ✅ INSERTED ONLY

export default function ShowTroubleReport({ show, report, onClose }) {

    /* ✅ HOOK MUST RUN FIRST – ALWAYS */
    useEffect(() => {
        if (!show) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show, onClose]);

    /* ✅ EARLY RETURN MOVED HERE (FIX) */
    if (!show || !report) return null;

    const displayComputerType =
        report.computer_type === "OTHERS" && report.computer_type_other
            ? `OTHERS - ${report.computer_type_other}`
            : report.computer_type;

    /* ✅ safe date display */
    const displayDateIssued = report.date_issued
        ? String(report.date_issued).slice(0, 10)
        : "—";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* MODAL */}
            <div
                className="
                    relative bg-white rounded-xl w-full max-w-xl p-6
                    z-10 text-gray-800
                    max-h-[90vh] overflow-y-auto
                "
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
                    Trouble Report Details
                </h2>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
                    <div><strong>TR No:</strong> {report.tr_no}</div>
                    <div><strong>Computer No:</strong> {report.computer_no}</div>
                    <div><strong>WorkGroup/Section:</strong> {report.work_group}</div>
                    <div><strong>Username:</strong> {report.username}</div>

                    <div><strong>Date Issued:</strong> {displayDateIssued}</div>

                    <div><strong>Computer Type:</strong> {displayComputerType}</div>
                    <div><strong>Created By:</strong> {report.created_by}</div>

                    <div className="col-span-2 mt-2">
                        <strong>Problem Report:</strong>
                        <p className="mt-1 leading-snug">
                            {report.problem_report || "—"}
                        </p>
                    </div>

                    <div className="col-span-2 mt-2">
                        <strong>TroubleShooting Report:</strong>
                        <p className="mt-1 leading-snug">
                            {report.troubleshooting_report || "—"}
                        </p>
                    </div>

                    <div className="col-span-2 mt-2">
                        <strong>Final Recommendations/Remarks:</strong>
                        <p className="mt-1 leading-snug">
                            {report.final_recommendations ||
                                report.troubleshooting_report ||
                                "—"}
                        </p>
                    </div>

                    <div className="col-span-2 mt-2">
                        <strong>Estimate Cost Info:</strong>
                        <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1">
                            <div><strong>Item:</strong> {report.item || "—"}</div>
                            <div><strong>Quantity:</strong> {report.quantity ?? "—"}</div>
                            <div><strong>Unit Price:</strong> {report.unit_price ?? "—"}</div>
                            <div><strong>Total Amount:</strong> {report.total_amount ?? "—"}</div>
                        </div>
                    </div>

                    <div className="col-span-2 mt-2">
                        <strong>Remarks:</strong>
                        <p className="mt-1 leading-snug">
                            {report.remarks || "—"}
                        </p>
                    </div>

                    <div className="col-span-2 mt-4">
                        <h3 className="font-bold">IT SECTION</h3>
                        <p><strong>Prepared By:</strong><br />{report.it_prepared_by || "—"}</p>
                        <p><strong>Checked By:</strong><br />{report.it_checked_by || "—"}</p>
                        <p><strong>Approved By:</strong><br />{report.it_approved_by || "—"}</p>
                    </div>

                    <div className="col-span-2 mt-4">
                        <h3 className="font-bold">USER DEPARTMENT</h3>
                        <p><strong>Reported By:</strong><br />{report.user_reported_by || "—"}</p>
                        <p><strong>Checked By:</strong><br />{report.user_checked_by || "—"}</p>
                        <p><strong>Approved By:</strong><br />{report.user_approved_by || "—"}</p>
                    </div>

                    <div className="col-span-2 mt-3">
                        <strong>Photograph:</strong>

                        {report.photograph ? (
                            <img
                                src={report.photograph}
                                alt="Trouble Report Photograph"
                                className="mt-2 max-h-64 rounded border border-gray-300 object-contain"
                            />
                        ) : (
                            <p className="mt-1 italic text-gray-500">
                                No photograph attached
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}