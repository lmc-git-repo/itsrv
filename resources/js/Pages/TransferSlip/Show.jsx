import { useEffect } from "react";

export default function Show({ record, onClose }) {

    /* ✅ INSERTED ONLY — ESC KEY HANDLER */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div className="ts-show-backdrop">
            <div className="ts-show-overlay" onClick={onClose} />

            <div className="ts-show-card">
                {/* CLOSE (TOP X ONLY) */}
                <button
                    type="button"
                    className="ts-show-close"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2
                    className="ts-show-title"
                    style={{ fontSize: "20px" }}
                >
                    TRANSFER SLIP DETAILS
                </h2>

                <br />

                <div
                    className="ts-show-body"
                    style={{ fontSize: "16px", lineHeight: "1.7" }}
                >
                    <p><strong>Transfer Slip No:</strong> {record.transfer_slip_no}</p>
                    <p><strong>To:</strong> {record.to}</p>
                    <p><strong>From:</strong> {record.from}</p>
                    <p><strong>Date:</strong> {record.date}</p>
                    <p><strong>Equipment:</strong> {record.equipment}</p>
                    <p><strong>Quantity:</strong> {record.quantity}</p>
                    <p><strong>Description:</strong> {record.description}</p>
                    <p><strong>Origin:</strong> {record.origin}</p>
                    <p><strong>Destination:</strong> {record.destination}</p>
                    <p><strong>Remarks:</strong> {record.remarks}</p>
                    <p>
                        <strong>Created By:</strong>{" "}
                        {record.created_by_name ?? "Unknown User"}
                    </p>
                </div>
            </div>
        </div>
    );
}