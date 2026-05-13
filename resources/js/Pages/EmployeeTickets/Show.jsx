import { Head, Link } from "@inertiajs/react";

export default function EmployeeTicketShow({ ticket, tracking_code = "" }) {
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
                            <p>Full details of your submitted IT concern.</p>
                        </div>

                        <div className="employee-ticket-item">
                            <div className="employee-ticket-item-top">
                                <strong>{ticket.ticket_no}</strong>
                                <span className={statusClass(ticket.status)}>
                                    {ticket.status}
                                </span>
                            </div>

                            <p><strong>Employee Name:</strong> {ticket.employee_name}</p>
                            <p><strong>Department:</strong> {ticket.department}</p>
                            <p><strong>Category:</strong> {ticket.category}</p>
                            <p><strong>Date Opened:</strong> {ticket.date_opened}</p>
                            <p><strong>Resolved At:</strong> {ticket.resolved_at || "—"}</p>

                            <div>
                                <strong>Problem Description:</strong>
                                <p>{ticket.problem_description}</p>
                            </div>

                            <div>
                                <strong>Progress Update:</strong>
                                <p>{ticket.progress_update || "No progress update yet."}</p>
                            </div>

                            <div>
                                <strong>Problem Solution:</strong>
                                <p>{ticket.problem_solution || "No solution provided yet."}</p>
                            </div>

                            <Link
                                href={route("employee.tickets", { tracking_code })}
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