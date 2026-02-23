import { useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";

export default function Edit({ record, onClose }) {
    const { data, setData, put, processing } = useForm({
        to: record.to || "",
        from: record.from || "",
        date: record.date || "",
        equipment: record.equipment || "",
        quantity: record.quantity || "",
        description: record.description || "",
        origin: record.origin || "",
        destination: record.destination || "",
        remarks: record.remarks || "",
    });

    const originalData = useMemo(
        () => ({
            to: record.to || "",
            from: record.from || "",
            date: record.date || "",
            equipment: record.equipment || "",
            quantity: record.quantity || "",
            description: record.description || "",
            origin: record.origin || "",
            destination: record.destination || "",
            remarks: record.remarks || "",
        }),
        [record]
    );

    const hasChanges = useMemo(() => {
        return Object.keys(originalData).some(
            (key) => String(data[key]) !== String(originalData[key])
        );
    }, [data, originalData]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const submit = (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        put(route("transferslip.update", record.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <form
                onSubmit={submit}
                className="relative bg-white rounded-2xl w-full max-w-md p-6 z-10 text-[#101E33]"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>

                <h2 className="text-xl font-bold text-center mb-4">
                    EDIT TRANSFER SLIP RECORD
                </h2>

                <div className="space-y-3 text-base">
                    <input
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.to}
                        onChange={(e) => setData("to", e.target.value)}
                        required
                    />

                    <input
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.from}
                        onChange={(e) => setData("from", e.target.value)}
                        required
                    />

                    <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.date}
                        onChange={(e) => setData("date", e.target.value)}
                        required
                    />

                    <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.equipment}
                        onChange={(e) => setData("equipment", e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Equipment</option>
                        <option value="Cellphone">Cellphone</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Tablet">Tablet</option>
                    </select>

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.quantity}
                        onChange={(e) => setData("quantity", e.target.value)}
                        required
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.origin}
                        onChange={(e) => setData("origin", e.target.value)}
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.destination}
                        onChange={(e) => setData("destination", e.target.value)}
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={data.remarks}
                        onChange={(e) => setData("remarks", e.target.value)}
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-2 rounded-lg bg-gray-500 text-white font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!hasChanges || processing}
                        className={`px-8 py-2 rounded-lg font-semibold text-white ${
                            !hasChanges || processing
                                ? "bg-green-300 cursor-not-allowed"
                                : "bg-green-500"
                        }`}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}