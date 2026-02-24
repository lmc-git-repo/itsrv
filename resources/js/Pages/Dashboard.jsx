import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

/* =========================
   CENTER TEXT PLUGIN
========================= */
const centerTextPlugin = {
  id: "centerText",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    const total = chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
    const { x, y } = meta.data[0];

    ctx.save();
    ctx.font = "600 42px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, x, y);
    ctx.restore();
  },
};

ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin);

/* =========================
   STAT CARD (CLICKABLE)
========================= */
const StatCard = ({ title, value, accent, onClick }) => (
  <div
    onClick={onClick}
    className="relative rounded-lg px-6 py-4 shadow-its overflow-hidden cursor-pointer hover:opacity-90"
    style={{ backgroundColor: "#162845" }}
  >
    <div
      className="absolute inset-x-0 bottom-0 h-[3px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      }}
    />
    <div className="text-xs text-gray-300 uppercase tracking-widest mb-1">
      {title}
    </div>
    <div className="text-3xl font-bold">{value ?? 0}</div>
  </div>
);

/* =========================
   ✅ INSERTED: CATEGORY DEFINITIONS
========================= */
const CATEGORY_INFO = {
  "Application & System Support": {
    meaning:
      "Issues related to internal systems, software applications, and business tools used by employees.",
    examples: [
      "ERP system not loading",
      "Payroll system error",
      "Internal web app not responding",
    ],
  },
  "Hardware Support & Device Setup": {
    meaning:
      "Physical device issues or setup requests for computers and peripherals.",
    examples: [
      "New laptop setup",
      "Printer not working",
      "Monitor display issue",
    ],
  },
  "Account & Access Management": {
    meaning:
      "Requests related to user accounts, logins, and system access permissions.",
    examples: [
      "Password reset",
      "New employee account creation",
      "System access request",
    ],
  },
  "File, Data & Document Management": {
    meaning:
      "Concerns involving files, shared folders, backups, and document handling.",
    examples: [
      "Lost files",
      "Shared drive access",
      "File recovery request",
    ],
  },
  "Network & Connectivity Support": {
    meaning:
      "Internet, LAN, WiFi, VPN, or network-related issues affecting connectivity.",
    examples: [
      "No internet connection",
      "VPN not connecting",
      "Slow network speed",
    ],
  },
  "IT Operations & Maintenance": {
    meaning:
      "Routine IT operations, maintenance tasks, and system health checks.",
    examples: [
      "System updates",
      "Server maintenance",
      "Scheduled downtime",
    ],
  },
  "Asset & Equipment Handling": {
    meaning:
      "Tracking, issuance, return, and maintenance of IT assets and equipment.",
    examples: [
      "Laptop issuance",
      "Device replacement",
      "Asset inventory update",
    ],
  },
  "Security & Permissions": {
    meaning:
      "Security-related issues including permissions, threats, and policy enforcement.",
    examples: [
      "Suspicious login activity",
      "Permission denied error",
      "Security incident report",
    ],
  },
};

export default function Dashboard({
  totals = { open: 0, ongoing: 0, resolved: 0 },
  categories = [],
  tickets = [],
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  const pageTickets = usePage().props.tickets ?? [];
  const sourceTickets = tickets.length ? tickets : pageTickets;

  /* =========================
     ✅ INSERTED: CATEGORY MODAL STATE
  ========================= */
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const openModal = (statusLabel, statusValue) => {
    setSelectedStatus(statusLabel);
    setFilteredTickets(
      sourceTickets.filter(
        (t) =>
          t.status?.toLowerCase().trim() === statusValue.toLowerCase().trim()
      )
    );
    setShowModal(true);
  };

  useEffect(() => {
    if (!showModal || !selectedStatus) return;

    const statusValue = selectedStatus.replace(" Tickets", "");

    setFilteredTickets(
      sourceTickets.filter(
        (t) =>
          t.status?.toLowerCase().trim() === statusValue.toLowerCase().trim()
      )
    );
  }, [sourceTickets, showModal, selectedStatus]);

  /* =========================
     ESC KEY CLOSE
  ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);

        /* ✅ INSERTED: close category modal on ESC too */
        setShowCategoryModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const hasData = totals.open > 0 || totals.ongoing > 0 || totals.resolved > 0;

  const chartData = {
    labels: ["Open", "Ongoing", "Resolved"],
    datasets: [
      {
        data: [totals.open, totals.ongoing, totals.resolved],
        backgroundColor: ["#0d6efd", "#ffc107", "#198754"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: { size: 11 },
        },
      },
    },
  };

  const categoryColors = [
    "#a855f7",
    "#504B38",
    "#f97316",
    "#FEEAC9",
    "#687FE5",
    "#A1D6B2",
    "#FDB7EA",
    "#FFB38E",
  ];

  return (
    <AuthenticatedLayout
      header={<h2 className="text-lg font-semibold tracking-wide">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="w-full space-y-8">
        <div className="mt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Open"
            value={totals.open}
            accent="#0d6efd"
            onClick={() => openModal("Open Tickets", "Open")}
          />
          <StatCard
            title="Ongoing"
            value={totals.ongoing}
            accent="#ffc107"
            onClick={() => openModal("Ongoing Tickets", "Ongoing")}
          />
          <StatCard
            title="Resolved"
            value={totals.resolved}
            accent="#198754"
            onClick={() => openModal("Resolved Tickets", "Resolved")}
          />
        </div>

        <div
          className="rounded-lg shadow-its px-6 py-6 flex flex-col"
          style={{ backgroundColor: "#162845", height: "400px" }}
        >
          <h2 className="text-center text-lg font-semibold tracking-[0.35em] mb-2">
            TOTAL TICKETS
          </h2>

          {hasData && (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-[340px] h-[340px]">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <StatCard
              key={cat.name}
              title={cat.name}
              value={cat.total}
              accent={categoryColors[index % categoryColors.length]}
              /* ✅ INSERTED: CLICK OPENS CATEGORY INFO MODAL */
              onClick={() => {
                setSelectedCategory(cat.name);
                setShowCategoryModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* =========================
         ✅ INSERTED: CATEGORY INFO MODAL
      ========================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCategoryModal(false)}
          />

          <div className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl z-10">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[#101E33] text-center">
              {selectedCategory}
            </h2>

            <div className="text-base text-gray-800">
              <div className="mb-4">
                <div className="font-semibold text-[#101E33] mb-1">Meaning</div>
                <div>
                  {CATEGORY_INFO[selectedCategory]?.meaning ??
                    "No description available for this category."}
                </div>
              </div>

              <div>
                <div className="font-semibold text-[#101E33] mb-1">Sample Issues</div>
                <ul className="list-disc list-inside space-y-1">
                  {(CATEGORY_INFO[selectedCategory]?.examples ?? []).length ? (
                    CATEGORY_INFO[selectedCategory].examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))
                  ) : (
                    <li>No sample issues available.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
         ✅ YOUR ORIGINAL STATUS MODAL (UNCHANGED)
      ========================= */}
       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-xl w-full max-w-4xl p-6 shadow-xl z-10">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl md:text-2xl font-bold mb-6 text-[#101E33] text-center">
              {selectedStatus}
            </h2>

            {/* ✅ INSERTED ONLY — VERTICAL SCROLL */}
            <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 text-left text-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 border text-base font-medium">
                      Employee Name
                    </th>
                    <th className="p-2 border text-base font-medium">
                      Department
                    </th>
                    <th className="p-2 border text-base font-medium">
                      Category
                    </th>
                    <th className="p-2 border text-base font-medium">Status</th>
                    <th className="p-2 border text-base font-medium">
                      Problem Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((t) => (
                      <tr key={t.id} className="border-t text-gray-800">
                        <td className="p-2 border text-base font-medium">
                          {t.employee_name}
                        </td>
                        <td className="p-2 border text-base font-medium">
                          {t.department}
                        </td>
                        <td className="p-2 border text-base font-medium">
                          {t.category}
                        </td>
                        <td className="p-2 border text-base font-medium">
                          {t.status}
                        </td>
                        <td className="p-2 border text-base font-medium">
                          {t.problem_description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}