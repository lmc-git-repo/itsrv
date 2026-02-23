import React from "react";

export default function GuestLayout({ children }) {
    return (
        <div className="its-login-bg min-vh-100 d-flex align-items-center justify-content-center">
            {children}
        </div>
    );
}