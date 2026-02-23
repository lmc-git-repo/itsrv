import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

export default function Index({ records = [] }) {
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [selected, setSelected] = useState(null);
    const [editRecord, setEditRecord] = useState(null);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredRecords = records.filter((r) => {
        const keyword = search.toLowerCase();
        return (
            r.transfer_slip_no?.toLowerCase().includes(keyword) ||
            r.to?.toLowerCase().includes(keyword) ||
            r.from?.toLowerCase().includes(keyword) ||
            r.equipment?.toLowerCase().includes(keyword) ||
            String(r.created_by ?? "").toLowerCase().includes(keyword) ||
            String(r.created_by_name ?? "").toLowerCase().includes(keyword)
        );
    });

    const thStyle = {
        fontSize: "15px",
        paddingTop: "12px",
        paddingBottom: "12px",
    };

    const tdStyle = {
        fontSize: "15px",
        paddingTop: "12px",
        paddingBottom: "12px",
    };

    const searchStyle = {
        fontSize: "15px",
    };

    const actionIconStyle = {
        fontSize: "16px",
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg font-semibold">Transfer Slip</h2>}
        >
            <Head title="Transfer Slip" />
            <div
                className="tr-wrapper records-page"
                style={{ marginTop: "0" }}
            >
                {/* HEADER */}
                <div className="tr-header">
                    <div className="records-search transfer-search">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={searchStyle}
                        />
                    </div>

                    <button
                        className="tr-add-btn"
                        onClick={() => setShowCreate(true)}
                    >
                        🧾 Add
                    </button>
                </div>

                {/* TABLE */}
                <div className="tr-table-wrapper">
                    <table className="tr-table">
                        <thead>
                            <tr>
                                <th style={thStyle}>Transfer Slip No.</th>
                                <th style={thStyle}>To</th>
                                <th style={thStyle}>From</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Equipment</th>
                                <th style={thStyle}>Created By</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: "center",
                                            padding: "24px",
                                            fontSize: "16px",
                                            color: "#6b7280",
                                            fontWeight: "500",
                                        }}
                                    >
                                        No transfer slip records available.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => setSelected(r)}
                                    >
                                        <td style={tdStyle}>{r.transfer_slip_no}</td>
                                        <td style={tdStyle}>{r.to}</td>
                                        <td style={tdStyle}>{r.from}</td>
                                        <td style={tdStyle}>{r.date}</td>
                                        <td style={tdStyle}>{r.equipment}</td>
                                        <td style={tdStyle}>
                                            {r.created_by_name ?? r.created_by}
                                        </td>

                                        <td
                                            className="tr-actions"
                                            onClick={(e) => e.stopPropagation()}
                                            style={tdStyle}
                                        >
                                            <span
                                                className="tr-action-btn"
                                                onClick={() => setEditRecord(r)}
                                                style={actionIconStyle}
                                            >
                                                ✏️
                                            </span>

                                            <span
                                                className="tr-action-btn"
                                                onClick={() => {
                                                    setDeleteTarget(r);
                                                    setShowDelete(true);
                                                }}
                                                style={actionIconStyle}
                                            >
                                                🗑
                                            </span>

                                            <span
                                                className="tr-action-btn"
                                                onClick={() =>
                                                    window.open(
                                                        route("transferslip.download", r.id),
                                                        "_blank"
                                                    )
                                                }
                                                style={actionIconStyle}
                                            >
                                                ⬇️
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODALS */}
                {showCreate && <Create onClose={() => setShowCreate(false)} />}

                {editRecord && (
                    <Edit
                        record={editRecord}
                        onClose={() => setEditRecord(null)}
                    />
                )}

                {selected && (
                    <Show
                        record={selected}
                        onClose={() => setSelected(null)}
                    />
                )}

                {showDelete && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setShowDelete(false)}
                        />

                        <div className="relative bg-white rounded-xl w-full max-w-sm p-6 z-10 text-center">
                            <button
                                className="absolute top-3 right-4 text-xl text-gray-500"
                                onClick={() => setShowDelete(false)}
                            >
                                ✕
                            </button>

                            <h2
                                className="text-lg font-bold mb-3"
                                style={{ color: "#000" }}
                            >
                                DELETE TRANSFER SLIP?
                            </h2>

                            <p className="text-sm text-gray-700 mb-6">
                                Are you sure you want to permanently delete this
                                transfer slip?
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-6 py-2 rounded-md bg-gray-500 text-white text-sm"
                                    onClick={() => setShowDelete(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-6 py-2 rounded-md bg-red-500 text-white text-sm"
                                    onClick={() => {
                                        router.delete(
                                            route(
                                                "transferslip.destroy",
                                                deleteTarget.id
                                            ),
                                            {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    setShowDelete(false);
                                                    setDeleteTarget(null);
                                                },
                                            }
                                        );
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}