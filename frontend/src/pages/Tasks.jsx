import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { getUser } from "../utils/getUser";

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const user = getUser();

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data || []);
  };

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data || []);
  };

  const createTask = async () => {
    if (!title || !selectedProject) return alert("Add a title and select a project.");

    await api.post("/tasks", {
      title,
      description,
      projectId: selectedProject,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setSelectedProject("");
    setAssignedTo("");
    fetchTasks();
  };

  const moveTask = async (task, status) => {
    await api.put(`/tasks/${task._id}`, { status });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold dark:text-slate-100">Tasks</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Create work items, assign them to a project, and move them across task lanes.</p>
          </div>
        </div>

        <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-sky-50 p-6 shadow-xl shadow-slate-200/70 dark:from-slate-800 dark:to-slate-900 dark:shadow-slate-900/20">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-300"
              placeholder="Task title"
            />
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setAssignedTo("");
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-300"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-300 dark:disabled:bg-slate-600"
              disabled={!selectedProject}
            >
              <option value="">Assign to team member</option>
              {projects
                .find((project) => project._id === selectedProject)
                ?.members?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
            </select>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-300"
            />
            <button
              onClick={createTask}
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-4 text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-sky-500/30"
            >
              Create task
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 w-full rounded-2xl border border-slate-200 p-4 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            placeholder="Task details (optional)"
            rows="3"
          />
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          {Object.entries(statusLabels).map(([status, label]) => (
            <section key={status} className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 dark:bg-slate-800 dark:shadow-slate-900/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-slate-100">{label}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-400">{tasks.filter((task) => task.status === status).length}</span>
              </div>

              <div className="space-y-3">
                {tasks.filter((task) => task.status === status).map((task) => {
                  const due = task.dueDate ? new Date(task.dueDate) : null;
                  const overdue = due && due < new Date() && task.status !== "done";
                  const canMove = user?.role === "admin" || task.assignedTo?._id === user?.id;
                  return (
                    <div key={task._id} className="rounded-3xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-700/50 dark:hover:border-slate-600">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{task.description || "No description."}</p>
                        </div>
                        {overdue && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 dark:bg-rose-900 dark:text-rose-400">Overdue</span>}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span>{task.projectId?.name || "Unassigned project"}</span>
                        <span>Assigned to: {task.assignedTo?.name || "Me"}</span>
                        {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {canMove && status !== "done" && (
                          <button
                            onClick={() => moveTask(task, status === "todo" ? "in-progress" : "done")}
                            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition dark:bg-sky-600 dark:hover:bg-sky-500"
                          >
                            {status === "todo" ? "Start" : "Complete"}
                          </button>
                        )}
                        <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-600 dark:text-slate-400">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}