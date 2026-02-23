import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="its-login-card">
                <div className="its-login-content">
                    {/* HEADER */}
                    <div className="its-login-header">
                        <img
                            src="/images/LMC-Logo-Wht.png"
                            alt="LMC Logo"
                            className="its-login-logo"
                        />
                        <div className="its-login-title">IT TICKETING SYSTEM</div>
                    </div>

                    {/* ✅ ERROR MESSAGE (WRONG USERNAME/PASSWORD OR REQUIRED FIELDS) */}
                    {(errors?.name || errors?.password) && (
                        <div
                            style={{
                                background: "rgba(239, 68, 68, 0.12)",
                                border: "1px solid rgba(239, 68, 68, 0.35)",
                                color: "#fecaca",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                marginBottom: "14px",
                                textAlign: "center",
                            }}
                        >
                            {errors?.name || errors?.password}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={submit}>
                        <label className="its-label">USERNAME</label>
                        <input
                            type="text"
                            className="form-control its-input"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            autoComplete="username"
                            required
                        />

                        <label className="its-label">PASSWORD</label>
                        <input
                            type="password"
                            className="form-control its-input"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            autoComplete="current-password"
                            required
                        />

                        <br />

                        <button
                            type="submit"
                            className="btn its-login-btn"
                            disabled={processing}
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}