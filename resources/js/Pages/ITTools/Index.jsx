
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

const defaultGroups = [
    {
        name: "Systems",
        icon: "/images/tools/LMC-Logo-Wht.png",
    },
    {
        name: "Servers",
        icon: "/images/tools/nas.png",
    },
    {
        name: "Security",
        icon: "/images/tools/firewall.png",
    },
    {
        name: "CCTV",
        icon: "/images/tools/cctv.png",
    },
    {
        name: "Printers",
        icon: "/images/tools/printer.jpg",
    },
    {
        name: "Switches",
        icon: "/images/tools/ruijie.png",
    },
    {
        name: "Access Points",
        icon: "/images/tools/ruijie.png",
    },
    {
        name: "Databases",
        icon: "/images/tools/phpmyadmin.png",
    },
];

export default function Index({ tools = [], groups = [] }) {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedTool, setSelectedTool] = useState(null);
    const [editingTool, setEditingTool] = useState(null);
    const [toolToDelete, setToolToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fallbackIcon = "/images/tools/LMC-Logo-Wht.png";

    const categoryGroups = defaultGroups.map((defaultGroup) => {
        const providedGroup = groups.find(
            (group) => group.name === defaultGroup.name
        );

        return {
            ...defaultGroup,
            ...providedGroup,
            icon: providedGroup?.icon || defaultGroup.icon,
        };
    });

    const toolRecords = Array.isArray(tools)
        ? tools
        : tools?.data || [];

    const getToolIcon = (tool) => {
        if (tool.icon) {
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
        }

        const group = categoryGroups.find(
            (item) => item.name === tool.category
        );

        return group?.icon || fallbackIcon;
    };

    const soloTools = toolRecords.filter(
        (tool) => !tool.category
    );

    const selectedTools = selectedGroup
        ? toolRecords.filter(
              (tool) => tool.category === selectedGroup.name
          )
        : [];

    const openTool = (url) => {
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const openShow = (tool) => {
        setSelectedTool(tool);
    };

    const openEdit = (tool) => {
        setSelectedTool(null);
        setEditingTool(tool);
    };

    // Open Delete Confirmation Modal
    const deleteTool = (tool) => {
        setToolToDelete(tool);
    };

    // Confirm Delete
    const confirmDelete = () => {
        if (!toolToDelete || deleting) {
            return;
        }

        setDeleting(true);

        router.delete(route("ittools.destroy", toolToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setToolToDelete(null);
                setSelectedTool(null);
            },
            onError: () => {
                window.alert(
                    "Unable to delete the IT Tool. Please try again."
                );
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const renderToolCard = (tool) => (
        <div
            key={tool.id}
            className="ittools-tile-large relative"
            onClick={() => openShow(tool)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openShow(tool);
                }
            }}
        >
            <img
                key={`${tool.id}-${tool.icon || "default"}`}
                src={getToolIcon(tool)}
                alt={tool.name}
                className="ittools-icon-large"
                onError={(event) => {
                    const image = event.currentTarget;

                    if (image.src !== window.location.origin + fallbackIcon) {
                        image.src = fallbackIcon;
                    } else {
                        image.style.display = "none";
                    }
                }}
            />

            <div className="ittools-bar-info">
                <span className="ittools-name-large">
                    {tool.name}
                </span>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="IT Tools" />

            <div className="ittools-page">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="ittools-title">
                        IT CONTROL CENTER
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowCreate(true)}
                        title="Add IT Tool"
                        aria-label="Add IT Tool"
                        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-green-500 px-5 font-semibold text-white shadow hover:bg-green-600"
                    >
                        {/* Tool Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 17.6a2 2 0 0 0 2.8 2.8l5.3-5.3a5 5 0 0 0 6.4-6.4L14 12l-3-3z" />
                        </svg>

                        <span>Add</span>
                    </button>
                </div>

                <div className="ittools-grid-expanded">
                    {categoryGroups.map((group) => (
                        <div
                            key={group.name}
                            className="ittools-tile-large"
                            onClick={() => setSelectedGroup(group)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    setSelectedGroup(group);
                                }
                            }}
                        >
                            <img
                                src={group.icon}
                                alt={group.name}
                                className="ittools-icon-large"
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                }}
                            />

                            <div className="ittools-bar-info">
                                <span className="ittools-name-large">
                                    {group.name}
                                </span>
                            </div>
                        </div>
                    ))}

                    {soloTools.map((tool) =>
                        renderToolCard(tool)
                    )}
                </div>

                {selectedGroup && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setSelectedGroup(null)}
                        />

                        <div className="relative z-10 max-h-[85vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/10 bg-[#13243c] p-8 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setSelectedGroup(null)}
                                className="absolute right-5 top-4 text-2xl font-bold text-white hover:text-gray-300"
                            >
                                ×
                            </button>

                            <h2 className="mb-8 text-center text-2xl font-bold tracking-wide text-white">
                                {selectedGroup.name}
                            </h2>

                            <div className="ittools-grid-expanded">
                                {selectedTools.map((tool) =>
                                    renderToolCard(tool)
                                )}
                            </div>

                            {selectedTools.length === 0 && (
                                <div className="py-8 text-center text-gray-300">
                                    No IT Tools found in this category.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {showCreate && (
                    <Create
                        groups={categoryGroups}
                        onClose={() => setShowCreate(false)}
                    />
                )}

                {selectedTool && (
                    <Show
                        tool={selectedTool}
                        onClose={() => setSelectedTool(null)}
                        onEdit={openEdit}
                        onDelete={deleteTool}
                        onOpen={openTool}
                    />
                )}

                {editingTool && (
                    <Edit
                        key={editingTool.id}
                        tool={editingTool}
                        groups={categoryGroups}
                        onClose={() => setEditingTool(null)}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {toolToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                        <div className="relative w-full max-w-md rounded-2xl bg-white px-6 py-7 text-center shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setToolToDelete(null)}
                                disabled={deleting}
                                className="absolute right-4 top-3 text-xl font-bold text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <h2 className="mb-4 text-xl font-semibold text-[#13243c]">
                                DELETE IT TOOL?
                            </h2>

                            <p className="mb-6 text-sm leading-6 text-gray-600">
                                Are you sure you want to permanently delete this IT Tool?
                            </p>

                            <div className="flex items-center justify-center gap-6">
                                <button
                                    type="button"
                                    onClick={() => setToolToDelete(null)}
                                    disabled={deleting}
                                    className="min-w-[98px] rounded-lg bg-gray-500 px-5 py-2.5 font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="min-w-[96px] rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}