import { useState } from "react";
import { verifyAdminKey } from "@/lib/api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verifyAdminKey(password);
    if (ok) {
      localStorage.setItem("tuc_admin_key", password);
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2D5E] to-[#1B4080] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0F2D5E] mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" fill="#D4963A" opacity="0.9"/>
              <path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" fill="white" opacity="0.15"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#0F2D5E]">Thames Uni Connect</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F2D5E] transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#0F2D5E] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1B4080] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Authorised access only · Thames Uni Connect
        </p>
      </div>
    </div>
  );
}
