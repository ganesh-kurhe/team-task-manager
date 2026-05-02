import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required.");
    }

    try {
      await api.post("/auth/signup", form);
      alert("Signup successful. Please login.");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.msg || "Signup failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700 px-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md rounded-[32px] bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur ring-1 ring-slate-200/60 dark:bg-slate-800/95 dark:ring-slate-700/60">
        <h2 className="text-3xl font-semibold text-slate-950 dark:text-slate-100">Create your account</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Join your team and start managing tasks with clarity.</p>

        <div className="mt-8 space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
            placeholder="Full name"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
            placeholder="Email"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
            placeholder="Password"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleSignup}
            className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-cyan-500/30"
          >
            Signup
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300" to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}