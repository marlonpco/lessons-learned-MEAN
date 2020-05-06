const express = require('express');

const auth = require('../middlewares/authentication');
const ProjectsController = require('../controllers/admin-projects');

const router = express.Router();

router.get("", auth, ProjectsController.getList);
router.get("/:id", auth, ProjectsController.getOne);
router.post("", auth, ProjectsController.add);
router.put("/:id", auth, ProjectsController.update);
router.delete("/:id", auth, ProjectsController.delete);

module.exports = router;
