import { Head, useForm } from "@inertiajs/react";

export default function EmployeeTicketEdit({ ticket, tracking_code = "" }) {
    const { data, setData, put, processing } = useForm({
        employee_name: ticket.employee_name || "",
        department: ticket.department || "",
        category: ticket.category || "",
        problem_description: ticket.problem_description || "",
        tracking_code: tracking_code || ticket.tracking_code || "",
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
        "Asset & Equipment Handling",
        "Security & Permissions",
        "Others",
    ];

    const submit = (e) => {
        e.preventDefault();

        put(route("employee.tickets.update", ticket.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Employee Ticket" />

            <div className="employee-ticket-page">
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" />

                    <section className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10 text-[#101E33] max-h-[90vh] overflow-y-auto">
                        <h1 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                            Edit Ticket
                        </h1>

                        <form onSubmit={submit} className="space-y-4 text-sm text-[#101E33]">
                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    Employee Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.employee_name}
                                    onChange={(e) => setData("employee_name", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    Department
                                </label>
                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.department}
                                    onChange={(e) => setData("department", e.target.value)}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((department) => (
                                        <option key={department} value={department}>
                                            {department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    Category
                                </label>
                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.category}
                                    onChange={(e) => setData("category", e.target.value)}
                                    required
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
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    Problem Description
                                </label>
                                <textarea
                                    rows="6"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.problem_description}
                                    onChange={(e) => setData("problem_description", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
}