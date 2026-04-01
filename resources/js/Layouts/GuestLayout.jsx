import React from "react";

export default function GuestLayout({ children }) {
    return (
        <div className="its-login-bg min-vh-100 d-flex align-items-center justify-content-center">
            <div className="its-login-split">
                <div className="its-login-image-panel">
                    <img
                        src="/images/bg.JPG"
                        alt="Login Background"
                        className="its-login-side-image"
                    />
                </div>

                <div className="its-login-form-panel">
                    {children}
                </div>
            </div>
        </div>
    );
}