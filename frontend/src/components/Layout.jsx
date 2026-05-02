import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../utils/getUser";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = getUser();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 flex flex-col border-r border-slate-800 shadow-xl shadow-slate-900/20 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:border-slate-700">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Team Task Manager</h1>
            <p className="text-sm text-slate-300 mt-2 dark:text-slate-400">
              Role: <span className="font-medium text-cyan-300 dark:text-cyan-400">{user?.role || "guest"}</span>
            </p>
          </div>

          <nav className="flex-1 space-y-2">
            <Link className="block rounded-2xl px-4 py-3 text-slate-100 hover:bg-slate-800 hover:text-white transition shadow-sm dark:text-slate-200 dark:hover:bg-slate-700" to="/dashboard">
              Dashboard
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-slate-100 hover:bg-slate-800 hover:text-white transition shadow-sm dark:text-slate-200 dark:hover:bg-slate-700" to="/projects">
              Projects
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-slate-100 hover:bg-slate-800 hover:text-white transition shadow-sm dark:text-slate-200 dark:hover:bg-slate-700" to="/team-members">
              Team Members
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-slate-100 hover:bg-slate-800 hover:text-white transition shadow-sm dark:text-slate-200 dark:hover:bg-slate-700" to="/tasks">
              Tasks
            </Link>
          </nav>

          <div className="mt-6 space-y-3">
            <button
              onClick={toggleDarkMode}
              className="w-full rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-600 transition dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={logout}
              className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition dark:bg-sky-600 dark:text-slate-100 dark:hover:bg-sky-500"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 dark:bg-slate-800 dark:shadow-slate-900/20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}