const express = require('express');

const auth = require('../middlewares/authentication');
const TeamsController = require('../controllers/admin-teams');

const router = express.Router();

router.get("", auth, TeamsController.getList);
router.get("/:id", auth, TeamsController.getOne);
router.post("", auth, TeamsController.add);
router.put("/:id", auth, TeamsController.update);
router.delete("/:id", auth, TeamsController.delete);

module.exports = router;
