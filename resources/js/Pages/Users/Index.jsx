import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import CreateUser from "./Create";
import EditUser from "./Edit";

export default function UsersIndex({ users }) {
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editUser, setEditUser] = useState(null);

    /* ✅ INSERTED ONLY — delete modal state */
    const [deleteUser, setDeleteUser] = useState(null);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    /* ✅ FIXED ONLY — Laravel-safe delete */
    const handleDelete = () => {
        if (!deleteUser) return;

        window.axios
            .post(`/users/${deleteUser.id}`, {
                _method: "delete",
            })
            .then(() => {
                setDeleteUser(null);
                location.reload();
            });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg font-semibold">Users</h2>}
        >
            <Head title="Users" />

            <div className="users-wrapper shadow-its records-page">
                <div className="users-toolbar">
                    <div className="users-search">
                        <input
                            placeholder="Search user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        className="users-add-btn"
                        onClick={() => setShowCreate(true)}
                    >
                        👤 Add
                    </button>
                </div>

                <div className="users-table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td className="users-actions">
                                        <span onClick={() => setEditUser(u)}>✏️</span>
                                        <span onClick={() => setDeleteUser(u)}>🗑️</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreate && <CreateUser onClose={() => setShowCreate(false)} />}
            {editUser && (
                <EditUser user={editUser} onClose={() => setEditUser(null)} />
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteUser && (
                <div
                    className="users-modal"
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                    onClick={() => setDeleteUser(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#f8fafc",
                            borderRadius: "14px",
                            padding: "28px",
                            width: "100%",
                            maxWidth: "420px",
                            textAlign: "center",
                        }}
                    >
                        <h3
                            style={{
                                fontWeight: "700",
                                marginBottom: "12px",
                                color: "#101E33",
                                fontSize: "18px",
                                letterSpacing: "0.6px",
                            }}
                        >
                            DELETE USER
                        </h3>

                        <p style={{ marginBottom: "24px", color: "#374151" }}>
                            Are you sure you want to permanently delete this existing user?
                        </p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "14px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setDeleteUser(null)}
                                style={{
                                    background: "#6b7280",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 24px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 26px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
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