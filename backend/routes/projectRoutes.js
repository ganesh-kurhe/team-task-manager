const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const { createProject, getProjects, addProjectMember } = require("../controllers/projectController");

router.post("/", auth, role("admin"), createProject);
router.put("/:id/members", auth, role("admin"), addProjectMember);
router.get("/", auth, getProjects);

module.exports = router;