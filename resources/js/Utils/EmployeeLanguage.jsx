import { useEffect, useState } from "react";

export const EMPLOYEE_LANGUAGE_KEY =
    "employee_ticket_language";

const googleTranslationCache = new Map();

const uiTranslations = {
    en: {
        availableITStaff: "Available IT Staff",
        onDuty: "On Duty",
        offDuty: "Off Duty",

        employeeTicketForm: "Employee Ticket Form",
        employeeTicketSubtitle:
            "Submit your concern directly to IT Department",

        employeeName: "Employee Name",
        selectEmployeeName: "Select Employee Name",

        department: "Department",
        selectDepartment: "Select Department",

        category: "Category",
        selectCategory: "Select Category",

        problemDescription: "Problem Description",
        remarks: "Remarks",
        remarksPlaceholder:
            "Add more details if needed...",

        submitTicket: "Submit Ticket",

        ticketMonitoringTable:
            "Ticket Monitoring Table",

        ticketMonitoringDescription:
            "Enter your ticket number or employee name to check ticket history. Ticket status updates automatically.",

        viewingDepartment: "Department",
        selectEmployeeFirst:
            "Select your employee name first",

        checkTicketStatus: "Check Ticket Status",
        ticketSearchPlaceholder:
            "Enter ticket # or employee name",
        checkStatus: "Check Status",

        noTicketsDepartment:
            "No tickets found for this department.",

        selectEmployeeToView:
            "Select your employee name to view your department tickets.",

        viewDetails: "View Details",
        edit: "Edit",

        assignedIT: "Assigned IT",

        ticketDetails: "Ticket Details",
        ticketNo: "Ticket No",
        status: "Status",
        dateOpened: "Date Opened",
        resolvedAt: "Resolved At",
        progressUpdate: "Progress Update",
        problemSolution: "Problem Solution",

        noRemarksProvided:
            "No remarks provided.",
        noProgressUpdate:
            "No progress update yet.",
        noSolutionProvided:
            "No solution provided yet.",

        editTicket: "Edit Ticket",
        cancel: "Cancel",
        saveChanges: "Save Changes",

        submittedSuccessfully:
            "Your ticket was submitted successfully. Tracking Code:",

        noActiveEmployees:
            "You cannot submit a ticket because there are no active employees registered. Please contact IT Department for assistance.",

        footer:
            "If your ticket concern submitted through this form is not addressed immediately, please call local 41 or email itd@lagunametts.com through Outlook.",

        open: "Open",
        ongoing: "Ongoing",
        resolved: "Resolved",

        english: "ENGLISH",
        japanese: "JAPANESE",
    },

    ja: {
        availableITStaff: "対応可能なITスタッフ",
        onDuty: "勤務中",
        offDuty: "勤務外",

        employeeTicketForm: "IT問い合わせフォーム",
        employeeTicketSubtitle:
            "IT部門へ直接お問い合わせを送信できます",

        employeeName: "従業員名",
        selectEmployeeName: "従業員名を選択",

        department: "部署",
        selectDepartment: "部署を選択",

        category: "カテゴリー",
        selectCategory: "カテゴリーを選択",

        problemDescription: "問題内容",
        remarks: "備考",
        remarksPlaceholder:
            "必要に応じて詳細を入力してください...",

        submitTicket: "チケットを送信",

        ticketMonitoringTable:
            "チケット確認",

        ticketMonitoringDescription:
            "チケット番号または従業員名を入力して履歴を確認できます。チケットの状態は自動的に更新されます。",

        viewingDepartment: "部署",
        selectEmployeeFirst:
            "最初に従業員名を選択してください",

        checkTicketStatus: "チケット状況を確認",
        ticketSearchPlaceholder:
            "チケット番号または従業員名を入力",
        checkStatus: "確認",

        noTicketsDepartment:
            "この部署のチケットはありません。",

        selectEmployeeToView:
            "従業員名を選択すると、所属部署のチケットを確認できます。",

        viewDetails: "詳細を見る",
        edit: "編集",

        assignedIT: "担当IT",

        ticketDetails: "チケット詳細",
        ticketNo: "チケット番号",
        status: "ステータス",
        dateOpened: "受付日時",
        resolvedAt: "解決日時",
        progressUpdate: "進捗状況",
        problemSolution: "対応内容",

        noRemarksProvided:
            "備考はありません。",
        noProgressUpdate:
            "現在、進捗情報はありません。",
        noSolutionProvided:
            "現在、解決内容はありません。",

        editTicket: "チケット編集",
        cancel: "キャンセル",
        saveChanges: "変更を保存",

        submittedSuccessfully:
            "チケットが正常に送信されました。トラッキングコード:",

        noActiveEmployees:
            "現在登録されている在籍従業員がいないため、チケットを送信できません。IT部門へお問い合わせください。",

        footer:
            "このフォームから送信したお問い合わせにすぐ対応されない場合は、内線41またはOutlookから itd@lagunametts.com へご連絡ください。",

        open: "受付中",
        ongoing: "対応中",
        resolved: "解決済み",

        english: "ENGLISH",
        japanese: "JAPANESE",
    },
};

const categoryTranslations = {
    Hardware: "ハードウェア",
    "Software / Application":
        "ソフトウェア / アプリケーション",
    "Account / Login":
        "アカウント / ログイン",
    "File / Folder Access":
        "ファイル / フォルダーアクセス",
    "Network / Internet":
        "ネットワーク / インターネット",
    "CCTV / Security":
        "CCTV / セキュリティ",
    Others: "その他",
};

export function getEmployeeLanguage() {
    if (typeof window === "undefined") {
        return "en";
    }

    return (
        localStorage.getItem(
            EMPLOYEE_LANGUAGE_KEY
        ) || "en"
    );
}

export function useEmployeeLanguage() {
    const [language, setLanguageState] =
        useState(() =>
            getEmployeeLanguage()
        );

    const setLanguage = (newLanguage) => {
        const finalLanguage =
            newLanguage === "ja"
                ? "ja"
                : "en";

        setLanguageState(finalLanguage);

        if (typeof window !== "undefined") {
            localStorage.setItem(
                EMPLOYEE_LANGUAGE_KEY,
                finalLanguage
            );
        }
    };

    return {
        language,
        setLanguage,
    };
}

export function translateUI(
    language,
    key
) {
    return (
        uiTranslations[
            language === "ja"
                ? "ja"
                : "en"
        ]?.[key] ||
        uiTranslations.en[key] ||
        key
    );
}

export function translateCategory(
    category,
    language
) {
    if (
        language !== "ja" ||
        !category
    ) {
        return category;
    }

    return (
        categoryTranslations[category] ||
        category
    );
}

export function translateStatus(
    status,
    language
) {
    if (language !== "ja") {
        return status;
    }

    switch (status) {
        case "Open":
            return translateUI(
                "ja",
                "open"
            );

        case "Ongoing":
            return translateUI(
                "ja",
                "ongoing"
            );

        case "Resolved":
            return translateUI(
                "ja",
                "resolved"
            );

        default:
            return status;
    }
}

export async function translateEmployeeText(
    text,
    language
) {
    if (
        !text ||
        language !== "ja"
    ) {
        return text || "";
    }

    const normalizedText =
        String(text).trim();

    if (!normalizedText) {
        return text;
    }

    const cacheKey =
        `ja::${normalizedText}`;

    if (
        googleTranslationCache.has(
            cacheKey
        )
    ) {
        return googleTranslationCache.get(
            cacheKey
        );
    }

    try {
        const url =
            "https://translate.googleapis.com/translate_a/single" +
            "?client=gtx" +
            "&sl=auto" +
            "&tl=ja" +
            "&dt=t" +
            `&q=${encodeURIComponent(
                normalizedText
            )}`;

        const response = await fetch(
            url
        );

        if (!response.ok) {
            return text;
        }

        const result =
            await response.json();

        const translated =
            Array.isArray(result?.[0])
                ? result[0]
                      .map(
                          (part) =>
                              part?.[0] ||
                              ""
                      )
                      .join("")
                : text;

        googleTranslationCache.set(
            cacheKey,
            translated
        );

        return translated;
    } catch (error) {
        console.error(
            "Google translation error:",
            error
        );

        return text;
    }
}

export function useTranslatedEmployeeText(
    text,
    language
) {
    const [translatedText, setTranslatedText] =
        useState(text || "");

    useEffect(() => {
        let cancelled = false;

        if (
            language !== "ja" ||
            !text
        ) {
            setTranslatedText(
                text || ""
            );

            return () => {
                cancelled = true;
            };
        }

        translateEmployeeText(
            text,
            language
        ).then((translated) => {
            if (!cancelled) {
                setTranslatedText(
                    translated
                );
            }
        });

        return () => {
            cancelled = true;
        };
    }, [text, language]);

    return translatedText;
}

export function TranslatedEmployeeText({
    text,
    language,
}) {
    const translated =
        useTranslatedEmployeeText(
            text,
            language
        );

    return <>{translated}</>;
}