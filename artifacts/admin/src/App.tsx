import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import { verifyAdminKey } from "@/lib/api";

export default function App() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("tuc_admin_key");
    if (!key) { setAuthed(false); return; }
    verifyAdminKey(key).then(setAuthed);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tuc_admin_key");
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0F2D5E] flex items-center justify-center">
        <div className="text-white text-sm opacity-60">Loading…</div>
      </div>
    );
  }

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
