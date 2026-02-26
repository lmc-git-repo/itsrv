import { useForm } from "@inertiajs/react";

export default function CreateTicketModal({ show, onClose }) {

    const { data, setData, post, processing, reset } = useForm({
        employee_name: "",
        department: "",
        category: "",
        problem_description: "",
        status: "Open",
        date_opened: "", // ✅ INSERTED
    });

    const departments = [
        "Accounting", "Admin", "Assembly", "CMM", "COOP", "Deburring",
        "Die Casting", "Die Casting Engineering", "Die Mold", "Facilities",
        "Finance", "GA", "Guard House", "HR", "IMS", "IT",
        "Learning and Development", "Machine Engineering", "Machining", "MRO",
        "New Project", "PPC", "Purchasing", "QC", "Safety", "Sales",
    ];

    const categories = [
        "Application & System Support",
        "Hardware Support & Device Setup",
        "Account & Access Management",
        "File, Data & Document Management",
        "Network & Connectivity Support",
        "IT Operations & Maintenance",
        "Asset & Equipment Handling",
        "Security & Permissions",
        "Others",
    ];

    const statuses = ["Open", "Ongoing", "Resolved"];

    const isValid =
        data.employee_name.trim() &&
        data.department &&
        data.category &&
        data.problem_description.trim() &&
        data.status &&
        data.date_opened; // ✅ INSERTED

    const submit = () => {
        if (!isValid) return;

        post(route("tickets.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!show) {
        return <div className="hidden" />;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="relative bg-[#f5f7fb] rounded-xl w-full max-w-lg p-6 shadow-xl z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                    ADD NEW TICKET
                </h2>

                <div className="space-y-4 text-sm text-[#101E33]">

                    <div>
                        <label className="block mb-1">Employee Name</label>
                        <input
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.employee_name}
                            onChange={e => setData("employee_name", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Department</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.department}
                            onChange={e => setData("department", e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Category</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.category}
                            onChange={e => setData("category", e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Date Opened</label>
                        <input
                            type="date"
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.date_opened}
                            onChange={e => setData("date_opened", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Problem Description</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full rounded border px-3 py-2"
                            value={data.problem_description}
                            onChange={e => setData("problem_description", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.status}
                            onChange={e => setData("status", e.target.value)}
                        >
                            {statuses.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={submit}
                            disabled={!isValid || processing}
                            className="px-5 py-2 bg-green-500 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}