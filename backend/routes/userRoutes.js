const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { getUsers } = require("../controllers/userController");

router.get("/", auth, role("admin"), getUsers);

module.exports = router;
