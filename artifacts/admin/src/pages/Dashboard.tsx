import { useEffect, useState, useCallback } from "react";
import {
  fetchStats,
  fetchStudents,
  fetchEnquiries,
  updateEnquiryStatus,
  updateEnquiryNotes,
  type Stats,
  type Student,
  type Enquiry,
} from "@/lib/api";
import ContactModal from "@/components/ContactModal";

const STATUS_OPTIONS = [
  "pending",
  "contacted",
  "in_progress",
  "completed",
] as const;
type Status = (typeof STATUS_OPTIONS)[number];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  contacted: "Contacted",
  in_progress: "In Progress",
  completed: "Completed",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
        {label}
      </p>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function TopList({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const sorted = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const max = sorted[0]?.[1] ?? 1;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-[#0F2D5E] mb-4">{title}</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet</p>
      ) : (
        <div className="space-y-3">
          {sorted.map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">{key}</span>
                <span className="text-gray-500">{val}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F2D5E] rounded-full"
                  style={{ width: `${(val / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"overview" | "students" | "enquiries">(
    "overview",
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [contactEnquiry, setContactEnquiry] = useState<Enquiry | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes] = useState<number | null>(null);
  const [savedNotes, setSavedNotes] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, st, enq] = await Promise.all([
        fetchStats(),
        fetchStudents(),
        fetchEnquiries(),
      ]);
      setStats(s);
      setStudents(st);
      setEnquiries(enq);
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveNotes = async (id: number) => {
    const notes = draftNotes[id] ?? "";
    setSavingNotes(id);
    try {
      const updated = await updateEnquiryNotes(id, notes);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setSavedNotes(id);
      setTimeout(() => setSavedNotes((s) => (s === id ? null : s)), 2500);
    } catch {
      // ignore
    } finally {
      setSavingNotes(null);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const updated = await updateEnquiryStatus(id, status);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (stats) {
        load();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const filteredStudents = students.filter((s) =>
    [s.name, s.email, s.country, s.courseInterest].some((v) =>
      v.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const filteredEnquiries = enquiries.filter((e) => {
    const matchSearch = [
      e.name,
      e.email,
      e.country,
      e.course,
      e.destination,
    ].some((v) => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const TABS = [
    { id: "overview", label: "Overview" },
    {
      id: "students",
      label: `Students${students.length ? ` (${students.length})` : ""}`,
    },
    {
      id: "enquiries",
      label: `Enquiries${enquiries.length ? ` (${enquiries.length})` : ""}`,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F0F4FA]">
      {/* Header */}
      <header className="bg-[#0F2D5E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4963A] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L2 5.5V12.5L9 16L16 12.5V5.5L9 2Z"
                  fill="white"
                  opacity="0.9"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                Thames Uni Connect
              </span>
              <span className="text-blue-300 text-xs ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="text-xs text-blue-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              ↻ Refresh
            </button>
            <button
              onClick={onLogout}
              className="text-xs bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setSearch("");
                  setStatusFilter("all");
                }}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-[#0F2D5E] text-[#0F2D5E]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-16 text-gray-400">Loading data…</div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 border border-red-200">
            ⚠ {error}
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {!loading && tab === "overview" && stats && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Students"
                value={stats.totalUsers}
                sub="Registered in app"
                color="text-[#0F2D5E]"
              />
              <StatCard
                label="Total Enquiries"
                value={stats.totalEnquiries}
                sub="Via Apply form"
                color="text-[#D4963A]"
              />
              <StatCard
                label="Active Pipeline"
                value={
                  (stats.byStatus.contacted ?? 0) +
                  (stats.byStatus.in_progress ?? 0)
                }
                sub="Contacted + In Progress"
                color="text-purple-700"
              />
              <StatCard
                label="Completed"
                value={stats.byStatus.completed ?? 0}
                sub="Applications finished"
                color="text-green-700"
              />
            </div>

            {/* Status breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-[#0F2D5E] mb-5">
                Enquiries by Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STATUS_OPTIONS.map((s) => (
                  <div
                    key={s}
                    className="text-center p-4 rounded-xl bg-gray-50"
                  >
                    <div
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${STATUS_COLOR[s]}`}
                    >
                      {STATUS_LABEL[s]}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.byStatus[s] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TopList title="Top Countries" data={stats.byCountry} />
              <TopList title="Top Courses" data={stats.byCourse} />
              <TopList title="Top Destinations" data={stats.byDestination} />
            </div>
          </div>
        )}

        {/* ── STUDENTS ── */}
        {!loading && tab === "students" && (
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, country, course…"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F2D5E]"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {filteredStudents.length} students
              </span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center text-gray-400 shadow-sm">
                {search
                  ? "No students match your search"
                  : "No students registered yet"}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          ID
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Name
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Email
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Phone
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Country
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Course Interest
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Registered
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                            #{s.id}
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#0F2D5E] flex items-center justify-center text-white text-xs font-bold">
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              {s.name}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            <a
                              href={`mailto:${s.email}`}
                              className="hover:text-[#0F2D5E] hover:underline"
                            >
                              {s.email}
                            </a>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            <a
                              href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              className="hover:text-green-600 hover:underline"
                            >
                              {s.phone}
                            </a>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {s.country}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                              {s.courseInterest}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            {fmt(s.registeredAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ENQUIRIES ── */}
        {!loading && tab === "enquiries" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, course, country…"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F2D5E]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F2D5E] bg-white"
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {filteredEnquiries.length} enquiries
              </span>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center text-gray-400 shadow-sm">
                {search || statusFilter !== "all"
                  ? "No enquiries match your filters"
                  : "No enquiries submitted yet"}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          ID
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Applicant
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Contact
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Country
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Destination
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Course
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Submitted
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEnquiries.map((e) => {
                        const isExpanded = expandedId === e.id;
                        const draft = draftNotes[e.id] ?? e.notes;
                        const isDirty = draft !== e.notes;
                        return (
                          <>
                            <tr
                              key={e.id}
                              className={`transition-colors ${isExpanded ? "bg-blue-50/40" : "hover:bg-gray-50"}`}
                            >
                              <td className="px-3 py-4 text-gray-400 font-mono text-xs">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setExpandedId(isExpanded ? null : e.id);
                                      if (
                                        !isExpanded &&
                                        draftNotes[e.id] === undefined
                                      ) {
                                        setDraftNotes((prev) => ({
                                          ...prev,
                                          [e.id]: e.notes,
                                        }));
                                      }
                                    }}
                                    className={`w-5 h-5 flex items-center justify-center rounded transition-all ${isExpanded ? "text-[#0F2D5E]" : "text-gray-300 hover:text-gray-500"}`}
                                    title="Show notes"
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      style={{
                                        transform: isExpanded
                                          ? "rotate(90deg)"
                                          : "rotate(0deg)",
                                        transition: "transform 0.15s",
                                      }}
                                    >
                                      <path d="M8 5l8 7-8 7V5z" />
                                    </svg>
                                  </button>
                                  #{e.id}
                                </div>
                              </td>
                              <td className="px-5 py-4 font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-[#D4963A] flex items-center justify-center text-white text-xs font-bold">
                                    {e.name.charAt(0).toUpperCase()}
                                  </div>
                                  {e.name}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-gray-600 space-y-0.5">
                                {e.email && (
                                  <div>
                                    <a
                                      href={`mailto:${e.email}`}
                                      className="hover:text-[#0F2D5E] hover:underline text-xs"
                                    >
                                      {e.email}
                                    </a>
                                  </div>
                                )}
                                <div>
                                  <a
                                    href={`https://wa.me/${e.phone.replace(/\D/g, "")}`}
                                    target="_blank"
                                    className="hover:text-green-600 hover:underline text-xs"
                                  >
                                    {e.phone}
                                  </a>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-gray-600">
                                {e.country}
                              </td>
                              <td className="px-5 py-4">
                                <span className="inline-block bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                  {e.destination}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-gray-600 max-w-[160px] truncate">
                                {e.course}
                              </td>
                              <td className="px-5 py-4">
                                <select
                                  value={e.status}
                                  onChange={(ev) =>
                                    handleStatusChange(e.id, ev.target.value)
                                  }
                                  disabled={updating === e.id}
                                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F2D5E] disabled:opacity-50 ${STATUS_COLOR[e.status]}`}
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                      {STATUS_LABEL[s]}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-5 py-4 text-gray-400 text-xs">
                                {fmt(e.submittedAt)}
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => setContactEnquiry(e)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2D5E] hover:text-white bg-blue-50 hover:bg-[#0F2D5E] px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                                  </svg>
                                  Contact
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr
                                key={`notes-${e.id}`}
                                className="bg-blue-50/40 border-t-0"
                              >
                                <td colSpan={9} className="px-6 pb-5 pt-0">
                                  <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded bg-[#0F2D5E] flex items-center justify-center">
                                          <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 24 24"
                                            fill="white"
                                          >
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                          </svg>
                                        </div>
                                        <span className="text-xs font-bold text-[#0F2D5E] uppercase tracking-wide">
                                          Internal Notes
                                        </span>
                                        {e.notes && (
                                          <span className="text-xs text-gray-400">
                                            · last saved {fmt(e.updatedAt)}
                                          </span>
                                        )}
                                        {isDirty && (
                                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                            unsaved
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                          {draft.length} chars
                                        </span>
                                        <button
                                          onClick={() => handleSaveNotes(e.id)}
                                          disabled={
                                            savingNotes === e.id || !isDirty
                                          }
                                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                            savedNotes === e.id
                                              ? "bg-green-100 text-green-700"
                                              : isDirty
                                                ? "bg-[#0F2D5E] text-white hover:bg-[#1a3d7a]"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          }`}
                                        >
                                          {savingNotes === e.id ? (
                                            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          ) : savedNotes === e.id ? (
                                            <svg
                                              width="12"
                                              height="12"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                            >
                                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                            </svg>
                                          ) : (
                                            <svg
                                              width="12"
                                              height="12"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                            >
                                              <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z" />
                                            </svg>
                                          )}
                                          {savingNotes === e.id
                                            ? "Saving…"
                                            : savedNotes === e.id
                                              ? "Saved!"
                                              : "Save Notes"}
                                        </button>
                                      </div>
                                    </div>
                                    <textarea
                                      value={draft}
                                      onChange={(ev) =>
                                        setDraftNotes((prev) => ({
                                          ...prev,
                                          [e.id]: ev.target.value,
                                        }))
                                      }
                                      onKeyDown={(ev) => {
                                        if (
                                          (ev.metaKey || ev.ctrlKey) &&
                                          ev.key === "s"
                                        ) {
                                          ev.preventDefault();
                                          if (isDirty) handleSaveNotes(e.id);
                                        }
                                      }}
                                      placeholder={`Add call notes, follow-up reminders, or application updates for ${e.name}…`}
                                      rows={4}
                                      className="w-full px-3 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-[#0F2D5E] focus:ring-1 focus:ring-[#0F2D5E] leading-relaxed placeholder:text-gray-400"
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5">
                                      Tip: press{" "}
                                      <kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-mono">
                                        ⌘S
                                      </kbd>{" "}
                                      /{" "}
                                      <kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-mono">
                                        Ctrl+S
                                      </kbd>{" "}
                                      to save quickly
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {contactEnquiry && (
        <ContactModal
          enquiry={contactEnquiry}
          onClose={() => setContactEnquiry(null)}
        />
      )}
    </div>
  );
}
