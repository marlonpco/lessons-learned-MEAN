const express = require('express');

const auth = require('../middlewares/authentication');
const LessonsController = require('../controllers/lessons');

const router = express.Router();

//unathenticated
router.get("", LessonsController.getLessons);

//authenticated
router.get("/:id", auth, LessonsController.getLessonById);
router.post("", auth, LessonsController.createLesson);
router.put("/:id", auth, LessonsController.updateLessonById);
router.delete("/:id", auth, LessonsController.deleteLessonById);

module.exports = router;
