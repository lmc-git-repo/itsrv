import { Head, Link } from "@inertiajs/react";
import {
    useEmployeeLanguage,
    translateUI,
    translateCategory,
    translateStatus,
    TranslatedEmployeeText,
} from "@/Utils/EmployeeLanguage";

export default function EmployeeTicketShow({
    ticket,
    tracking_code = "",
}) {
    const {
        language,
        setLanguage,
    } = useEmployeeLanguage();

    const t = (key) =>
        translateUI(language, key);

    const formatDateTime = (date) => {
        if (!date) return "—";

        const normalizedDate =
            String(date)
                .replace(" ", "T")
                .replace(/\.\d+Z?$/, "")
                .replace(/Z$/, "");

        const parsedDate =
            new Date(normalizedDate);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
        }

        return parsedDate.toLocaleString(
            language === "ja"
                ? "ja-JP"
                : "en-US",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12:
                    language !== "ja",
            }
        );
    };

    const splitProblemDescription = (
        description
    ) => {
        if (!description) {
            return {
                problemDescription: "",
                remarks: "",
                hasRemarks: false,
            };
        }

        const marker =
            "\n\nRemarks:";

        const markerIndex =
            description.indexOf(marker);

        if (markerIndex === -1) {
            return {
                problemDescription:
                    description,
                remarks: "",
                hasRemarks: false,
            };
        }

        const remarks =
            description
                .substring(
                    markerIndex +
                        marker.length
                )
                .trim();

        return {
            problemDescription:
                description
                    .substring(
                        0,
                        markerIndex
                    )
                    .trim(),
            remarks,
            hasRemarks:
                remarks !== "",
        };
    };

    const ticketDetails =
        splitProblemDescription(
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
                        <div className="flex justify-end mb-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-[#101E33]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLanguage("ja")
                                    }
                                    className={
                                        language === "ja"
                                            ? "underline"
                                            : "opacity-40"
                                    }
                                >
                                    JAPANESE
                                </button>

                                <span>|</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLanguage("en")
                                    }
                                    className={
                                        language === "en"
                                            ? "underline"
                                            : "opacity-40"
                                    }
                                >
                                    ENGLISH
                                </button>
                            </div>
                        </div>

                        <div className="employee-ticket-monitor-header">
                            <h2>
                                {t("ticketDetails")}
                            </h2>

                            <p>
                                {language === "ja"
                                    ? "送信したITお問い合わせの詳細です。"
                                    : "Full details of your submitted IT concern."}
                            </p>
                        </div>

                        <div className="employee-ticket-item">
                            <div className="employee-ticket-item-top">
                                <strong>
                                    {
                                        ticket.ticket_no
                                    }
                                </strong>

                                <span
                                    className={statusClass(
                                        ticket.status
                                    )}
                                >
                                    {translateStatus(
                                        ticket.status,
                                        language
                                    )}
                                </span>
                            </div>

                            <p>
                                <strong>
                                    {t("employeeName")}:
                                </strong>{" "}
                                {
                                    ticket.employee_name
                                }
                            </p>

                            <p>
                                <strong>
                                    {t("department")}:
                                </strong>{" "}
                                {
                                    ticket.department
                                }
                            </p>

                            <p>
                                <strong>
                                    {t("category")}:
                                </strong>{" "}
                                {translateCategory(
                                    ticket.employee_category ||
                                        ticket.category,
                                    language
                                )}
                            </p>

                            {ticket.status ===
                                "Ongoing" &&
                                ticket.assignee
                                    ?.name && (
                                    <p>
                                        <strong>
                                            {t(
                                                "assignedIT"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            ticket
                                                .assignee
                                                .name
                                        }
                                    </p>
                                )}

                            <p>
                                <strong>
                                    {t("dateOpened")}:
                                </strong>{" "}
                                {formatDateTime(
                                    ticket.date_opened
                                )}
                            </p>

                            <p>
                                <strong>
                                    {t("resolvedAt")}:
                                </strong>{" "}
                                {ticket.resolved_at
                                    ? formatDateTime(
                                          ticket.resolved_at
                                      )
                                    : "—"}
                            </p>

                            <div>
                                <strong>
                                    {t(
                                        "problemDescription"
                                    )}
                                    :
                                </strong>

                                <p>
                                    <TranslatedEmployeeText
                                        text={
                                            ticketDetails.problemDescription
                                        }
                                        language={
                                            language
                                        }
                                    />
                                </p>
                            </div>

                            {ticketDetails.hasRemarks && (
                                <div>
                                    <strong>
                                        {t("remarks")}:
                                    </strong>

                                    <p>
                                        <TranslatedEmployeeText
                                            text={
                                                ticketDetails.remarks
                                            }
                                            language={
                                                language
                                            }
                                        />
                                    </p>
                                </div>
                            )}

                            <div>
                                <strong>
                                    {t(
                                        "progressUpdate"
                                    )}
                                    :
                                </strong>

                                <p
                                    style={{
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {ticket.progress_update ? (
                                        <TranslatedEmployeeText
                                            text={
                                                ticket.progress_update
                                            }
                                            language={
                                                language
                                            }
                                        />
                                    ) : (
                                        t(
                                            "noProgressUpdate"
                                        )
                                    )}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    {t(
                                        "problemSolution"
                                    )}
                                    :
                                </strong>

                                <p
                                    style={{
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {ticket.problem_solution ? (
                                        <TranslatedEmployeeText
                                            text={
                                                ticket.problem_solution
                                            }
                                            language={
                                                language
                                            }
                                        />
                                    ) : (
                                        t(
                                            "noSolutionProvided"
                                        )
                                    )}
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
                                {language === "ja"
                                    ? "チケット確認へ戻る"
                                    : "Back to Ticket Monitoring"}
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}