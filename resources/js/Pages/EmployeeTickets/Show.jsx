import { Head, Link } from "@inertiajs/react";

export default function EmployeeTicketShow({
    ticket,
    tracking_code = "",
}) {
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
        ticket.problem_description
    );

    const statusClass = (status) => {
        switch (status) {
            case "Open":
                return "employee-status-open";

            case "Ongoing":
                return "employee-status-ongoing";

            case "Resolved":
                return "employee-status-resolved";

            default:
                return "employee-status-open";
        }
    };

    return (
        <>
            <Head title="Employee Ticket Details" />

            <div className="employee-ticket-page">
                <div className="employee-ticket-container">
                    <section className="employee-ticket-monitor-card">
                        <div className="employee-ticket-monitor-header">
                            <h2>Ticket Details</h2>
                            <p>
                                Full details of your submitted IT
                                concern.
                            </p>
                        </div>

                        <div className="employee-ticket-item">
                            <div className="employee-ticket-item-top">
                                <strong>
                                    {ticket.ticket_no}
                                </strong>

                                <span
                                    className={statusClass(
                                        ticket.status
                                    )}
                                >
                                    {ticket.status}
                                </span>
                            </div>

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
                                {ticket.employee_category ||
                                    ticket.category}
                            </p>

                            <p>
                                <strong>Date Opened:</strong>{" "}
                                {formatDateTime(
                                    ticket.date_opened
                                )}
                            </p>

                            <p>
                                <strong>Resolved At:</strong>{" "}
                                {ticket.resolved_at
                                    ? formatDateTime(
                                          ticket.resolved_at
                                      )
                                    : "—"}
                            </p>

                            <div>
                                <strong>
                                    Problem Description:
                                </strong>

                                <p>
                                    {
                                        ticketDetails.problemDescription
                                    }
                                </p>
                            </div>

                            {ticketDetails.hasRemarks && (
                                <div>
                                    <strong>Remarks:</strong>
                                    <p>
                                        {ticketDetails.remarks}
                                    </p>
                                </div>
                            )}

                            <div>
                                <strong>Progress Update:</strong>

                                <p
                                    style={{
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {ticket.progress_update ||
                                        "No progress update yet."}
                                </p>
                            </div>

                            <div>
                                <strong>Problem Solution:</strong>

                                <p
                                    style={{
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {ticket.problem_solution ||
                                        "No solution provided yet."}
                                </p>
                            </div>

                            <Link
                                href={route(
                                    "employee.tickets",
                                    {
                                        tracking_code,
                                    }
                                )}
                                className="inline-block mt-4 text-sm font-semibold text-blue-600"
                            >
                                Back to Ticket Monitoring
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}