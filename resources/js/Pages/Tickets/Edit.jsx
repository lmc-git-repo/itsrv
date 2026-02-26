import { useEffect, useMemo } from "react";
import { useForm, usePage } from "@inertiajs/react";

export default function EditTicketModal({ show, ticket, onClose }) {
    const { users = [] } = usePage().props;

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

    const original = useMemo(() => {
        if (!ticket) return null;

        return {
            employee_name: ticket.employee_name || "",
            department: ticket.department || "",
            category: ticket.category || "",
            problem_description: ticket.problem_description || "",
            status: ticket.status || "",
            problem_solution: ticket.problem_solution || "",
            resolved_by: ticket.resolved_by || "",
            date_opened: ticket.date_opened || "",

            // ✅ INSERTED
            resolved_at: ticket.resolved_at || "",
        };
    }, [ticket]);

    const { data, setData, put, processing } = useForm(
        original || {
            employee_name: "",
            department: "",
            category: "",
            problem_description: "",
            status: "",
            problem_solution: "",
            resolved_by: "",
            date_opened: "",

            // ✅ INSERTED
            resolved_at: "",
        }
    );

    useEffect(() => {
        if (original) {
            setData(original);
        }
    }, [original]);

    const hasChanges = useMemo(() => {
        if (!original) return false;

        return Object.keys(original).some(
            (key) => data[key] !== original[key]
        );
    }, [data, original]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!hasChanges || !ticket) return;

        put(route("tickets.update", ticket.id), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!show || !ticket) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                    Edit Ticket
                </h2>

                <div className="space-y-4 text-sm text-[#101E33]">
                    <div>
                        <label>Employee Name</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={data.employee_name}
                            onChange={(e) =>
                                setData("employee_name", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Department</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={data.department}
                            onChange={(e) =>
                                setData("department", e.target.value)
                            }
                        >
                            <option value="">Select Department</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Category</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Problem Description</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={data.problem_description}
                            onChange={(e) =>
                                setData("problem_description", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Status</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={data.status}
                            onChange={(e) =>
                                setData("status", e.target.value)
                            }
                        >
                            <option value="Open">Open</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>

                    <div>
                        <label>Date Opened</label>
                        <input
                            type="date"
                            className="w-full rounded border px-3 py-2"
                            value={data.date_opened}
                            onChange={(e) =>
                                setData("date_opened", e.target.value)
                            }
                        />
                    </div>

                    {/* ✅ INSERTED: only show if resolved */}
                    {data.status === "Resolved" && (
                        <div>
                            <label>Resolved At</label>
                            <input
                                type="date"
                                className="w-full rounded border px-3 py-2"
                                value={data.resolved_at}
                                onChange={(e) =>
                                    setData("resolved_at", e.target.value)
                                }
                            />
                        </div>
                    )}

                    <div>
                        <label>Problem Solution</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            placeholder="Enter solution"
                            value={data.problem_solution}
                            onChange={(e) =>
                                setData("problem_solution", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Resolved By</label>
                        <select
                            className="w-full rounded border px-3 py-2 text-[#101E33]"
                            value={data.resolved_by}
                            onChange={(e) =>
                                setData("resolved_by", e.target.value)
                            }
                        >
                            <option value="">Select User</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded bg-gray-400 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!hasChanges || processing}
                        className={`px-6 py-2 rounded text-white ${
                            hasChanges
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-green-300 cursor-not-allowed"
                        }`}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}