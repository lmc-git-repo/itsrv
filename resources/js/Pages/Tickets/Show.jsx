import { useEffect } from "react";

export default function Show({ show, ticket, onClose }) {
    const formatDateTime = (date) => {
        if (!date) return "—";

        const normalizedDate = String(date)
            .replace(" ", "T")
            .replace(/\.\d+Z?$/, "")
            .replace(/Z$/, "");

        const parsedDate = new Date(normalizedDate);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const splitProblemDescription = (description) => {
        if (!description) {
            return {
                problemDescription: "",
                remarks: "",
                hasRemarks: false,
            };
        }

        const marker = "\n\nRemarks:";
        const markerIndex = description.indexOf(marker);

        if (markerIndex === -1) {
            return {
                problemDescription: description,
                remarks: "",
                hasRemarks: false,
            };
        }

        const remarks = description
            .substring(markerIndex + marker.length)
            .trim();

        return {
            problemDescription: description
                .substring(0, markerIndex)
                .trim(),
            remarks,
            hasRemarks: remarks !== "",
        };
    };

    const ticketDetails = splitProblemDescription(
        ticket?.problem_description
    );

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
                    <p>
                        <strong>Ticket No:</strong>{" "}
                        {ticket.ticket_no || "—"}
                    </p>

                    <p>
                        <strong>Employee Name:</strong>{" "}
                        {ticket.employee_name}
                    </p>

                    <p>
                        <strong>Department:</strong>{" "}
                        {ticket.department}
                    </p>

                    <p>
                        <strong>Category:</strong>{" "}
                        {ticket.category}
                    </p>

                    <p>
                        <strong>Status:</strong> {ticket.status}
                    </p>

                    <p>
                        <strong>Date Opened:</strong>{" "}
                        {formatDateTime(ticket.date_opened)}
                    </p>

                    <p>
                        <strong>Resolved At:</strong>{" "}
                        {ticket.resolved_at
                            ? formatDateTime(ticket.resolved_at)
                            : "—"}
                    </p>

                    <p>
                        <strong>Created By:</strong>{" "}
                        {ticket.creator?.name || "Employee"}
                    </p>

                    <p>
                        <strong>Resolved By:</strong>{" "}
                        {ticket.resolver?.name || "—"}
                    </p>

                    <div>
                        <strong>Problem Description:</strong>
                        <textarea
                            readOnly
                            className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base"
                            value={ticketDetails.problemDescription}
                        />
                    </div>

                    {ticketDetails.hasRemarks && (
                        <div>
                            <strong>Remarks:</strong>
                            <textarea
                                readOnly
                                className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base"
                                value={ticketDetails.remarks}
                            />
                        </div>
                    )}

                    <div>
                        <strong>Progress Update:</strong>
                        <textarea
                            readOnly
                            className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base"
                            value={
                                ticket.progress_update ||
                                "No progress update yet."
                            }
                            style={{ whiteSpace: "pre-wrap" }}
                        />
                    </div>

                    <div>
                        <strong>Problem Solution:</strong>
                        <textarea
                            readOnly
                            className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base"
                            value={
                                ticket.problem_solution ||
                                "No solution provided yet."
                            }
                            style={{ whiteSpace: "pre-wrap" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}