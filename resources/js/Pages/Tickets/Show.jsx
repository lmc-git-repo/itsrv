import { useEffect } from "react";

export default function Show({ show, ticket, onClose }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    if (!show || !ticket) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                
                <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                    Ticket Details
                </h2>

                
                <div className="space-y-3 text-base text-[#101E33]">
                    <p><strong>Ticket No:</strong> {ticket.ticket_no}</p>
                    <p><strong>Employee Name:</strong> {ticket.employee_name}</p>
                    <p><strong>Department:</strong> {ticket.department}</p>
                    <p><strong>Category:</strong> {ticket.category}</p>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Created By:</strong> {ticket.creator?.name}</p>
                    <p><strong>Resolved By:</strong> {ticket.resolver?.name || "—"}</p>

                    <div>
                        <strong>Problem Description:</strong>
                        <textarea
                            readOnly
                            className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base"
                            value={ticket.problem_description}
                        />
                    </div>

                    <div>
                        <strong>Problem Solution:</strong>
                        <textarea
                            readOnly
                            className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base"
                            value={ticket.problem_solution || "No solution provided yet."}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}