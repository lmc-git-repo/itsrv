import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Create({ onClose }) {
    const { data, setData, post, processing } = useForm({
        to: "",
        from: "",
        date: "",
        equipment: "",
        quantity: "",
        description: "",
        origin: "",
        destination: "",
        remarks: "",
    });

    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const filled =
            data.to &&
            data.from &&
            data.date &&
            data.equipment &&
            data.quantity &&
            data.description &&
            data.origin &&
            data.destination &&
            data.remarks;

        setIsComplete(Boolean(filled));
    }, [data]);

    const submit = (e) => {
        e.preventDefault();
        if (!isComplete) return;

        post(route("transferslip.store"), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <form
                onSubmit={submit}
                className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 text-[#101E33]"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>

                <h2 className="text-xl font-bold text-center mb-4">
                    ADD NEW TRANSFER SLIP RECORD
                </h2>

                <div className="space-y-3 text-sm">
                    <input
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="To"
                        value={data.to}
                        onChange={(e) => setData("to", e.target.value)}
                        required
                    />

                    <input
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="From"
                        value={data.from}
                        onChange={(e) => setData("from", e.target.value)}
                        required
                    />

                    <input
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        type="date"
                        value={data.date}
                        onChange={(e) => setData("date", e.target.value)}
                        required
                    />

                    <select
                        className="w-full px-3 py-2 border rounded-lg text-base"
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
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="Quantity"
                        value={data.quantity}
                        onChange={(e) => setData("quantity", e.target.value)}
                        required
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="Description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        required
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="Origin"
                        value={data.origin}
                        onChange={(e) => setData("origin", e.target.value)}
                        required
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="Destination"
                        value={data.destination}
                        onChange={(e) => setData("destination", e.target.value)}
                        required
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="Remarks"
                        value={data.remarks}
                        onChange={(e) => setData("remarks", e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-gray-500 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!isComplete || processing}
                        className={`px-6 py-2 rounded-lg font-semibold text-white ${
                            isComplete
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-green-300 cursor-not-allowed"
                        }`}
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}