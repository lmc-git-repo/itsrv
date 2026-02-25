import { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

import CreateModal from "./Create";
import EditModal from "./Edit";
import ShowModal from "./Show";

export default function TroubleReportIndex({ reports = [] }) {
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [selected, setSelected] = useState(null);

    const [search, setSearch] = useState("");

    const [showDelete, setShowDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const safeReports = Array.isArray(reports) ? reports : [];

    const filteredReports = safeReports.filter((r) => {
        const keyword = search.toLowerCase().trim();
        if (!keyword) return true;

        const values = [
            r.tr_no,
            r.computer_no,
            r.work_group,
            r.section,
            r.username,
            r.computer_type,
            r.created_by,
        ];

        return values.some(
            (v) =>
                v !== null &&
                v !== undefined &&
                String(v).toLowerCase().includes(keyword)
        );
    });

    const confirmDelete = () => {
        if (!deleteTarget?.id) return;

        router.delete(
            route("troublereport.destroy", { troublereport: deleteTarget.id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDelete(false);
                    setDeleteTarget(null);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg font-semibold">Trouble Report</h2>}
        >
            <Head title="Trouble Report" />

            <div className="tickets-wrapper shadow-its records-page">
                <div className="tickets-toolbar">
                    <div className="records-search">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="tickets-add-btn flex items-center gap-2"
                    >
                        🛠️ Add
                    </button>
                </div>

                <div className="tickets-table-wrapper">
                    <table className="tickets-table records-table">
                        <thead>
                            <tr>
                                <th>Trouble Report No.</th>
                                <th>Computer No.</th>
                                <th>WorkGroup</th>
                                <th>Username</th>
                                <th>Computer Type</th>
                                <th>Created By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredReports.length > 0 ? (
                                filteredReports.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => {
                                            setSelected(r);
                                            setShowView(true);
                                        }}
                                    >
                                        <td>{r.tr_no}</td>
                                        <td>{r.computer_no}</td>
                                        <td>{r.work_group}</td>
                                        <td>{r.username}</td>
                                        <td>{r.computer_type}</td>
                                        <td>{r.created_by}</td>

                                        <td
                                            className="space-x-3"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelected(r);
                                                    setShowEdit(true);
                                                }}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDeleteTarget(r);
                                                    setShowDelete(true);
                                                }}
                                            >
                                                🗑
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (!r?.id) return;
                                                    window.location.href = route(
                                                        "troublereport.download",
                                                        { troublereport: r.id }
                                                    );
                                                }}
                                                title="Download Excel"
                                            >
                                                ⬇️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No trouble report records available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        links={reportLinks}
                        queryParams={{ search }}
                    />
                </div>
            </div>

            <CreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
            />

            <EditModal
                show={showEdit}
                report={selected}
                onClose={() => setShowEdit(false)}
            />

            <ShowModal
                show={showView}
                report={selected}
                onClose={() => setShowView(false)}
            />

            {showDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowDelete(false)}
                    />

                    <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 text-[#101E33]">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>

                        <h2 className="text-xl font-bold mb-3 text-center">
                            DELETE TROUBLE REPORT?
                        </h2>

                        <p className="text-sm text-center text-gray-600 mb-6">
                            Are you sure you want to permanently delete this
                            trouble report?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDelete(false)}
                                className="px-6 py-2 rounded-lg bg-gray-500 text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold"
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