import { Link } from "@inertiajs/react";

export default function Pagination({ links = [], queryParams = {} }) {
    if (!links || links.length <= 1) return null;

    return (
        <div className="flex justify-center mt-6">
            <nav className="inline-flex items-center gap-1 text-sm">
                {links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-3 py-1 text-gray-400"
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
                            className={`px-3 py-1 rounded ${
                                link.active
                                    ? "bg-[#101E33] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </nav>
        </div>
    );
}