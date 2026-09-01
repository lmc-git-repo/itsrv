import { Head, router, useForm } from "@inertiajs/react";
import TicketSuggestions from "@/Constants/TicketSuggestions";
import { useEffect, useState } from "react";
import {
    useEmployeeLanguage,
    translateUI,
    translateCategory,
    translateStatus,
    TranslatedEmployeeText,
    useTranslatedEmployeeText,
} from "@/Utils/EmployeeLanguage";

export default function EmployeeTicketsIndex({
    tickets = [],
    tracking_code = "",
    submitted_ticket_no = "",
    activeEmployees = [],
    itStaffStatuses = [],
}) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editTicket, setEditTicket] = useState(null);
    const [monitorTrackingCode, setMonitorTrackingCode] =
        useState("");
    const [showProblemSuggestions, setShowProblemSuggestions] =
        useState(false);
    const [
        showEditProblemSuggestions,
        setShowEditProblemSuggestions,
    ] = useState(false);
    const [
        visibleSubmittedTicketNo,
        setVisibleSubmittedTicketNo,
    ] = useState(submitted_ticket_no || "");

    const {
        language,
        setLanguage,
    } = useEmployeeLanguage();

    const t = (key) =>
        translateUI(language, key);

    const [monitorEmployeeName, setMonitorEmployeeName] =
        useState(() => {
            if (typeof window === "undefined") {
                return "";
            }

            return (
                localStorage.getItem(
                    "employee_monitor_name"
                ) || ""
            );
        });

    const [viewingDepartment, setViewingDepartment] =
        useState(() => {
            if (typeof window === "undefined") {
                return "";
            }

            return (
                localStorage.getItem(
                    "employee_monitor_department"
                ) || ""
            );
        });

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

    const splitProblemDescription = (description) => {
        if (!description) {
            return {
                problemDescription: "",
                remarks:
                    t("noRemarksProvided"),
            };
        }

        const marker = "\n\nRemarks:";
        const markerIndex =
            description.indexOf(marker);

        if (markerIndex === -1) {
            return {
                problemDescription: description,
                remarks:
                    t("noRemarksProvided"),
            };
        }

        return {
            problemDescription: description
                .substring(0, markerIndex)
                .trim(),
            remarks:
                description
                    .substring(
                        markerIndex +
                            marker.length
                    )
                    .trim() ||
                t("noRemarksProvided"),
        };
    };

    const selectedTicketDetails =
        splitProblemDescription(
            selectedTicket?.problem_description
        );

    const translatedSelectedProblem =
        useTranslatedEmployeeText(
            selectedTicketDetails.problemDescription,
            language
        );

    const translatedSelectedRemarks =
        useTranslatedEmployeeText(
            selectedTicketDetails.remarks,
            language
        );

    const translatedSelectedProgress =
        useTranslatedEmployeeText(
            selectedTicket?.progress_update || "",
            language
        );

    const translatedSelectedSolution =
        useTranslatedEmployeeText(
            selectedTicket?.problem_solution || "",
            language
        );

    const {
        data,
        setData,
        post,
        processing,
        reset,
        transform,
    } = useForm({
        employee_name: "",
        department: "",
        category: "",
        problem_description: "",
        remarks: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
    } = useForm({
        employee_name: "",
        department: "",
        category: "",
        problem_description: "",
        tracking_code: tracking_code || "",
    });

    const departments = [
        "Accounting", "Admin", "Assembly", "CMM", "COOP", "Deburring",
        "Die Casting", "Die Casting Engineering", "Die Mold", "Facilities",
        "Finance", "GA", "Guard House", "HR", "IMS", "IT",
        "Learning and Development", "Machine Engineering", "Machining", "MRO",
        "New Project", "PPC", "Purchasing", "QC", "Safety", "Sales",
    ];

    const categories = Object.keys(
        TicketSuggestions.employee
    );

    const employeeSuggestions =
        language === "ja"
            ? TicketSuggestions.employeeJapanese
            : TicketSuggestions.employee;

    useEffect(() => {
        if (!monitorEmployeeName) return;

        const currentEmployee = activeEmployees.find(
            (employee) =>
                employee.name ===
                monitorEmployeeName
        );

        if (!currentEmployee) return;

        const currentDepartment =
            currentEmployee.department || "";

        if (
            currentDepartment !==
            viewingDepartment
        ) {
            setViewingDepartment(
                currentDepartment
            );

            localStorage.setItem(
                "employee_monitor_department",
                currentDepartment
            );

            setMonitorTrackingCode("");

            localStorage.removeItem(
                "employee_tracking_code"
            );
        }
    }, [
        activeEmployees,
        monitorEmployeeName,
        viewingDepartment,
    ]);

    useEffect(() => {
        setMonitorTrackingCode(
            tracking_code || ""
        );
    }, [tracking_code]);

    useEffect(() => {
        setVisibleSubmittedTicketNo(
            submitted_ticket_no || ""
        );

        if (!submitted_ticket_no) return;

        const timeout = setTimeout(() => {
            setVisibleSubmittedTicketNo("");
        }, 5000);

        return () =>
            clearTimeout(timeout);
    }, [submitted_ticket_no]);

    useEffect(() => {
        if (editTicket) {
            setEditData({
                employee_name:
                    editTicket.employee_name || "",
                department:
                    editTicket.department || "",
                category:
                    editTicket.employee_category ||
                    editTicket.category ||
                    "",
                problem_description:
                    editTicket.problem_description ||
                    "",
                tracking_code:
                    tracking_code ||
                    editTicket.tracking_code ||
                    monitorTrackingCode ||
                    "",
            });

            setShowEditProblemSuggestions(
                false
            );
        }
    }, [editTicket]);

    useEffect(() => {
        if (!data.employee_name) return;

        const currentEmployee =
            activeEmployees.find(
                (employee) =>
                    employee.name ===
                    data.employee_name
            );

        if (!currentEmployee) {
            setData({
                ...data,
                employee_name: "",
                department: "",
            });

            setMonitorTrackingCode("");

            return;
        }

        if (
            data.department !==
            currentEmployee.department
        ) {
            setData(
                "department",
                currentEmployee.department || ""
            );

            setMonitorTrackingCode("");
        }
    }, [
        activeEmployees,
        data.employee_name,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: [
                    "tickets",
                    "activeEmployees",
                    "itStaffStatuses",
                ],
                preserveScroll: true,
                preserveState: true,
            });
        }, 5000);

        return () =>
            clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!editTicket) return;

        const updatedTicket =
            tickets.find(
                (ticket) =>
                    ticket.id ===
                    editTicket.id
            );

        if (
            !updatedTicket ||
            updatedTicket.status !== "Open"
        ) {
            setShowEditProblemSuggestions(
                false
            );
            setEditTicket(null);
            return;
        }

        setEditTicket(updatedTicket);
    }, [tickets]);

    useEffect(() => {
        if (!selectedTicket) return;

        const updatedTicket =
            tickets.find(
                (ticket) =>
                    ticket.id ===
                    selectedTicket.id
            );

        if (updatedTicket) {
            setSelectedTicket(
                updatedTicket
            );
        }
    }, [tickets]);

    const submit = (e) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            problem_description:
                formData.remarks.trim()
                    ? `${formData.problem_description}\n\nRemarks: ${formData.remarks}`
                    : formData.problem_description,
        }));

        const submittedEmployeeName =
            data.employee_name;

        const submittedDepartment =
            data.department;

        post(
            route(
                "employee.tickets.store"
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    localStorage.setItem(
                        "employee_monitor_name",
                        submittedEmployeeName
                    );

                    localStorage.setItem(
                        "employee_monitor_department",
                        submittedDepartment
                    );

                    setMonitorEmployeeName(
                        submittedEmployeeName
                    );

                    setViewingDepartment(
                        submittedDepartment
                    );

                    reset();

                    setShowProblemSuggestions(
                        false
                    );

                    setMonitorTrackingCode(
                        ""
                    );

                    localStorage.removeItem(
                        "employee_tracking_code"
                    );
                },
            }
        );
    };

    const checkTicketStatus = (e) => {
        e.preventDefault();

        if (!viewingDepartment) return;

        if (
            !monitorTrackingCode.trim()
        ) {
            localStorage.removeItem(
                "employee_tracking_code"
            );

            return;
        }

        localStorage.setItem(
            "employee_tracking_code",
            monitorTrackingCode.trim()
        );
    };

    const updateTicket = (e) => {
        e.preventDefault();

        if (
            !editTicket ||
            editTicket.status !== "Open"
        ) {
            return;
        }

        put(
            route(
                "employee.tickets.update",
                editTicket.id
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowEditProblemSuggestions(
                        false
                    );

                    setEditTicket(null);
                },
            }
        );
    };

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

    const departmentTickets =
        viewingDepartment
            ? tickets.filter(
                  (ticket) =>
                      ticket.department ===
                      viewingDepartment
              )
            : [];

    const searchKeyword =
        monitorTrackingCode
            .trim()
            .toLowerCase();

    const visibleTickets =
        searchKeyword
            ? departmentTickets.filter(
                  (ticket) =>
                      ticket.ticket_no
                          ?.toLowerCase()
                          .includes(
                              searchKeyword
                          ) ||
                      ticket.employee_name
                          ?.toLowerCase()
                          .includes(
                              searchKeyword
                          )
              )
            : departmentTickets;

        return (
        <>
            <Head title="Employee Ticket Form" />

            <div className="employee-ticket-page">
                <div className="employee-ticket-container">
                    <section className="employee-ticket-form-card">
                        <div className="mb-5 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                            <h2 className="mb-3 text-center text-sm font-bold text-white">
                                {t(
                                    "availableITStaff"
                                )}
                            </h2>

                            <div className="grid grid-cols-3 gap-3">
                                {itStaffStatuses.map(
                                    (staff) => (
                                        <div
                                            key={
                                                staff.name
                                            }
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <span
                                                className={`h-3.5 w-3.5 flex-shrink-0 rounded-full ${
                                                    staff.on_duty
                                                        ? "bg-green-500"
                                                        : "bg-gray-400"
                                                }`}
                                            />

                                            <span className="whitespace-nowrap text-sm font-semibold text-white">
                                                {
                                                    staff.name
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-5 text-xs text-white/70">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                                    {t(
                                        "onDuty"
                                    )}
                                </span>

                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />

                                    {t(
                                        "offDuty"
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="employee-ticket-header">
                            <img
                                src="/images/LMC-Logo-Wht.png"
                                alt="LMC Logo"
                                className="employee-ticket-logo"
                            />

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h1>
                                            {t(
                                                "employeeTicketForm"
                                            )}
                                        </h1>

                                        <p>
                                            {t(
                                                "employeeTicketSubtitle"
                                            )}
                                        </p>
                                    </div>

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: "12px",
                                            fontSize:
                                                "13px",
                                            fontWeight:
                                                "700",
                                            color:
                                                "#ffffff",
                                            whiteSpace:
                                                "nowrap",
                                            paddingTop:
                                                "18px",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLanguage(
                                                    "ja"
                                                )
                                            }
                                            style={{
                                                opacity:
                                                    language ===
                                                    "ja"
                                                        ? 1
                                                        : 0.55,
                                                textDecoration:
                                                    language ===
                                                    "ja"
                                                        ? "underline"
                                                        : "none",
                                            }}
                                        >
                                            JAPANESE
                                        </button>

                                        <span
                                            style={{
                                                opacity:
                                                    0.6,
                                            }}
                                        >
                                            |
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLanguage(
                                                    "en"
                                                )
                                            }
                                            style={{
                                                opacity:
                                                    language ===
                                                    "en"
                                                        ? 1
                                                        : 0.55,
                                                textDecoration:
                                                    language ===
                                                    "en"
                                                        ? "underline"
                                                        : "none",
                                            }}
                                        >
                                            ENGLISH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {visibleSubmittedTicketNo && (
                            <div className="employee-ticket-alert">
                                {t(
                                    "submittedSuccessfully"
                                )}{" "}
                                <strong>
                                    {
                                        visibleSubmittedTicketNo
                                    }
                                </strong>
                            </div>
                        )}

                        <form
                            onSubmit={submit}
                            className="employee-ticket-form"
                        >
                            <div>
                                <label>
                                    {t(
                                        "employeeName"
                                    )}
                                </label>

                                <select
                                    value={
                                        data.employee_name
                                    }
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        const selectedEmployee =
                                            activeEmployees.find(
                                                (
                                                    employee
                                                ) =>
                                                    employee.name ===
                                                    e
                                                        .target
                                                        .value
                                            );

                                        setData({
                                            ...data,
                                            employee_name:
                                                e
                                                    .target
                                                    .value,
                                            department:
                                                selectedEmployee?.department ||
                                                "",
                                        });

                                        if (
                                            selectedEmployee
                                        ) {
                                            setMonitorEmployeeName(
                                                selectedEmployee.name
                                            );

                                            setViewingDepartment(
                                                selectedEmployee.department ||
                                                    ""
                                            );
                                        }

                                        setMonitorTrackingCode(
                                            ""
                                        );
                                    }}
                                    required
                                >
                                    <option value="">
                                        {t(
                                            "selectEmployeeName"
                                        )}
                                    </option>

                                    {activeEmployees.map(
                                        (
                                            employee
                                        ) => (
                                            <option
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.name
                                                }
                                            >
                                                {
                                                    employee.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {activeEmployees.length ===
                                    0 && (
                                    <div className="employee-ticket-validation-message">
                                        {t(
                                            "noActiveEmployees"
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label>
                                    {t(
                                        "department"
                                    )}
                                </label>

                                <select
                                    value={
                                        data.department
                                    }
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setData(
                                            "department",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                    disabled
                                >
                                    <option value="">
                                        {t(
                                            "selectDepartment"
                                        )}
                                    </option>

                                    {departments.map(
                                        (
                                            department
                                        ) => (
                                            <option
                                                key={
                                                    department
                                                }
                                                value={
                                                    department
                                                }
                                            >
                                                {
                                                    department
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label>
                                    {t(
                                        "category"
                                    )}
                                </label>

                                <select
                                    value={
                                        data.category
                                    }
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        setData(
                                            "category",
                                            e
                                                .target
                                                .value
                                        );

                                        setShowProblemSuggestions(
                                            false
                                        );
                                    }}
                                    required
                                >
                                    <option value="">
                                        {t(
                                            "selectCategory"
                                        )}
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >
                                                {translateCategory(
                                                    category,
                                                    language
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label>
                                    {t(
                                        "problemDescription"
                                    )}
                                </label>

                                {showProblemSuggestions &&
                                    data.category &&
                                    employeeSuggestions[
                                        data
                                            .category
                                    ]?.length >
                                        0 && (
                                        <div className="mt-2 mb-3 space-y-2">
                                            {employeeSuggestions[
                                                data
                                                    .category
                                            ].map(
                                                (
                                                    suggestion,
                                                    index
                                                ) => (
                                                    <button
                                                        key={`${data.category}-${index}`}
                                                        type="button"
                                                        className="block w-full text-left rounded border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-100 !text-black"
                                                        onMouseDown={(
                                                            e
                                                        ) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() => {
                                                            setData(
                                                                "problem_description",
                                                                suggestion
                                                            );

                                                            setShowProblemSuggestions(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            suggestion
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}

                                <textarea
                                    rows="6"
                                    value={
                                        data.problem_description
                                    }
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            true
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        setData(
                                            "problem_description",
                                            e
                                                .target
                                                .value
                                        );

                                        setShowProblemSuggestions(
                                            false
                                        );
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label>
                                    {t(
                                        "remarks"
                                    )}
                                </label>

                                <textarea
                                    rows="3"
                                    value={
                                        data.remarks
                                    }
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setData(
                                            "remarks",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder={t(
                                        "remarksPlaceholder"
                                    )}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.employee_name
                                }
                            >
                                {t(
                                    "submitTicket"
                                )}
                            </button>
                        </form>
                    </section>

                    <section className="employee-ticket-monitor-card">
                        <div className="employee-ticket-monitor-header">
                            <h2>
                                {t(
                                    "ticketMonitoringTable"
                                )}
                            </h2>

                            <p>
                                {t(
                                    "ticketMonitoringDescription"
                                )}
                            </p>

                            <p className="mt-2 font-semibold">
                                {t(
                                    "viewingDepartment"
                                )}
                                :{" "}
                                {viewingDepartment ||
                                    t(
                                        "selectEmployeeFirst"
                                    )}
                            </p>
                        </div>

                        <form
                            onSubmit={
                                checkTicketStatus
                            }
                            className="employee-ticket-monitor-form"
                        >
                            <div>
                                <label>
                                    {t(
                                        "checkTicketStatus"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    value={
                                        monitorTrackingCode
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        const value =
                                            e.target.value.toUpperCase();

                                        setMonitorTrackingCode(
                                            value
                                        );
                                    }}
                                    placeholder={t(
                                        "ticketSearchPlaceholder"
                                    )}
                                    disabled={
                                        !viewingDepartment
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    !viewingDepartment
                                }
                            >
                                {t(
                                    "checkStatus"
                                )}
                            </button>
                        </form>

                        <div className="employee-ticket-list">
                            {visibleTickets.length ===
                                0 && (
                                <div className="employee-ticket-empty">
                                    {viewingDepartment
                                        ? t(
                                              "noTicketsDepartment"
                                          )
                                        : t(
                                              "selectEmployeeToView"
                                          )}
                                </div>
                            )}

                            {visibleTickets.map(
                                (
                                    ticket
                                ) => (
                                    <div
                                        key={
                                            ticket.id
                                        }
                                        className="employee-ticket-item"
                                    >
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
                                            <TranslatedEmployeeText
                                                text={
                                                    splitProblemDescription(
                                                        ticket.problem_description
                                                    )
                                                        .problemDescription
                                                }
                                                language={
                                                    language
                                                }
                                            />
                                        </p>

                                        <small>
                                            {t(
                                                "employeeName"
                                            )}
                                            :{" "}
                                            {ticket.employee_name ||
                                                "—"}{" "}
                                            |{" "}
                                            {t(
                                                "department"
                                            )}
                                            :{" "}
                                            {ticket.department ||
                                                "—"}
                                        </small>

                                        <div className="employee-ticket-actions">
                                            <button
                                                type="button"
                                                className="employee-ticket-view-btn"
                                                onClick={() =>
                                                    setSelectedTicket(
                                                        ticket
                                                    )
                                                }
                                            >
                                                {t(
                                                    "viewDetails"
                                                )}
                                            </button>

                                            {ticket.status ===
                                                "Open" && (
                                                <button
                                                    type="button"
                                                    className="employee-ticket-edit-btn"
                                                    onClick={() =>
                                                        setEditTicket(
                                                            ticket
                                                        )
                                                    }
                                                >
                                                    ✏️{" "}
                                                    {t(
                                                        "edit"
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {ticket.status ===
                                            "Ongoing" &&
                                            ticket
                                                .assignee
                                                ?.name && (
                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "flex-end",
                                                        alignItems:
                                                            "flex-end",
                                                        marginTop:
                                                            "12px",
                                                        paddingTop:
                                                            "4px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "15px",
                                                            fontWeight:
                                                                "700",
                                                            color:
                                                                "#374151",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {t(
                                                            "assignedIT"
                                                        )}
                                                        :{" "}
                                                        {
                                                            ticket
                                                                .assignee
                                                                .name
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>

                <footer
                    className="employee-ticket-footer"
                    style={{
                        width: "100%",
                        maxWidth: "1600px",
                        minHeight: "58px",
                        margin:
                            "55px auto 60px",
                        padding: "0 24px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        textAlign:
                            "center",
                    }}
                >
                    {t("footer")}
                </footer>
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() =>
                            setSelectedTicket(
                                null
                            )
                        }
                    />

                    <div className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10 text-[#101E33] max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            onClick={() =>
                                setSelectedTicket(
                                    null
                                )
                            }
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                            {t(
                                "ticketDetails"
                            )}
                        </h2>

                        <div className="space-y-3 text-base text-[#101E33]">
                            <p>
                                <strong>
                                    {t(
                                        "ticketNo"
                                    )}
                                    :
                                </strong>{" "}
                                {
                                    selectedTicket.ticket_no
                                }
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "employeeName"
                                    )}
                                    :
                                </strong>{" "}
                                {
                                    selectedTicket.employee_name
                                }
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "department"
                                    )}
                                    :
                                </strong>{" "}
                                {
                                    selectedTicket.department
                                }
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "category"
                                    )}
                                    :
                                </strong>{" "}
                                {translateCategory(
                                    selectedTicket.employee_category ||
                                        selectedTicket.category,
                                    language
                                )}
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "status"
                                    )}
                                    :
                                </strong>{" "}
                                {translateStatus(
                                    selectedTicket.status,
                                    language
                                )}
                            </p>

                            {selectedTicket.status ===
                                "Ongoing" &&
                                selectedTicket
                                    .assignee
                                    ?.name && (
                                    <p>
                                        <strong>
                                            {t(
                                                "assignedIT"
                                            )}
                                            :
                                        </strong>{" "}
                                        {
                                            selectedTicket
                                                .assignee
                                                .name
                                        }
                                    </p>
                                )}

                            <p>
                                <strong>
                                    {t(
                                        "dateOpened"
                                    )}
                                    :
                                </strong>{" "}
                                {formatDateTime(
                                    selectedTicket.date_opened
                                )}
                            </p>

                            <p>
                                <strong>
                                    {t(
                                        "resolvedAt"
                                    )}
                                    :
                                </strong>{" "}
                                {selectedTicket.resolved_at
                                    ? formatDateTime(
                                          selectedTicket.resolved_at
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

                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={
                                        translatedSelectedProblem
                                    }
                                />
                            </div>

                            <div>
                                <strong>
                                    {t(
                                        "remarks"
                                    )}
                                    :
                                </strong>

                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={
                                        translatedSelectedRemarks
                                    }
                                />
                            </div>

                            <div>
                                <strong>
                                    {t(
                                        "progressUpdate"
                                    )}
                                    :
                                </strong>

                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={
                                        selectedTicket.progress_update
                                            ? translatedSelectedProgress
                                            : t(
                                                  "noProgressUpdate"
                                              )
                                    }
                                />
                            </div>

                            <div>
                                <strong>
                                    {t(
                                        "problemSolution"
                                    )}
                                    :
                                </strong>

                                <textarea
                                    readOnly
                                    className="w-full mt-1 rounded border px-3 py-2 bg-gray-50 text-base text-[#101E33]"
                                    value={
                                        selectedTicket.problem_solution
                                            ? translatedSelectedSolution
                                            : t(
                                                  "noSolutionProvided"
                                              )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() =>
                            setEditTicket(
                                null
                            )
                        }
                    />

                    <div className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10 text-[#101E33] max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            onClick={() =>
                                setEditTicket(
                                    null
                                )
                            }
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                            {t(
                                "editTicket"
                            )}
                        </h2>

                        <form
                            onSubmit={
                                updateTicket
                            }
                            className="space-y-4 text-sm text-[#101E33]"
                        >
                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t(
                                        "employeeName"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={
                                        editData.employee_name
                                    }
                                    onFocus={() =>
                                        setShowEditProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setEditData(
                                            "employee_name",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t(
                                        "department"
                                    )}
                                </label>

                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={
                                        editData.department
                                    }
                                    onFocus={() =>
                                        setShowEditProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setEditData(
                                            "department",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        {t(
                                            "selectDepartment"
                                        )}
                                    </option>

                                    {departments.map(
                                        (
                                            department
                                        ) => (
                                            <option
                                                key={
                                                    department
                                                }
                                                value={
                                                    department
                                                }
                                            >
                                                {
                                                    department
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t(
                                        "category"
                                    )}
                                </label>

                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={
                                        editData.category
                                    }
                                    onFocus={() =>
                                        setShowEditProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        setEditData(
                                            "category",
                                            e
                                                .target
                                                .value
                                        );

                                        setShowEditProblemSuggestions(
                                            false
                                        );
                                    }}
                                    required
                                >
                                    <option value="">
                                        {t(
                                            "selectCategory"
                                        )}
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >
                                                {translateCategory(
                                                    category,
                                                    language
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t(
                                        "problemDescription"
                                    )}
                                </label>

                                {showEditProblemSuggestions &&
                                    editData.category &&
                                    employeeSuggestions[
                                        editData
                                            .category
                                    ]?.length >
                                        0 && (
                                        <div className="mt-2 mb-3 space-y-2">
                                            {employeeSuggestions[
                                                editData
                                                    .category
                                            ].map(
                                                (
                                                    suggestion,
                                                    index
                                                ) => (
                                                    <button
                                                        key={`${editData.category}-${index}`}
                                                        type="button"
                                                        className="block w-full text-left rounded border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-100 !text-black"
                                                        onMouseDown={(
                                                            e
                                                        ) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() => {
                                                            setEditData(
                                                                "problem_description",
                                                                suggestion
                                                            );

                                                            setShowEditProblemSuggestions(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            suggestion
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}

                                <textarea
                                    rows="5"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={
                                        editData.problem_description
                                    }
                                    onFocus={() =>
                                        setShowEditProblemSuggestions(
                                            true
                                        )
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        setEditData(
                                            "problem_description",
                                            e
                                                .target
                                                .value
                                        );

                                        setShowEditProblemSuggestions(
                                            false
                                        );
                                    }}
                                    required
                                />
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditTicket(
                                            null
                                        )
                                    }
                                    className="px-6 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold"
                                >
                                    {t(
                                        "cancel"
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        editProcessing
                                    }
                                    className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t(
                                        "saveChanges"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}