import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { getUser } from "../utils/getUser";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberToAdd, setMemberToAdd] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const user = getUser();

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data || []);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch {
      setUsers([]);
    }
  };

  const createProject = async () => {
    if (!name || !description) return alert("Enter a project name and description.");

    await api.post("/projects", { name, description });
    setName("");
    setDescription("");
    fetchProjects();
  };

  const addProjectMember = async (projectId) => {
    const memberId = memberToAdd[projectId];
    if (!memberId) return alert("Select a team member to add.");

    await api.put(`/projects/${projectId}/members`, { memberId });
    setMemberToAdd((prev) => ({ ...prev, [projectId]: "" }));
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === "admin") fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold dark:text-slate-100">Projects</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create and manage team projects with visibility across members.
            </p>
          </div>
        </div>

        {user?.role === "admin" && (
          <section className="rounded-3xl bg-gradient-to-br from-cyan-600 to-slate-950 p-6 text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 dark:shadow-slate-900/30">
            <h2 className="text-xl font-semibold">Create new project</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                className="rounded-2xl border border-slate-300 bg-white/95 p-3 text-sm text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={createProject} className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-sky-500/30">
                Create project
              </button>
            </div>
            <textarea
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white/95 p-3 text-sm text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
              rows="3"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => {
            const availableUsers = users.filter((u) => !project.members?.find((member) => member._id === u._id));
            return (
              <article key={project._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{project.name}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{project.description || "No description yet."}</p>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                    {project.members?.length || 0} members
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Created by {project.createdBy?.name || "Team"}
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.members?.map((member) => (
                      <span key={member._id} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {member.name}
                      </span>
                    ))}
                  </div>

                  {user?.role === "admin" && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                      <select
                        className="rounded-2xl border border-slate-200 p-3 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
                        value={memberToAdd[project._id] || ""}
                        onChange={(e) => setMemberToAdd((prev) => ({ ...prev, [project._id]: e.target.value }))}
                      >
                        <option value="">Add team member</option>
                        {availableUsers.map((userOption) => (
                          <option key={userOption._id} value={userOption._id}>
                            {userOption.name} ({userOption.role})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => addProjectMember(project._id)}
                        className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-cyan-500/30"
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}