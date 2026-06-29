import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function EditEmployee({ employee, onClose }) {
    const { data, setData, put } = useForm({
        name: "",
        department: "",
        status: "Employed",
    });

    const departments = [
        "Accounting", "Admin", "Assembly", "CMM", "COOP", "Deburring",
        "Die Casting", "Die Casting Engineering", "Die Mold", "Facilities",
        "Finance", "GA", "Guard House", "HR", "IMS", "IT",
        "Learning and Development", "Machine Engineering", "Machining", "MRO",
        "New Project", "PPC", "Purchasing", "QC", "Safety", "Sales",
    ];

    useEffect(() => {
        if (employee) {
            setData({
                name: employee.name ?? "",
                department: employee.department ?? "",
                status: employee.status ?? "Employed",
            });
        }
    }, [employee]);

    const changed =
        data.name !== employee?.name ||
        data.department !== employee?.department ||
        data.status !== employee?.status;

    const submit = (e) => {
        e.preventDefault();
        if (!changed) return;

        put(`/employees/${employee.id}`, {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
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
            onClick={onClose}
        >
            <form
                onSubmit={submit}
                className="users-modal-card"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "30px",
                    width: "100%",
                    maxWidth: "520px",
                    position: "relative",
                }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "14px",
                        right: "16px",
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#6b7280",
                        cursor: "pointer",
                    }}
                    aria-label="Close"
                >
                    ×
                </button>

                <h2
                    style={{
                        textAlign: "center",
                        fontWeight: "700",
                        marginBottom: "22px",
                        fontSize: "18px",
                        color: "#101E33",
                        letterSpacing: "0.5px",
                    }}
                >
                    EDIT EMPLOYEE
                </h2>

                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block", color: "#101E33" }}>
                    Name
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        marginBottom: "16px",
                        fontSize: "15px",
                        color: "#101E33",
                        background: "#ffffff",
                    }}
                />

                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block", color: "#101E33" }}>
                    Department
                </label>
                <select
                    value={data.department}
                    onChange={(e) => setData("department", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        marginBottom: "16px",
                        fontSize: "15px",
                        color: "#101E33",
                        background: "#ffffff",
                    }}
                >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>

                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block", color: "#101E33" }}>
                    Status
                </label>
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        marginBottom: "24px",
                        fontSize: "15px",
                        color: "#101E33",
                        background: "#ffffff",
                    }}
                >
                    <option value="Employed">Employed</option>
                    <option value="Resigned">Resigned</option>
                </select>

                <div
                    className="users-modal-actions"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: "#6b7280",
                            color: "#ffffff",
                            border: "none",
                            padding: "10px 26px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!changed}
                        style={{
                            background: changed ? "#22c55e" : "#9ca3af",
                            color: "#ffffff",
                            border: "none",
                            padding: "10px 30px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: changed ? "pointer" : "not-allowed",
                            fontSize: "14px",
                        }}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}