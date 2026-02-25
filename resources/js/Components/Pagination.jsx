import { Link } from "@inertiajs/react";

export default function Pagination({ links = [], queryParams = {} }) {
    if (!links || links.length <= 1) return null;

    return (
        <div className="flex justify-center mt-6">
            <nav className="inline-flex items-center gap-2 text-sm">
                {links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-4 py-2 rounded-full border border-gray-200 text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            preserveState
                            data={queryParams}
                            className={`
                                px-4 py-2 rounded-full border transition
                                ${
                                    link.active
                                        ? "bg-[#002C82] text-white border-[#002C82] shadow"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }
                            `}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </nav>
        </div>
    );
}