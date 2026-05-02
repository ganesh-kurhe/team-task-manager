import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { getUser } from "../utils/getUser";

export default function TeamMembers() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const user = getUser();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (error) {
      setUsers([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data || []);
    } catch (error) {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const projectMemberMap = useMemo(() => {
    const map = {};
    projects.forEach((project) => {
      project.members?.forEach((member) => {
        map[member._id] = map[member._id] ? [...map[member._id], project.name] : [project.name];
      });
    });
    return map;
  }, [projects]);

  const filteredUsers = users.filter((member) => {
    const searchValue = search.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchValue) ||
      member.email.toLowerCase().includes(searchValue) ||
      member.role.toLowerCase().includes(searchValue)
    );
  });

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const assignSelectedUsers = async () => {
    if (!selectedProject) return alert("Choose a project to assign team members.");
    if (!selectedUserIds.length) return alert("Select at least one team member.");

    setLoading(true);
    setStatusMessage("");

    try {
      await api.put(`/projects/${selectedProject}/members`, {
        memberIds: selectedUserIds,
      });
      setStatusMessage(`Assigned ${selectedUserIds.length} member(s) successfully.`);
      setSelectedUserIds([]);
      fetchProjects();
    } catch (error) {
      setStatusMessage(error.response?.data?.msg || "Could not assign members.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold dark:text-slate-100">Team Members</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Search team members, review current project assignments, and assign multiple users to a project at once.
            </p>
          </div>
        </div>

        {user?.role === "admin" && (
          <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-cyan-50 p-6 shadow-xl shadow-slate-200/70 transition hover:-translate-y-0.5 dark:from-slate-800 dark:to-slate-900 dark:shadow-slate-900/20">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or role"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
                >
                  <option value="">Choose project for assignment</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={assignSelectedUsers}
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-4 text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-cyan-500/30"
                >
                  {loading ? "Assigning..." : "Assign selected"}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Selected {selectedUserIds.length} member(s) to assign.
            </p>
            {statusMessage && (
              <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {statusMessage}
              </p>
            )}
          </section>
        )}

        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 dark:bg-slate-800 dark:shadow-slate-900/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold dark:text-slate-100">Team directory</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredUsers.length} members</span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Assigned projects</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((member) => (
                  <tr key={member._id} className="border-b border-slate-200 hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-4">
                      {user?.role === "admin" ? (
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(member._id)}
                          onChange={() => toggleUserSelection(member._id)}
                          className="h-4 w-4 text-sky-600 dark:bg-slate-600 dark:border-slate-500"
                        />
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{member.name}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{member.email}</td>
                    <td className="px-4 py-4 uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{member.role}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {projectMemberMap[member._id]?.join(", ") || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
