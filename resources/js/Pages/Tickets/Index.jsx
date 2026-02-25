import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import CreateTicketModal from "./Create";
import ShowTicketModal from "./Show";
import EditTicketModal from "./Edit";
import Pagination from "@/Components/Pagination";

export default function TicketsIndex({ tickets = [] }) {
    const [showCreate, setShowCreate] = useState(false);
    const [showView, setShowView] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editTicket, setEditTicket] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteTicket, setDeleteTicket] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [activeRowId, setActiveRowId] = useState(null);
    const { flash } = usePage().props;
    const ticketData = tickets?.data ?? [];
    const ticketLinks = tickets?.meta?.links ?? [];

    const departments = [
        "Accounting", "Admin", "Assembly", "CMM", "COOP", "Deburring",
        "Die Casting", "Die Casting Engineering", "Die Mold", "Facilities",
        "Finance", "GA", "Guard House", "HR", "IMS", "IT",
        "Learning and Development", "Machine Engineering", "Machining", "MRO",
        "New Project", "PPC", "Purchasing", "QC", "Safety", "Sales",
    ];

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Open":
                return "bg-slate-100 text-slate-700";
            case "Ongoing":
                return "bg-amber-100 text-amber-700";
            case "Resolved":
                return "bg-green-100 text-green-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const filteredTickets = tickets.filter((t) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            t.ticket_no?.toLowerCase().includes(keyword) ||
            t.employee_name?.toLowerCase().includes(keyword) ||
            t.department?.toLowerCase().includes(keyword) ||
            t.status?.toLowerCase().includes(keyword) ||
            t.creator?.name?.toLowerCase().includes(keyword);

        const matchesStatus = !statusFilter || t.status === statusFilter;
        const matchesDepartment = !departmentFilter || t.department === departmentFilter;

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const confirmDelete = () => {
        if (!deleteTicket) return;

        router.delete(route("tickets.destroy", deleteTicket.id), {
            onFinish: () => {
                setShowDelete(false);
                setDeleteTicket(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg font-semibold tracking-wide">Tickets</h2>}
        >
            <Head title="Tickets" />

            {flash?.success && (
                <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded">
                    {flash.success}
                </div>
            )}

            <div className="flex items-center mb-6">
                <div className="w-[25%]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-full px-4 py-2 text-sm text-[#101E33] w-full"
                    />
                </div>

                <div className="w-[20%] ml-[6%]">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-full px-4 py-2 text-sm text-[#101E33] w-full"
                    >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                <div className="w-[30%] ml-[6%]">
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="rounded-full px-4 py-2 text-sm text-[#101E33] w-full"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                            <option key={dep} value={dep}>
                                {dep}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto">
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
                    >
                        🎫 Add
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-its bg-white">
                <table className="w-full text-sm text-[#101E33] table-fixed">
                    <colgroup>
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>

                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3">Ticket No.</th>
                            <th className="px-4 py-3 text-center">Employee Name</th>
                            <th className="px-4 py-3 text-center">Department</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Created By</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTickets.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-400">
                                    No tickets found.
                                </td>
                            </tr>
                        )}

                        {filteredTickets.map((t) => (
                            <tr
                                key={t.id}
                                className={`border-t cursor-pointer ${
                                    activeRowId === t.id
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-100"
                                }`}
                                onClick={() => {
                                    setSelectedTicket(t);
                                    setActiveRowId(t.id);
                                    setShowView(true);
                                }}
                            >
                                <td className="px-4 py-3 font-medium">{t.ticket_no}</td>
                                <td className="px-4 py-3 text-center">{t.employee_name}</td>
                                <td className="px-4 py-3 text-center">{t.department}</td>

                                <td className="px-4 py-3">
                                    <div className="flex justify-center items-center">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadgeClass(
                                                t.status
                                            )}`}
                                        >
                                            {t.status}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex justify-center items-center">
                                        {t.creator?.name}
                                    </div>
                                </td>

                                <td
                                    className="px-4 py-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => {
                                                setEditTicket(t);
                                                setShowEdit(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            onClick={() => {
                                                setDeleteTicket(t);
                                                setShowDelete(true);
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                links={ticketLinks}
                queryParams={{
                    search,
                    status: statusFilter,
                    department: departmentFilter,
                }}
                />
            </div>

            <CreateTicketModal show={showCreate} onClose={() => setShowCreate(false)} />
            <ShowTicketModal
                show={showView}
                ticket={selectedTicket}
                onClose={() => {
                    setShowView(false);
                    setActiveRowId(null);
                }}
            />
            <EditTicketModal show={showEdit} ticket={editTicket} onClose={() => setShowEdit(false)} />

            {showDelete && deleteTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowDelete(false)}
                    />

                    <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-10 text-center">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            DELETE TICKET
                        </h2>

                        <p className="text-sm text-gray-700 mb-6">
                            Are you sure you want to permanently delete this ticket?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDelete(false)}
                                className="px-5 py-2 rounded bg-gray-500 text-white text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}