import { useState } from "react";
import { useForm } from "@inertiajs/react";
import TicketSuggestions from "@/Constants/TicketSuggestions";

export default function CreateTicketModal({ show, onClose }) {
    const [showProblemSuggestions, setShowProblemSuggestions] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        employee_name: "",
        department: "",
        category: "",
        problem_description: "",
        status: "Open",
        date_opened: "",
        resolved_at: "",
    });

    const departments = [
        "Accounting", "Admin", "Assembly", "CMM", "COOP", "Deburring",
        "Die Casting", "Die Casting Engineering", "Die Mold", "Facilities",
        "Finance", "GA", "Guard House", "HR", "IMS", "IT",
        "Learning and Development", "Machine Engineering", "Machining", "MRO",
        "New Project", "PPC", "Purchasing", "QC", "Safety", "Sales",
    ];

    const categories = Object.keys(TicketSuggestions.superadmin);

    const statuses = ["Open", "Ongoing", "Resolved"];

    const isValid =
        data.employee_name.trim() &&
        data.department &&
        data.category &&
        data.problem_description.trim() &&
        data.status &&
        data.date_opened;

    const submit = () => {
        if (!isValid) return;

        post(route("tickets.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowProblemSuggestions(false);
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

            <div className="relative bg-[#f5f7fb] rounded-xl w-full max-w-lg p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
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
                            onFocus={() => setShowProblemSuggestions(false)}
                            onChange={(e) =>
                                setData("employee_name", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Department</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.department}
                            onFocus={() => setShowProblemSuggestions(false)}
                            onChange={(e) =>
                                setData("department", e.target.value)
                            }
                        >
                            <option value="">Select Department</option>

                            {departments.map((department) => (
                                <option
                                    key={department}
                                    value={department}
                                >
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Category</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.category}
                            onFocus={() => setShowProblemSuggestions(false)}
                            onChange={(e) => {
                                setData("category", e.target.value);
                                setShowProblemSuggestions(false);
                            }}
                        >
                            <option value="">Select Category</option>

                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
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
                            onFocus={() => setShowProblemSuggestions(false)}
                            onChange={(e) =>
                                setData("date_opened", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-1">
                            Problem Description
                        </label>

                        <textarea
                            required
                            rows="3"
                            className="w-full rounded border px-3 py-2"
                            value={data.problem_description}
                            onFocus={() =>
                                setShowProblemSuggestions(true)
                            }
                            onChange={(e) => {
                                setData(
                                    "problem_description",
                                    e.target.value
                                );
                                setShowProblemSuggestions(false);
                            }}
                        />

                        {showProblemSuggestions &&
                            data.category &&
                            TicketSuggestions.superadmin[data.category]
                                ?.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {TicketSuggestions.superadmin[
                                        data.category
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            className="block w-full text-left rounded border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-100 !text-black"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() => {
                                                setData(
                                                    "problem_description",
                                                    suggestion
                                                );
                                                setShowProblemSuggestions(
                                                    false
                                                );
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>

                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                            required
                            className="w-full rounded border px-3 py-2"
                            value={data.status}
                            onFocus={() => setShowProblemSuggestions(false)}
                            onChange={(e) =>
                                setData("status", e.target.value)
                            }
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
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