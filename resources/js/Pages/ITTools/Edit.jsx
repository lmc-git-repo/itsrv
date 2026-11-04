
import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function Edit({ tool, groups, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name: tool.name || "",
        category: tool.category || "",
        url: tool.url || "",
        image: null,
        _method: "PUT",
    });

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const submit = (event) => {
        event.preventDefault();

        post(route("ittools.update", tool.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#101E33] focus:border-blue-500 focus:ring-blue-500";

    const currentImage = (() => {
        if (!tool.icon) {
            return "/images/tools/LMC-Logo-Wht.png";
        }

        const icon = String(tool.icon).trim();

        if (
            icon.startsWith("http://") ||
            icon.startsWith("https://") ||
            icon.startsWith("/")
        ) {
            return icon;
        }

        if (icon.startsWith("it-tools/")) {
            return `/storage/${icon}`;
        }

        return `/${icon}`;
    })();

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

                <h2 className="mb-8 text-center text-2xl font-bold text-white">
                    Edit IT Tool
                </h2>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            Tool Name *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={inputClass}
                            required
                            maxLength={255}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            Category *
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Standalone Tool (No Category)</option>
                            {groups.map((group) => (
                                <option key={group.name} value={group.name}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            URL / Link *
                        </label>
                        <input
                            type="url"
                            value={data.url}
                            onChange={(e) => setData("url", e.target.value)}
                            className={inputClass}
                            required
                            maxLength={4096}
                        />
                        {errors.url && (
                            <p className="mt-1 text-sm text-red-400">{errors.url}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            Current Image
                        </label>

                        <img
                            src={currentImage}
                            alt={tool.name}
                            className="mb-3 h-16 w-16 object-contain"
                            onError={(e) => {
                                const image = e.currentTarget;
                                const fallback = "/images/tools/LMC-Logo-Wht.png";

                                if (image.src !== window.location.origin + fallback) {
                                    image.src = fallback;
                                } else {
                                    image.style.display = "none";
                                }
                            }}
                        />

                        <label className="mb-2 block text-sm font-semibold text-white">
                            Replace Image (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={(e) => setData("image", e.target.files[0] || null)}
                            className="block w-full rounded-lg border border-white/20 bg-white/10 p-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:font-semibold file:text-[#101E33]"
                        />
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-400">{errors.image}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-600 px-5 py-2.5 font-semibold text-white hover:bg-gray-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? "Updating..." : "Update Tool"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}