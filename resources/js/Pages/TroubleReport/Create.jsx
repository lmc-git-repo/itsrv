import { useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function CreateTroubleReport({ show, onClose }) {
    const workGroups = [
        "Accounting","Admin","Assembly","CMM","COOP","Deburring","Die Casting",
        "Die Casting Engineering","Die Mold","Facilities","Finance","GA",
        "Guard House","HR","IMS","IT","Learning and Development",
        "Machine Engineering","Machining","MRO","New Project","PPC",
        "Purchasing","Quality Control","Safety","Sales",
    ];

    const sections = [
        "Acctg","Admin","Assy","CMM","COOP","DB","DC","DCE","DM","FAC","FIN",
        "GA","GH","HR","IMS","IT","LND","MCE","MAC","MRO","NP","PPC","PUR",
        "QC","Safety","Sales",
    ];

    const computerTypes = [
        "Laptop","Desktop","Server","Monitor","Keyboard","Mouse",
        "Hard Disk","CPU","Power Supply","Memory Card","LAN Card","OTHERS",
    ];

    const photoInputRef = useRef(null);

    const { data, setData, post, reset, processing } = useForm({
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
        it_prepared_by: "",
        it_checked_by: "",
        it_approved_by: "",
        user_reported_by: "",
        user_checked_by: "",
        user_approved_by: "",
    });

    const computedTotal = (() => {
        const qty = Number(data.quantity);
        const price = Number(data.unit_price);
        if (!Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price <= 0) return "";
        return (qty * price).toFixed(2);
    })();

    const isValid =
        data.computer_no.trim() &&
        data.work_group &&
        data.section &&
        data.username.trim() &&
        data.date_issued &&
        data.computer_type &&
        (data.computer_type !== "OTHERS" || data.computer_type_other.trim()) &&
        data.problem_report.trim() &&
        data.troubleshooting_report.trim() &&
        data.photograph &&
        data.remarks.trim() &&
        data.item.trim() &&
        String(data.quantity).trim() &&
        String(data.unit_price).trim() &&
        computedTotal &&
        data.it_prepared_by.trim() &&
        data.it_checked_by.trim() &&
        data.it_approved_by.trim() &&
        data.user_reported_by.trim() &&
        data.user_approved_by.trim();

    const submit = () => {
        if (!isValid) return;

        post(route("troublereport.store"), {
            forceFormData: true,
            preserveScroll: true,
            data: { ...data, total_amount: computedTotal },
            onSuccess: () => {
                reset();
                if (photoInputRef.current) photoInputRef.current.value = "";
                onClose();
            },
        });
    };

    const handleRemoveImage = () => {
        setData("photograph", null);
        if (photoInputRef.current) photoInputRef.current.value = "";
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-[#f5f7fb] rounded-xl w-full max-w-lg z-10 flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">✕</button>

                <h2 className="text-xl font-bold text-center py-4 text-[#101E33]">
                    ADD NEW TROUBLE REPORT RECORD
                </h2>

                <div className="overflow-y-auto px-6 pb-6 space-y-4 text-[15px] text-[#101E33]">
                    <div>
                        <label className="font-semibold">Computer No.</label>
                        <input
                            required
                            className="w-full rounded border px-3 py-2 text-[15px]"
                            value={data.computer_no}
                            onChange={(e) => setData("computer_no", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Work Group</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2 text-[15px]"
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
                            required
                            className="w-full rounded border px-3 py-2 text-[15px]"
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
                            required
                            className="w-full rounded border px-3 py-2 text-[15px]"
                            value={data.username}
                            onChange={(e) => setData("username", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Date Issued</label>
                        <input
                            required
                            type="date"
                            className="w-full rounded border px-3 py-2 text-[15px]"
                            value={data.date_issued}
                            onChange={(e) => setData("date_issued", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Computer Type</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2 text-[15px]"
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
                                required
                                className="mt-2 w-full rounded border px-3 py-2 text-[15px]"
                                placeholder="Specify Others"
                                value={data.computer_type_other}
                                onChange={(e) => setData("computer_type_other", e.target.value)}
                            />
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Problem Report</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full rounded border px-3 py-2 text-[15px]"
                            value={data.problem_report}
                            onChange={(e) => setData("problem_report", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Trouble Shooting Report</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full rounded border px-3 py-2 text-[15px]"
                            value={data.troubleshooting_report}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData("troubleshooting_report", val);
                                setData("final_recommendations", val);
                            }}
                        />
                    </div>

                    <div className="pt-2">
                        <h3 className="font-bold text-[#101E33]">Estimate Cost Info</h3>

                        <div className="mt-2">
                            <label className="font-semibold">Item</label>
                            <input
                                required
                                className="w-full rounded border px-3 py-2 text-[15px]"
                                value={data.item}
                                onChange={(e) => setData("item", e.target.value)}
                            />
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold">Quantity</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="w-full rounded border px-3 py-2 text-[15px]"
                                    value={data.quantity}
                                    onChange={(e) => setData("quantity", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Unit Price</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded border px-3 py-2 text-[15px]"
                                    value={data.unit_price}
                                    onChange={(e) => setData("unit_price", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="font-semibold">Total Amount</label>
                            <input
                                readOnly
                                className="w-full rounded border px-3 py-2 text-[15px] bg-gray-100"
                                value={computedTotal}
                                onChange={() => {}}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold">Photograph</label>
                        <input
                            required
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="w-full rounded border px-3 py-2 bg-white text-[15px]"
                            onChange={(e) => setData("photograph", e.target.files[0])}
                        />

                        {data.photograph && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="mt-2 text-sm text-red-600 hover:underline"
                            >
                                Remove selected image
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="font-semibold">Trouble Remarks</label>
                        <input
                            required
                            className="w-full rounded border px-3 py-2 text-[15px]"
                            value={data.remarks}
                            onChange={(e) => setData("remarks", e.target.value)}
                        />
                    </div>

                    {/* SIGNATORIES */}
                    <h3 className="font-bold mt-2">IT SECTION</h3>
                    <textarea className="w-full rounded border px-3 py-2"
                        placeholder={"Prepared By\nPosition"}
                        value={data.it_prepared_by}
                        onChange={(e) => setData("it_prepared_by", e.target.value)}
                    />
                    <textarea className="w-full rounded border px-3 py-2"
                        placeholder={"Checked By\nPosition"}
                        value={data.it_checked_by}
                        onChange={(e) => setData("it_checked_by", e.target.value)}
                    />
                    <textarea className="w-full rounded border px-3 py-2"
                        placeholder={"Approved By\nPosition"}
                        value={data.it_approved_by}
                        onChange={(e) => setData("it_approved_by", e.target.value)}
                    />

                    <h3 className="font-bold mt-2">USER DEPARTMENT</h3>
                    <textarea className="w-full rounded border px-3 py-2"
                        placeholder={"Reported By\nPosition"}
                        value={data.user_reported_by}
                        onChange={(e) => setData("user_reported_by", e.target.value)}
                    />
                    <textarea className="w-full rounded border px-3 py-2"
                        placeholder={"Checked By\nPosition"}
                        value={data.user_checked_by}
                        onChange={(e) => setData("user_checked_by", e.target.value)}
                    />
                    <textarea className="w-full rounded border px-3 py-2"
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
                            disabled={!isValid || processing}
                            className="px-6 py-2 rounded bg-green-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}