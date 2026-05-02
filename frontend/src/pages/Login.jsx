import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return alert("All fields are required.");
    }

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-sky-600 to-cyan-700 px-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md rounded-[32px] bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur ring-1 ring-slate-200/60 dark:bg-slate-800/95 dark:ring-slate-700/60">
        <h2 className="text-3xl font-semibold text-slate-950 dark:text-slate-100">Welcome back</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to manage your projects and keep your team on schedule.</p>

        <div className="mt-8 space-y-4">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-300"
            placeholder="Email"
          />

          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-300"
            placeholder="Password"
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-sky-500/30"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New here? <Link className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300" to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}