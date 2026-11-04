import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const panelClass =
  "rounded-lg bg-[#162845] p-6 shadow-its";

const StatCard = ({ title, value, subtitle, accent, onClick }) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    }}
    className={`relative overflow-hidden rounded-lg bg-[#162845] px-6 py-4 shadow-its ${
      onClick ? "cursor-pointer hover:opacity-90" : ""
    }`}
  >
    <div
      className="absolute inset-x-0 bottom-0 h-[3px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      }}
    />

    <div className="mb-1 text-xs uppercase tracking-widest text-gray-300">
      {title}
    </div>

    <div className="text-3xl font-bold text-white">
      {value ?? 0}
    </div>

    {subtitle && (
      <div className="mt-2 text-xs text-gray-300">
        {subtitle}
      </div>
    )}
  </div>
);

export default function Dashboard({
  totals = { open: 0, ongoing: 0, resolved: 0 },
  totalTickets = 0,
  resolutionRate = 0,
  averageResolutionDays = null,
  categories = [],
  personnelPerformance = [],
  trend = [],
  period = "yearly",
  selectedYear = new Date().getFullYear(),
  selectedMonth = new Date().getMonth() + 1,
  periodLabel = "",
  tickets = [],
  weeklyTasks = [],
  weeklyRange = { start: "", end: "", selectedDate: "" },
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryTickets, setCategoryTickets] = useState([]);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [selectedWeekDate, setSelectedWeekDate] = useState(
    weeklyRange.selectedDate || ""
  );

  const pageTickets = usePage().props.tickets ?? [];
  const sourceTickets = tickets.length ? tickets : pageTickets;

  const years = Array.from(
    { length: 8 },
    (_, index) => new Date().getFullYear() - index
  );

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  useEffect(() => {
    setSelectedWeekDate(weeklyRange.selectedDate || "");
  }, [weeklyRange.selectedDate]);

  const changePeriod = (nextPeriod, nextYear = selectedYear, nextMonth = selectedMonth) => {
    router.get(
      route("dashboard"),
      {
        period: nextPeriod,
        year: nextYear,
        month: nextMonth,
        week_date: selectedWeekDate || weeklyRange.selectedDate,
      },
      {
        preserveScroll: true,
        preserveState: true,
      }
    );
  };

  const filterWeeklyTasks = (date) => {
    setSelectedWeekDate(date);

    router.get(
      route("dashboard"),
      {
        period,
        year: selectedYear,
        month: selectedMonth,
        week_date: date,
      },
      {
        preserveScroll: true,
        preserveState: true,
      }
    );
  };

  const openModal = (statusLabel, statusValue) => {
    setSelectedStatus(statusLabel);
    setFilteredTickets(
      sourceTickets.filter(
        (t) =>
          t.status?.toLowerCase().trim() ===
          statusValue.toLowerCase().trim()
      )
    );
    setShowModal(true);
  };

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setCategoryTickets(
      sourceTickets.filter(
        (t) => (t?.category ?? "").trim() === category
      )
    );
    setShowCategoryModal(true);
  };

  useEffect(() => {
    if (!showModal || !selectedStatus) return;

    const statusValue = selectedStatus.replace(" Tickets", "");

    setFilteredTickets(
      sourceTickets.filter(
        (t) =>
          t.status?.toLowerCase().trim() ===
          statusValue.toLowerCase().trim()
      )
    );
  }, [sourceTickets, showModal, selectedStatus]);

  useEffect(() => {
    if (!showCategoryModal || !selectedCategory) return;

    setCategoryTickets(
      sourceTickets.filter(
        (t) => (t?.category ?? "").trim() === selectedCategory
      )
    );
  }, [sourceTickets, showCategoryModal, selectedCategory]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setShowCategoryModal(false);
        setShowWeeklyModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const chartTextColor = "#dbeafe";
  const gridColor = "rgba(255,255,255,0.08)";

  const statusData = {
    labels: ["Open", "Ongoing", "Resolved"],
    datasets: [
      {
        data: [
          totals.open,
          totals.ongoing,
          totals.resolved,
        ],
        backgroundColor: [
          "#1685ff",
          "#ffc107",
          "#10c889",
        ],
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };

  const centerTextPlugin = {
    id: "dashboardCenterText",
    afterDatasetsDraw(chart) {
      if (chart.config.type !== "doughnut") return;

      const meta = chart.getDatasetMeta(0);
      if (!meta?.data?.length) return;

      const { ctx } = chart;
      const { x, y } = meta.data[0];

      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        Number(totalTickets).toLocaleString(),
        x,
        y - 8
      );

      ctx.font = "12px Arial";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Total Tickets", x, y + 22);
      ctx.restore();
    },
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
    },
  };

  const trendData = {
    labels: trend.map((item) => item.label),
    datasets: [
      {
        label: "Tickets",
        data: trend.map((item) => item.total),
        borderColor: "#38a8ff",
        backgroundColor: "rgba(56,168,255,0.16)",
        pointBackgroundColor: "#38a8ff",
        pointBorderColor: "#ffffff",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 3,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          color: chartTextColor,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: period === "monthly" ? 12 : 12,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: chartTextColor,
          precision: 0,
        },
        grid: { color: gridColor },
      },
    },
  };

  const topCategories = [...categories]
    .filter((cat) => Number(cat.total) > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const categoryColors = [
    "#a855f7",
    "#38a8ff",
    "#22c7e8",
    "#10c889",
    "#fbbf24",
  ];

  const categoryChartData = {
    labels: topCategories.map((cat) => cat.name),
    datasets: [
      {
        data: topCategories.map((cat) => cat.total),
        backgroundColor: topCategories.map(
          (_, index) => categoryColors[index]
        ),
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const categoryChartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const category = topCategories[elements[0].index];
        if (category) openCategoryModal(category.name);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x} tickets`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: chartTextColor,
          precision: 0,
        },
        grid: { color: gridColor },
      },
      y: {
        ticks: {
          color: chartTextColor,
          font: { size: 11 },
          autoSkip: false,
        },
        grid: { display: false },
      },
    },
  };

  const personnelMax = Math.max(
    1,
    ...personnelPerformance.map((person) => person.total)
  );

  const personnelTotal = personnelPerformance.reduce(
    (sum, person) => sum + person.total,
    0
  );

  const formatPercent = (value) =>
    totalTickets > 0
      ? ((Number(value) / totalTickets) * 100).toFixed(1)
      : "0.0";

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-lg font-semibold tracking-wide">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="w-full space-y-8 text-white">
        {/* HEADER AND REPORT FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-blue-300">
              Reporting Period: {periodLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-white/20 bg-[#162845] p-1">
              {["weekly", "monthly", "yearly"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => changePeriod(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                    period === item
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {period !== "weekly" && (
              <select
                value={selectedYear}
                onChange={(e) =>
                  changePeriod(
                    period,
                    Number(e.target.value),
                    selectedMonth
                  )
                }
                className="rounded-lg border border-white/20 bg-[#162845] px-3 py-2 text-sm text-white"
              >
                {!years.includes(Number(selectedYear)) && (
                  <option value={selectedYear}>{selectedYear}</option>
                )}
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}

            {period === "monthly" && (
              <select
                value={selectedMonth}
                onChange={(e) =>
                  changePeriod(
                    period,
                    selectedYear,
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border border-white/20 bg-[#162845] px-3 py-2 text-sm text-white"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            )}

            {period === "weekly" && (
              <input
                type="date"
                value={selectedWeekDate}
                onChange={(e) => filterWeeklyTasks(e.target.value)}
                className="rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-[#101E33]"
              />
            )}

            <button
              type="button"
              onClick={() => setShowWeeklyModal(true)}
              className="rounded-lg border border-blue-400/40 bg-[#162845] px-4 py-2 text-sm font-semibold hover:bg-[#203b60]"
            >
              Weekly IT Tasks
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Open"
            value={totals.open}
            accent="#1685ff"
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
            subtitle={`${resolutionRate}% of tickets opened in period`}
            accent="#10c889"
            onClick={() => openModal("Resolved Tickets", "Resolved")}
          />

          <StatCard
            title="Avg. Resolution Time"
            value={
              averageResolutionDays === null
                ? "N/A"
                : `${averageResolutionDays} Days`
            }
            subtitle="Tickets resolved during period"
            accent="#a855f7"
          />
        </div>

        {/* STATUS AND TREND */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div
            className="rounded-lg shadow-its px-8 py-7 flex flex-col overflow-hidden"
            style={{ backgroundColor: "#162845", height: "420px" }}
          >
            <h2 className="text-center text-lg font-semibold tracking-[0.35em] mb-4">
              TOTAL TICKETS
            </h2>

            <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
              <div className="w-[270px] h-[270px] flex items-center justify-center">
                {totalTickets > 0 ? (
                  <Doughnut
                    data={statusData}
                    options={statusOptions}
                    plugins={[centerTextPlugin]}
                  />
                ) : (
                  <div className="text-gray-300">
                    No tickets found.
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-white">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-9 bg-[#1685ff]" />
                  Open
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-9 bg-[#ffc107]" />
                  Ongoing
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-9 bg-[#10c889]" />
                  Resolved
                </div>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <h2 className="text-base font-bold tracking-wide">
              TICKET VOLUME TREND
            </h2>
            <p className="mt-1 text-xs text-gray-300">
              IT support requests opened during selected period
            </p>

            <div className="mt-6 h-[260px]">
              <Line data={trendData} options={trendOptions} />
            </div>
          </div>
        </div>

        {/* PERSONNEL AND CATEGORIES */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className={panelClass}>
            <h2 className="text-base font-bold tracking-wide">
              IT PERSONNEL PERFORMANCE
            </h2>
            <p className="mt-1 text-xs text-gray-300">
              Tickets resolved by each IT personnel during selected period
            </p>

            <div className="mt-6 max-h-[320px] space-y-5 overflow-y-auto pr-2">
              {personnelPerformance.length > 0 ? (
                personnelPerformance.map((person, index) => (
                  <div key={person.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-sm font-semibold">
                        <span className="mr-2 text-blue-300">
                          {index + 1}.
                        </span>
                        {person.name}
                      </span>

                      <span className="shrink-0 text-sm font-bold">
                        {person.total} Tickets
                        <span className="ml-2 text-xs font-normal text-gray-300">
                          (
                          {personnelTotal > 0
                            ? (
                                (person.total / personnelTotal) *
                                100
                              ).toFixed(1)
                            : "0.0"}
                          %)
                        </span>
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{
                          width: `${(person.total / personnelMax) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-sm text-gray-400">
                  No resolved tickets assigned to IT personnel
                  for this period.
                </div>
              )}
            </div>
          </div>

          <div className={panelClass}>
            <h2 className="text-base font-bold tracking-wide">
              TOP IT SUPPORT CATEGORIES
            </h2>
            <p className="mt-1 text-xs text-gray-300">
              Most requested IT support services
            </p>

            {topCategories.length > 0 ? (
              <div className="mt-6 h-[280px]">
                <Bar
                  data={categoryChartData}
                  options={categoryChartOptions}
                />
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
                No category data for this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY DETAILS MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCategoryModal(false)}
          />

          <div className="relative z-10 w-full max-w-6xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="mb-6 text-center text-2xl font-bold text-[#101E33]">
              {selectedCategory}
            </h2>

            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full border text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 text-left text-gray-800">
                  <tr>
                    {[
                      "Ticket No.",
                      "Employee Name",
                      "Department",
                      "Status",
                      "Category",
                      "Problem Description",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="border p-3 text-sm font-semibold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {categoryTickets.length > 0 ? (
                    categoryTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-t align-top text-gray-800"
                      >
                        <td className="whitespace-nowrap border p-3 text-sm font-medium">
                          {ticket.ticket_no || "—"}
                        </td>
                        <td className="border p-3 text-sm font-medium">
                          {ticket.employee_name}
                        </td>
                        <td className="border p-3 text-sm font-medium">
                          {ticket.department}
                        </td>
                        <td className="whitespace-nowrap border p-3 text-sm font-medium">
                          {ticket.status}
                        </td>
                        <td className="border p-3 text-sm font-medium">
                          {ticket.category || "—"}
                        </td>
                        <td className="break-words border p-3 text-sm font-medium leading-relaxed">
                          {ticket.problem_description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-4 text-center text-gray-500"
                      >
                        No tickets found for this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* WEEKLY TASKS MODAL */}
      {showWeeklyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowWeeklyModal(false)}
          />

          <div className="relative z-10 w-full max-w-7xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowWeeklyModal(false)}
              className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="mb-2 text-center text-2xl font-bold text-[#101E33]">
              Weekly IT Tasks
            </h2>

            <div className="mb-6 text-center text-sm text-gray-500">
              <div className="mb-3">
                {weeklyRange.start} to {weeklyRange.end}
              </div>

              <input
                type="date"
                value={selectedWeekDate}
                onChange={(e) => filterWeeklyTasks(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm text-[#101E33]"
              />
            </div>

            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full min-w-[1400px] border border-gray-200 text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 text-left text-gray-800">
                  <tr>
                    {[
                      "Ticket No.",
                      "Employee Name",
                      "Department",
                      "Category",
                      "Status",
                      "Date Opened",
                      "Resolved At",
                      "Resolved By",
                      "Problem Description",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="border p-3 text-sm font-semibold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {weeklyTasks.length > 0 ? (
                    weeklyTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-t align-top text-gray-800"
                      >
                        <td className="whitespace-nowrap border p-3">
                          {task.ticket_no}
                        </td>
                        <td className="border p-3">
                          {task.employee_name}
                        </td>
                        <td className="border p-3">
                          {task.department}
                        </td>
                        <td className="border p-3">
                          {task.category}
                        </td>
                        <td className="border p-3">
                          {task.status}
                        </td>
                        <td className="whitespace-nowrap border p-3">
                          {task.date_opened || "—"}
                        </td>
                        <td className="whitespace-nowrap border p-3">
                          {task.resolved_at || "—"}
                        </td>
                        <td className="border p-3">
                          {task.resolved_by_name || "—"}
                        </td>
                        <td className="break-words border p-3">
                          {task.problem_description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="p-4 text-center text-gray-500"
                      >
                        No weekly tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STATUS DETAILS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />

          <div className="relative z-10 w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="mb-6 text-center text-2xl font-bold text-[#101E33]">
              {selectedStatus}
            </h2>

            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full border text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 text-left text-gray-800">
                  <tr>
                    {[
                      "Employee Name",
                      "Department",
                      "Category",
                      "Status",
                      "Problem Description",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="border p-2 text-base font-medium"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t text-gray-800"
                      >
                        <td className="border p-2 text-base font-medium">
                          {t.employee_name}
                        </td>
                        <td className="border p-2 text-base font-medium">
                          {t.department}
                        </td>
                        <td className="border p-2 text-base font-medium">
                          {t.category}
                        </td>
                        <td className="border p-2 text-base font-medium">
                          {t.status}
                        </td>
                        <td className="border p-2 text-base font-medium">
                          {t.problem_description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-gray-500"
                      >
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