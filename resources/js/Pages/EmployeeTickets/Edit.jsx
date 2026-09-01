import { Head, useForm } from "@inertiajs/react";
import TicketSuggestions from "@/Constants/TicketSuggestions";
import { useState } from "react";
import {
    useEmployeeLanguage,
    translateUI,
    translateCategory,
} from "@/Utils/EmployeeLanguage";

export default function EmployeeTicketEdit({
    ticket,
    tracking_code = "",
}) {
    const [showProblemSuggestions, setShowProblemSuggestions] =
        useState(false);

    const {
        language,
        setLanguage,
    } = useEmployeeLanguage();

    const t = (key) =>
        translateUI(language, key);

    const { data, setData, put, processing } = useForm({
        employee_name: ticket.employee_name || "",
        department: ticket.department || "",
        category:
            ticket.employee_category ||
            ticket.category ||
            "",
        problem_description:
            ticket.problem_description || "",
        tracking_code:
            tracking_code ||
            ticket.tracking_code ||
            "",
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

    const suggestions =
        language === "ja"
            ? TicketSuggestions.employeeJapanese
            : TicketSuggestions.employee;

    const submit = (e) => {
        e.preventDefault();

        put(route("employee.tickets.update", ticket.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Employee Ticket" />

            <div className="employee-ticket-page">
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" />

                    <section className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10 text-[#101E33] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-end mb-4">
                            <div className="flex items-center gap-3 text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLanguage("ja")
                                    }
                                    className={
                                        language === "ja"
                                            ? "text-[#101E33] underline"
                                            : "text-gray-400"
                                    }
                                >
                                    JAPANESE
                                </button>

                                <span className="text-gray-400">
                                    |
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLanguage("en")
                                    }
                                    className={
                                        language === "en"
                                            ? "text-[#101E33] underline"
                                            : "text-gray-400"
                                    }
                                >
                                    ENGLISH
                                </button>
                            </div>
                        </div>

                        <h1 className="text-xl font-bold text-center mb-6 text-[#101E33]">
                            {t("editTicket")}
                        </h1>

                        <form
                            onSubmit={submit}
                            className="space-y-4 text-sm text-[#101E33]"
                        >
                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t("employeeName")}
                                </label>

                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.employee_name}
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "employee_name",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t("department")}
                                </label>

                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.department}
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "department",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        {t("selectDepartment")}
                                    </option>

                                    {departments.map(
                                        (department) => (
                                            <option
                                                key={department}
                                                value={department}
                                            >
                                                {department}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-[#101E33]">
                                    {t("category")}
                                </label>

                                <select
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={data.category}
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            false
                                        )
                                    }
                                    onChange={(e) => {
                                        setData(
                                            "category",
                                            e.target.value
                                        );

                                        setShowProblemSuggestions(
                                            false
                                        );
                                    }}
                                    required
                                >
                                    <option value="">
                                        {t("selectCategory")}
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={category}
                                                value={category}
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
                                    {t("problemDescription")}
                                </label>

                                <textarea
                                    rows="6"
                                    className="w-full rounded border px-3 py-2 text-[#101E33] bg-white"
                                    value={
                                        data.problem_description
                                    }
                                    onFocus={() =>
                                        setShowProblemSuggestions(
                                            true
                                        )
                                    }
                                    onChange={(e) => {
                                        setData(
                                            "problem_description",
                                            e.target.value
                                        );

                                        setShowProblemSuggestions(
                                            false
                                        );
                                    }}
                                    required
                                />

                                {showProblemSuggestions &&
                                    data.category &&
                                    suggestions[
                                        data.category
                                    ]?.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {suggestions[
                                                data.category
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
                                                        {suggestion}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t("saveChanges")}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
}