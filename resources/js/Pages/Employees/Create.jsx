import { useForm } from "@inertiajs/react";

export default function CreateEmployee({ onClose }) {
    const { data, setData, post } = useForm({
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

    const valid =
        data.name.trim() &&
        data.department.trim() &&
        data.status.trim();

    const submit = (e) => {
        e.stopPropagation();

        if (!valid) return;

        post("/employees", {
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
                background: "rgba(0,0,0,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                className="users-modal-card"
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    background: "#f9fafb",
                    borderRadius: "18px",
                    padding: "32px",
                    width: "100%",
                    maxWidth: "540px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
                }}
            >
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "transparent",
                        border: "none",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#374151",
                        cursor: "pointer",
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>

                <h2
                    style={{
                        textAlign: "center",
                        fontWeight: "700",
                        marginBottom: "18px",
                        fontSize: "20px",
                        color: "#101E33",
                        letterSpacing: "0.6px",
                    }}
                >
                    ADD NEW EMPLOYEE
                </h2>

                <label style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", display: "block", color: "#111827" }}>
                    Name
                </label>
                <input
                    required
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        marginBottom: "18px",
                        fontSize: "16px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                    }}
                />

                <label style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", display: "block", color: "#111827" }}>
                    Department
                </label>
                <select
                    value={data.department}
                    onChange={(e) => setData("department", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        marginBottom: "18px",
                        fontSize: "16px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>

                <label style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", display: "block", color: "#111827" }}>
                    Status
                </label>
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        marginBottom: "26px",
                        fontSize: "16px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
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
                        gap: "18px",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: "#6b7280",
                            color: "#ffffff",
                            border: "none",
                            padding: "10px 28px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "15px",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={!valid}
                        onClick={(e) => submit(e)}
                        style={{
                            background: valid ? "#22c55e" : "#9ca3af",
                            color: "#ffffff",
                            border: "none",
                            padding: "10px 34px",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: valid ? "pointer" : "not-allowed",
                            fontSize: "15px",
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}