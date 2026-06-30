import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import CreateEmployee from "./Create";
import EditEmployee from "./Edit";
import ShowEmployee from "./Show";
import Pagination from "@/Components/Pagination";

export default function EmployeesIndex({ employees = [] }) {
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [showEmployee, setShowEmployee] = useState(null);
    const [deleteEmployee, setDeleteEmployee] = useState(null);

    const employeeData = Array.isArray(employees)
        ? employees
        : employees?.data ?? [];

    const employeeLinks = employees?.links ?? [];

    const handleSearch = (value) => {
        setSearch(value);

        router.get(
            route("employees.index"),
            { search: value },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = () => {
        if (!deleteEmployee) return;

        window.axios
            .post(`/employees/${deleteEmployee.id}`, {
                _method: "delete",
            })
            .then(() => {
                setDeleteEmployee(null);
                location.reload();
            });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg font-semibold">Employees</h2>}
        >
            <Head title="Employees" />

            <div className="users-wrapper shadow-its records-page">
                <div className="users-toolbar">
                    <div className="users-search">
                        <input
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
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
                                <th>Department</th>
                                <th>Status</th>
                                <th>Created By</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employeeData.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="cursor-pointer"
                                    onClick={() => setShowEmployee(employee)}
                                >
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.status}</td>
                                    <td>{employee.creator?.name || "—"}</td>
                                    <td>
                                        {employee.created_at
                                            ? new Date(employee.created_at).toLocaleDateString("en-CA")
                                            : "—"}
                                    </td>
                                    <td
                                        className="users-actions"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span onClick={() => setEditEmployee(employee)}>✏️</span>
                                        <span onClick={() => setDeleteEmployee(employee)}>🗑️</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        links={employeeLinks}
                        queryParams={{ search }}
                    />
                </div>
            </div>

            {showCreate && (
                <CreateEmployee onClose={() => setShowCreate(false)} />
            )}

            {editEmployee && (
                <EditEmployee
                    employee={editEmployee}
                    onClose={() => setEditEmployee(null)}
                />
            )}

            {showEmployee && (
                <ShowEmployee
                    employee={showEmployee}
                    onClose={() => setShowEmployee(null)}
                />
            )}

            {deleteEmployee && (
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
                    onClick={() => setDeleteEmployee(null)}
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
                            DELETE EMPLOYEE
                        </h3>

                        <p style={{ marginBottom: "24px", color: "#374151" }}>
                            Are you sure you want to permanently delete this employee?
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
                                onClick={() => setDeleteEmployee(null)}
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