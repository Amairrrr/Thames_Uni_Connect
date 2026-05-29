import { useEffect, useState, useCallback } from "react";
import {
  fetchStats, fetchStudents, fetchEnquiries, updateEnquiryStatus,
  type Stats, type Student, type Enquiry,
} from "@/lib/api";

const STATUS_OPTIONS = ["pending", "contacted", "in_progress", "completed"] as const;
type Status = typeof STATUS_OPTIONS[number];

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
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{label}</p>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function TopList({ title, data }: { title: string; data: Record<string, number> }) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 5);
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
  const [tab, setTab] = useState<"overview" | "students" | "enquiries">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, st, enq] = await Promise.all([fetchStats(), fetchStudents(), fetchEnquiries()]);
      setStats(s);
      setStudents(st);
      setEnquiries(enq);
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

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
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredEnquiries = enquiries.filter((e) => {
    const matchSearch = [e.name, e.email, e.country, e.course, e.destination].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "students", label: `Students${students.length ? ` (${students.length})` : ""}` },
    { id: "enquiries", label: `Enquiries${enquiries.length ? ` (${enquiries.length})` : ""}` },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F0F4FA]">
      {/* Header */}
      <header className="bg-[#0F2D5E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4963A] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L2 5.5V12.5L9 16L16 12.5V5.5L9 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-sm">Thames Uni Connect</span>
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
                onClick={() => { setTab(t.id); setSearch(""); setStatusFilter("all"); }}
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
              <StatCard label="Total Students" value={stats.totalUsers} sub="Registered in app" color="text-[#0F2D5E]" />
              <StatCard label="Total Enquiries" value={stats.totalEnquiries} sub="Via Apply form" color="text-[#D4963A]" />
              <StatCard label="Active Pipeline" value={(stats.byStatus.contacted ?? 0) + (stats.byStatus.in_progress ?? 0)} sub="Contacted + In Progress" color="text-purple-700" />
              <StatCard label="Completed" value={stats.byStatus.completed ?? 0} sub="Applications finished" color="text-green-700" />
            </div>

            {/* Status breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-[#0F2D5E] mb-5">Enquiries by Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STATUS_OPTIONS.map((s) => (
                  <div key={s} className="text-center p-4 rounded-xl bg-gray-50">
                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${STATUS_COLOR[s]}`}>
                      {STATUS_LABEL[s]}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.byStatus[s] ?? 0}</p>
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
              <span className="text-sm text-gray-500 whitespace-nowrap">{filteredStudents.length} students</span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center text-gray-400 shadow-sm">
                {search ? "No students match your search" : "No students registered yet"}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">ID</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Country</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Course Interest</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{s.id}</td>
                          <td className="px-5 py-4 font-semibold text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#0F2D5E] flex items-center justify-center text-white text-xs font-bold">
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              {s.name}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            <a href={`mailto:${s.email}`} className="hover:text-[#0F2D5E] hover:underline">{s.email}</a>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            <a href={`https://wa.me/${s.phone.replace(/\D/g, "")}`} target="_blank" className="hover:text-green-600 hover:underline">{s.phone}</a>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{s.country}</td>
                          <td className="px-5 py-4">
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{s.courseInterest}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{fmt(s.registeredAt)}</td>
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
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500 whitespace-nowrap">{filteredEnquiries.length} enquiries</span>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center text-gray-400 shadow-sm">
                {search || statusFilter !== "all" ? "No enquiries match your filters" : "No enquiries submitted yet"}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">ID</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Applicant</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Country</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Destination</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Course</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{e.id}</td>
                          <td className="px-5 py-4 font-semibold text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#D4963A] flex items-center justify-center text-white text-xs font-bold">
                                {e.name.charAt(0).toUpperCase()}
                              </div>
                              {e.name}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600 space-y-0.5">
                            {e.email && <div><a href={`mailto:${e.email}`} className="hover:text-[#0F2D5E] hover:underline text-xs">{e.email}</a></div>}
                            <div><a href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" className="hover:text-green-600 hover:underline text-xs">{e.phone}</a></div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{e.country}</td>
                          <td className="px-5 py-4">
                            <span className="inline-block bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">{e.destination}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-600 max-w-[160px] truncate">{e.course}</td>
                          <td className="px-5 py-4">
                            <select
                              value={e.status}
                              onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                              disabled={updating === e.id}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F2D5E] disabled:opacity-50 ${STATUS_COLOR[e.status]}`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{fmt(e.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
