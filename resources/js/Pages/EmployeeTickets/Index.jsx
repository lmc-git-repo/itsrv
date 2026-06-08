import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function EmployeeTicketsIndex({ tickets = [], tracking_code = "", submitted_ticket_no = "" }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editTicket, setEditTicket] = useState(null);
    const [monitorTrackingCode, setMonitorTrackingCode] = useState("");

    const { data, setData, post, processing, reset } = useForm({
        employee_name: "",
        department: "",
        category: "",
        problem_description: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
    } = useForm({
        employee_name: "",
        department: "",
        category: "",
        problem_description: "",
        tracking_code: tracking_code || "",
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

    useEffect(() => {
    setMonitorTrackingCode(tracking_code || "");
}, [tracking_code]);

    useEffect(() => {
        if (editTicket) {
            setEditData({
                employee_name: editTicket.employee_name || "",
                department: editTicket.department || "",
                category: editTicket.category || "",
                problem_description: editTicket.problem_description || "",
                tracking_code: tracking_code || editTicket.tracking_code || monitorTrackingCode || "",
            });
        }
    }, [editTicket]);

    const submit = (e) => {
    e.preventDefault();

    post(route("employee.tickets.store"), {
        preserveScroll: true,
        onSuccess: () => {
            reset();
            setMonitorTrackingCode("");
            localStorage.removeItem("employee_tracking_code");

            router.get(
                route("employee.tickets"),
                {},
                {
                    preserveScroll: true,
                    preserveState: false,
                }
            );
        },
    });
};

    const checkTicketStatus = (e) => {
        e.preventDefault();

        if (!monitorTrackingCode.trim()) return;

        localStorage.setItem("employee_tracking_code", monitorTrackingCode.trim());

        router.get(route("employee.tickets"), {
            tracking_code: monitorTrackingCode.trim(),
        });
    };

    const updateTicket = (e) => {
        e.preventDefault();

        if (!editTicket) return;

        put(route("employee.tickets.update", editTicket.id), {
            preserveScroll: true,
            onSuccess: () => setEditTicket(null),
        });
    };

    const statusClass = (status) => {
        switch (status) {
            case "Open":
                return "employee-status-open";
            case "Ongoing":
                return "employee-status-ongoing";
            case "Resolved":
                return "employee-status-resolved";
            default:
                return "employee-status-open";
        }
    };

    const visibleTickets = tickets;

    return (
        <>
            <Head title="Employee Ticket Form" />

            <div className="employee-ticket-page">
                <div className="employee-ticket-container">

                    <section className="employee-ticket-form-card">
                        <div className="employee-ticket-header">
                            <img
                                src="/images/LMC-Logo-Wht.png"
                                alt="LMC Logo"
                                className="employee-ticket-logo"
                            />

                            <div>
                                <h1>Employee Ticket Form</h1>
                                <p>Submit your concern directly to IT Department</p>
                            </div>
                        </div>

                        {submitted_ticket_no && (
                            <div className="employee-ticket-alert">
                                Your ticket was submitted successfully. Tracking Code: <strong>{submitted_ticket_no}</strong>
                            </div>
                        )}

                        <form onSubmit={submit} className="employee-ticket-form">
                            <div>
                                <label>Employee Name</label>
                                <input
                                    type="text"
                                    value={data.employee_name}
                                    onChange={(e) => setData("employee_name", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Department</label>
                                <select
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
                                <label>Category</label>
                                <select
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
                                <label>Problem Description</label>
                                <textarea
                                    rows="6"
                                    value={data.problem_description}
                                    onChange={(e) => setData("problem_description", e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" disabled={processing}>
                                Submit Ticket
                            </button>
                        </form>
                    </section>

                    <section className="employee-ticket-monitor-card">
                        <div className="employee-ticket-monitor-header">
                            <h2>Ticket Monitoring Table</h2>
                            <p>Enter your ticket number or employee name to check ticket history. Refresh this page to see latest updates.</p>
                        </div>

                        <form onSubmit={checkTicketStatus} className="employee-ticket-monitor-form">
                            <div>
                                <label>Ticket No. / Employee Name</label>
                                <input
                                    type="text"
                                    value={monitorTrackingCode}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase();
                                        setMonitorTrackingCode(value);
                                        
                                        if (!value.trim()) {
                                            router.get(route("employee.tickets"), {}, {
                                                preserveScroll: true,
                                                preserveState: false,
                                            });
                                        }
                                    }}
                                    placeholder="Enter ticket # or employee name"
                                />
                            </div>

                            <button type="submit">
                                Check Status
                            </button>
                        </form>

                        <div className="employee-ticket-list">
                            {visibleTickets.length === 0 && (
                                <div className="employee-ticket-empty">
                                    No tickets found.
                                </div>
                            )}

                            {visibleTickets.map((ticket) => (
                                <div key={ticket.id} className="employee-ticket-item">
                                    <div className="employee-ticket-item-top">
                                        <strong>{ticket.ticket_no}</strong>
                                        <span className={statusClass(ticket.status)}>
                                            {ticket.status}
                                        </span>
                                    </div>

                                    <p>{ticket.problem_description}</p>

                                    <small>
                                        Employee: {ticket.employee_name || "—"} | Department: {ticket.department || "—"}
                                    </small>

                                    <div className="employee-ticket-actions">
                                        <button
                                            type="button"
                                            className="employee-ticket-view-btn"
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            View Details
                                        </button>

                                        {ticket.status === "Open" && (
                                            <button
                                                type="button"
                                                className="employee-ticket-edit-btn"
                                                onClick={() => setEditTicket(ticket)}
                                            >
                                                ✏️ Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                <footer
                    className="employee-ticket-footer"
                    style={{
                        width: "100%",
                        maxWidth: "1600px",
                        minHeight: "58px",
                        margin: "55px auto 60px",
                        padding: "0 24px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    If your ticket concern submitted through this form is not addressed immediately, please call local 41 or email itd@lagunametts.com through Outlook.
                </footer>
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setSelectedTicket(null)}
                    />

                    <div className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10 text-[#101E33] max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            onClick={() => setSelectedTicket(null)}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                            Ticket Details
                        </h2>

                        <div className="space-y-3 text-base text-[#101E33]">
                            <p><strong>Ticket No:</strong> {selectedTicket.ticket_no}</p>
                            <p><strong>Employee Name:</strong> {selectedTicket.employee_name}</p>
                            <p><strong>Department:</strong> {selectedTicket.department}</p>
                            <p><strong>Category:</strong> {selectedTicket.category}</p>
                            <p><strong>Status:</strong> {selectedTicket.status}</p>
                            <p><strong>Date Opened:</strong> {selectedTicket.date_opened}</p>
                            <p><strong>Resolved At:</strong> {selectedTicket.resolved_at || "—"}</p>

                            <div>
                                <strong>Problem Description:</strong>
                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={selectedTicket.problem_description || ""}
                                />
                            </div>

                            <div>
                                <strong>Progress Update:</strong>
                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={selectedTicket.progress_update || "No progress update yet."}
                                />
                            </div>

                            <div>
                                <strong>Problem Solution:</strong>
                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={selectedTicket.problem_solution || "No solution provided yet."}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setEditTicket(null)}
                    />

                    <div className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10 text-[#101E33] max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            onClick={() => setEditTicket(null)}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                            Edit Ticket
                        </h2>

                        <form onSubmit={updateTicket} className="space-y-4 text-sm text-[#101E33]">
                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    Employee Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={editData.employee_name}
                                    onChange={(e) => setEditData("employee_name", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    Department
                                </label>
                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={editData.department}
                                    onChange={(e) => setEditData("department", e.target.value)}
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
                                    value={editData.category}
                                    onChange={(e) => setEditData("category", e.target.value)}
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
                                    rows="5"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={editData.problem_description}
                                    onChange={(e) => setEditData("problem_description", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditTicket(null)}
                                    className="px-6 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}