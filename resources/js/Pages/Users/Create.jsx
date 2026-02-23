import { useForm } from "@inertiajs/react";
import { useState } from "react"; // ✅ INSERTED ONLY

export default function CreateUser({ onClose }) {
    const { data, setData, post } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [errorMessage, setErrorMessage] = useState(""); // ✅ INSERTED ONLY

    /* ✅ REQUIRED VALIDATION */
    const valid =
        data.name.trim() &&
        data.email.trim() &&
        data.password.trim() &&
        data.password_confirmation.trim() &&
        data.password === data.password_confirmation;

    /* ✅ INSERTED ONLY — accept event & stop bubbling */
    const submit = (e) => {
        e.stopPropagation();
        setErrorMessage(""); // ✅ INSERTED ONLY

        if (!valid) return;

        post("/users", {
            preserveScroll: true,

            /* ✅ INSERTED ONLY — UI ERROR (NO CONSOLE) */
            onError: (errors) => {
                if (errors.password) {
                    setErrorMessage(errors.password);
                } else if (errors.email) {
                    setErrorMessage(errors.email);
                } else {
                    setErrorMessage("Failed to create user. Please check inputs.");
                }
            },

            /* ✅ INSERTED ONLY — close ONLY if success */
            onSuccess: () => {
                onClose();
            },
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
                    ADD NEW USER
                </h2>

                {/* ✅ INSERTED ONLY — ERROR MESSAGE UI */}
                {errorMessage && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            marginBottom: "18px",
                            fontSize: "14px",
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        {errorMessage}
                    </div>
                )}

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
                    Email
                </label>
                <input
                    required
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
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
                    Password
                </label>
                <input
                    required
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
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
                    Confirm Password
                </label>
                <input
                    required
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
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
                />

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