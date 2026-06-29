export default function ShowEmployee({ employee, onClose }) {
    if (!employee) return null;

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
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "30px",
                    width: "100%",
                    maxWidth: "520px",
                    position: "relative",
                    color: "#101E33",
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
                    EMPLOYEE DETAILS
                </h2>

                <div style={{ fontSize: "15px", lineHeight: "1.9" }}>
                    <p><strong>ID:</strong> {employee.id}</p>
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Dept:</strong> {employee.department}</p>
                    <p><strong>Status:</strong> {employee.status}</p>
                    <p><strong>Created By:</strong> {employee.creator?.name || "—"}</p>
                    <p><strong>Created Date:</strong> {employee.created_at}</p>
                </div>
            </div>
        </div>
    );
}