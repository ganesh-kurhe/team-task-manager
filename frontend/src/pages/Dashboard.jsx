import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, overdue: 0, completed: 0 });

  const fetchStats = async () => {
    const [projectsRes, tasksRes] = await Promise.all([api.get("/projects"), api.get("/tasks")]);
    const tasks = tasksRes.data || [];
    const overdue = tasks.filter((task) => task.status !== "done" && task.dueDate && new Date(task.dueDate) < new Date()).length;
    const completed = tasks.filter((task) => task.status === "done").length;
    setStats({ projects: projectsRes.data.length, tasks: tasks.length, overdue, completed });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 uppercase tracking-[0.2em] text-xs dark:text-slate-400">Welcome back</p>
            <h1 className="text-3xl font-bold tracking-tight dark:text-slate-100">Project dashboard</h1>
            <p className="mt-2 text-slate-600 max-w-2xl dark:text-slate-400">
              Track your projects, assign tasks quickly, and stay on top of progress with role-based controls.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-xl shadow-sky-500/20 transition hover:-translate-y-1 hover:shadow-2xl dark:shadow-sky-500/30">
            <p className="text-sm uppercase text-sky-100">Active Projects</p>
            <p className="mt-4 text-4xl font-semibold">{stats.projects}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-800 dark:shadow-slate-900/20">
            <p className="text-sm uppercase text-slate-500 dark:text-slate-400">Open Tasks</p>
            <p className="mt-4 text-4xl font-semibold dark:text-slate-100">{stats.tasks}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-800 dark:shadow-slate-900/20">
            <p className="text-sm uppercase text-slate-500 dark:text-slate-400">Completed</p>
            <p className="mt-4 text-4xl font-semibold dark:text-slate-100">{stats.completed}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-800 dark:shadow-slate-900/20">
            <p className="text-sm uppercase text-slate-500 dark:text-slate-400">Overdue</p>
            <p className="mt-4 text-4xl font-semibold text-rose-500 dark:text-rose-400">{stats.overdue}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/10 dark:bg-slate-800 dark:shadow-slate-900/20">
            <h2 className="text-xl font-semibold dark:text-slate-100">Team workflow</h2>
            <p className="mt-3 text-slate-300 dark:text-slate-400">
              Use the Projects and Tasks pages to assign work, monitor progress, and close tasks quickly. Admins can create projects and steer the team.
            </p>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 dark:bg-slate-800 dark:shadow-slate-900/20">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent activity</h2>
            <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
              <li className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                No recent tasks yet? Start by creating a project or assigning a task to a teammate.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}