// TroubleReport/Edit.jsx
import { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";

export default function EditTroubleReport({ show, report, onClose }) {
    const workGroups = [
        "Accounting", "Admin", "Assembly", "CMM", "COOP", "Deburring",
        "Die Casting", "Die Casting Engineering", "Die Mold", "Facilities",
        "Finance", "GA", "Guard House", "HR", "IMS", "IT",
        "Learning and Development", "Machine Engineering", "Machining", "MRO",
        "New Project", "PPC", "Purchasing", "Quality Control", "Safety", "Sales",
    ];

    const sections = [
        "Acctg", "Admin", "Assy", "CMM", "COOP", "DB", "DC", "DCE", "DM", "FAC",
        "FIN", "GA", "GH", "HR", "IMS", "IT", "LND", "MCE", "MAC", "MRO", "NP",
        "PPC", "PUR", "QC", "Safety", "Sales",
    ];

    /* ✅ INSERTED ONLY: computer type dropdown options */
    const computerTypes = [
        "Laptop",
        "Desktop",
        "Server",
        "Monitor",
        "Keyboard",
        "Mouse",
        "Hard Disk",
        "CPU",
        "Power Supply",
        "Memory Card",
        "LAN Card",
        "OTHERS",
    ];

    const photoInputRef = useRef(null);

    /* ✅ INSERTED: store original snapshot */
    const originalDataRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        computer_no: "",
        work_group: "",
        section: "",
        username: "",
        date_issued: "",
        computer_type: "",
        computer_type_other: "",
        problem_report: "",
        troubleshooting_report: "",
        final_recommendations: "",
        item: "",
        quantity: "",
        unit_price: "",
        total_amount: "",
        photograph: null,
        remarks: "",
        remove_photograph: false,
        existing_photograph: null,
        it_prepared_by: "",
        it_checked_by: "",
        it_approved_by: "",
        user_reported_by: "",
        user_checked_by: "",
        user_approved_by: "",

    });

    /* ✅ INSERTED ONLY: computed total amount */
    const computedTotal = (() => {
        const qty = Number(data.quantity);
        const price = Number(data.unit_price);
        if (!Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price <= 0) return "";
        const total = qty * price;
        return Number.isFinite(total) ? total.toFixed(2) : "";
    })();

    useEffect(() => {
        if (!report) return;

        const initialData = {
            computer_no: report.computer_no || "",
            work_group: report.work_group || "",
            section: report.section || "",
            username: report.username || "",
            date_issued: report.date_issued || "",
            computer_type: report.computer_type || "",
            computer_type_other: report.computer_type_other || "",
            problem_report: report.problem_report || "",
            troubleshooting_report: report.troubleshooting_report || "",
            final_recommendations:
                report.final_recommendations ||
                report.troubleshooting_report ||
                "",
            item: report.item || "",
            quantity: report.quantity ?? "",
            unit_price: report.unit_price ?? "",
            total_amount: report.total_amount ?? "",
            remarks: report.remarks || "",
            existing_photograph: report.photograph || null,
                        it_prepared_by: report.it_prepared_by || "",
            it_checked_by: report.it_checked_by || "",
            it_approved_by: report.it_approved_by || "",
            user_reported_by: report.user_reported_by || "",
            user_checked_by: report.user_checked_by || "",
            user_approved_by: report.user_approved_by || "",
        };

        setData({
            ...initialData,
            photograph: null,
            remove_photograph: false,
        });

        /* ✅ INSERTED: save original snapshot */
        originalDataRef.current = initialData;

        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    }, [report]);

    /* ✅ INSERTED: detect changes */
    const hasChanges = (() => {
        if (!originalDataRef.current) return false;

        const original = originalDataRef.current;

        return (
            data.computer_no !== original.computer_no ||
            data.work_group !== original.work_group ||
            data.section !== original.section ||
            data.username !== original.username ||
            data.date_issued !== original.date_issued ||
            data.computer_type !== original.computer_type ||
            data.computer_type_other !== original.computer_type_other ||
            data.problem_report !== original.problem_report ||
            data.troubleshooting_report !== original.troubleshooting_report ||
            data.final_recommendations !== original.final_recommendations ||
            data.item !== original.item ||
            String(data.quantity) !== String(original.quantity) ||
            String(data.unit_price) !== String(original.unit_price) ||
            String(computedTotal) !== String(original.total_amount) ||
            data.remarks !== original.remarks ||
            data.photograph !== null ||
            data.remove_photograph === true ||
            data.it_prepared_by !== original.it_prepared_by ||
            data.it_checked_by !== original.it_checked_by ||
            data.it_approved_by !== original.it_approved_by ||
            data.user_reported_by !== original.user_reported_by ||
            data.user_checked_by !== original.user_checked_by ||
            data.user_approved_by !== original.user_approved_by
        );
    })();

    const submit = () => {
        if (!report || !hasChanges) return;

        /* ✅ FIXED: route param object */
        post(route("troublereport.update", { troublereport: report.id }), {
            forceFormData: true,
            preserveScroll: true,
            data: {
                ...data,
                total_amount: computedTotal,
                _method: "put",
            },
            onSuccess: () => {
                reset();
                if (photoInputRef.current) photoInputRef.current.value = "";
                onClose();
            },
        });
    };

    const handleRemoveImage = () => {
        setData("photograph", null);
        setData("remove_photograph", true);
        setData("existing_photograph", null);

        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    };

    if (!show || !report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="relative bg-[#f5f7fb] rounded-xl w-full max-w-lg z-10 flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-center py-4 text-[#101E33]">
                    EDIT TROUBLE REPORT RECORD
                </h2>

                <div className="overflow-y-auto px-6 pb-6 space-y-4 text-[15px] text-[#101E33]">
                    <div>
                        <label className="font-semibold">Computer No.</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={data.computer_no}
                            onChange={(e) => setData("computer_no", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Work Group</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={data.work_group}
                            onChange={(e) => setData("work_group", e.target.value)}
                        >
                            <option value="">Select Work Group</option>
                            {workGroups.map((wg) => (
                                <option key={wg} value={wg}>
                                    {wg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold">Section</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={data.section}
                            onChange={(e) => setData("section", e.target.value)}
                        >
                            <option value="">Select Section</option>
                            {sections.map((sec) => (
                                <option key={sec} value={sec}>
                                    {sec}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold">Username</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={data.username}
                            onChange={(e) => setData("username", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Date Issued</label>
                        <input
                            type="date"
                            className="w-full rounded border px-3 py-2"
                            value={data.date_issued}
                            onChange={(e) => setData("date_issued", e.target.value)}
                        />
                    </div>

                    {/* ✅ UPDATED: Computer Type dropdown + Others input */}
                    <div>
                        <label className="font-semibold">Computer Type</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={data.computer_type}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData("computer_type", val);
                                if (val !== "OTHERS") setData("computer_type_other", "");
                            }}
                        >
                            <option value="">Select Computer Type</option>
                            {computerTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>

                        {data.computer_type === "OTHERS" && (
                            <input
                                className="mt-2 w-full rounded border px-3 py-2"
                                placeholder="Specify Others"
                                value={data.computer_type_other}
                                onChange={(e) => setData("computer_type_other", e.target.value)}
                            />
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Problem Report</label>
                        <textarea
                            rows="3"
                            className="w-full rounded border px-3 py-2"
                            value={data.problem_report}
                            onChange={(e) => setData("problem_report", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Trouble Shooting Report</label>
                        <textarea
                            rows="3"
                            className="w-full rounded border px-3 py-2"
                            value={data.troubleshooting_report}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData("troubleshooting_report", val);
                                /* ✅ INSERTED ONLY: mirror to Final Recommendations/Remarks */
                                setData("final_recommendations", val);
                            }}
                        />
                    </div>

                    {/* ✅ INSERTED: Estimate Cost Info */}
                    <div className="pt-2">
                        <h3 className="font-bold text-[#101E33]">Estimate Cost Info</h3>

                        <div className="mt-2">
                            <label className="font-semibold">Item</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={data.item}
                                onChange={(e) => setData("item", e.target.value)}
                            />
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold">Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="w-full rounded border px-3 py-2"
                                    value={data.quantity}
                                    onChange={(e) => setData("quantity", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Unit Price</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded border px-3 py-2"
                                    value={data.unit_price}
                                    onChange={(e) => setData("unit_price", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="font-semibold">Total Amount</label>
                            <input
                                readOnly
                                className="w-full rounded border px-3 py-2 bg-gray-100"
                                value={computedTotal}
                                onChange={() => {}}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold">Photograph</label>

                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="w-full rounded border px-3 py-2 bg-white"
                            onChange={(e) => {
                                setData("photograph", e.target.files[0]);
                                setData("remove_photograph", false);
                            }}
                        />

                        {(data.photograph || data.existing_photograph) && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="mt-2 text-sm text-red-600 hover:underline"
                            >
                                Remove selected image
                            </button>
                        )}

                        {data.existing_photograph && (
                            <div className="mt-3 flex justify-center">
                                <img
                                    src={data.existing_photograph}
                                    className="max-h-48 w-auto rounded border object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Trouble Remarks</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={data.remarks}
                            onChange={(e) => setData("remarks", e.target.value)}
                        />
                    </div>

                    {/* SIGNATORIES */}
                    <h3 className="font-bold mt-4">IT SECTION</h3>

                    <textarea
                        className="w-full rounded border px-3 py-2"
                        placeholder={"Prepared By\nPosition"}
                        value={data.it_prepared_by}
                        onChange={(e) => setData("it_prepared_by", e.target.value)}
                    />

                    <textarea
                        className="w-full rounded border px-3 py-2"
                        placeholder={"Checked By\nPosition"}
                        value={data.it_checked_by}
                        onChange={(e) => setData("it_checked_by", e.target.value)}
                    />

                    <textarea
                        className="w-full rounded border px-3 py-2"
                        placeholder={"Approved By\nPosition"}
                        value={data.it_approved_by}
                        onChange={(e) => setData("it_approved_by", e.target.value)}
                    />

                    <h3 className="font-bold mt-4">USER DEPARTMENT</h3>

                    <textarea
                        className="w-full rounded border px-3 py-2"
                        placeholder={"Reported By\nPosition"}
                        value={data.user_reported_by}
                        onChange={(e) => setData("user_reported_by", e.target.value)}
                    />

                    <textarea
                        className="w-full rounded border px-3 py-2"
                        placeholder={"Checked By\nPosition"}
                        value={data.user_checked_by}
                        onChange={(e) => setData("user_checked_by", e.target.value)}
                    />

                    <textarea
                        className="w-full rounded border px-3 py-2"
                        placeholder={"Approved By\nPosition"}
                        value={data.user_approved_by}
                        onChange={(e) => setData("user_approved_by", e.target.value)}
                    />

                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={onClose}
                            type="button"
                            className="px-6 py-2 rounded bg-gray-500 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={submit}
                            disabled={!hasChanges || processing}
                            className={`px-6 py-2 rounded font-semibold text-white ${
                                !hasChanges || processing
                                    ? "bg-green-300 cursor-not-allowed"
                                    : "bg-green-500"
                            }`}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}