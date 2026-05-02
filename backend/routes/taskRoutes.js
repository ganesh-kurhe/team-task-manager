const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createTask,
  updateTask,
  getTasks
} = require("../controllers/taskController");

router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.get("/", auth, getTasks);

module.exports = router;