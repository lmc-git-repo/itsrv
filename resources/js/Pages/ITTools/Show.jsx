
import React, { useEffect } from "react";

export default function Show({ tool, onClose, onEdit, onDelete }) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#13243c] p-8 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-4 text-2xl font-bold text-white hover:text-gray-300"
                >
                    ×
                </button>

                <h2 className="mb-6 text-center text-2xl font-bold text-white">
                    IT Tool Details
                </h2>

                <div className="mb-6 flex justify-center">
                    <img
                        src={tool.icon || "/images/tools/LMC-Logo-Wht.png"}
                        alt={tool.name}
                        className="h-20 w-20 object-contain"
                        onError={(e) => {
                            e.currentTarget.src = "/images/tools/LMC-Logo-Wht.png";
                        }}
                    />
                </div>

                <div className="space-y-4 text-white">
                    <div>
                        <p className="text-sm font-semibold text-gray-300">Tool Name</p>
                        <p className="break-words text-lg">{tool.name}</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-300">Category</p>
                        <p>{tool.category || "Standalone Tool"}</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-300">URL / Link</p>
                        <p className="break-all text-sm text-blue-300">{tool.url}</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => onDelete(tool)}
                        className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={() => onEdit(tool)}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => window.open(tool.url, "_blank", "noopener,noreferrer")}
                        className="rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700"
                    >
                        Open Link
                    </button>
                </div>
            </div>
        </div>
    );
}