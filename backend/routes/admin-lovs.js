const express = require('express');

const auth = require('../middlewares/authentication');
const LOVController = require('../controllers/admin-lov');

const router = express.Router();

router.get("", auth, LOVController.getList);
router.get("/:id", auth, LOVController.getOne);
router.post("", auth, LOVController.add);
router.put("/:id", auth, LOVController.update);
router.delete("/:id", auth, LOVController.delete);

module.exports = router;
