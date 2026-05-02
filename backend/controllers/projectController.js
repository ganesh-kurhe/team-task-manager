const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ msg: "Project name and description are required." });
  }

  const project = await Project.create({
    name,
    description,
    createdBy: req.user.id,
    members: [req.user.id],
  });

  res.json(project);
};

exports.addProjectMember = async (req, res) => {
  const { memberId, memberIds } = req.body;
  const membersToAdd = Array.isArray(memberIds) ? memberIds : memberId ? [memberId] : [];

  if (!membersToAdd.length) {
    return res.status(400).json({ msg: "Member ID or member IDs are required." });
  }

  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ msg: "Project not found" });

  const newMembers = membersToAdd.filter((id) => !project.members.includes(id));
  if (!newMembers.length) {
    return res.status(400).json({ msg: "Selected members are already assigned to this project." });
  }

  project.members.push(...newMembers);
  await project.save();

  const updatedProject = await Project.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  res.json(updatedProject);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find()
    .populate("createdBy", "name email")
    .populate("members", "name email role");
  res.json(projects);
};