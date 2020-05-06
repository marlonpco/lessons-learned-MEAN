const Lessons = require('../models/lessons');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Lessons-Error: "

exports.createLesson = (req, res, next) => {
  try{
    const lesson = new Lessons({
      project: req.body.project,
      type: req.body.type,
      classification: req.body.classification,
      severity: req.body.severity,
      case: req.body.case,
      impact: req.body.impact,
      remidiation: req.body.remidiation,
      lesson: req.body.lesson,
      creator: req.userData.userId,
      creationDate: new Date().toLocaleDateString()
    });

    lesson.save()
    .then(newRecord => {
      console.log(newRecord);
      res.status(201).json({
        message: "Lesson added successfully!",
        lesson: {
          ...newRecord,
          id: newRecord._id
        }
      });
    }).catch(error => {
      console.log(error);
      res.status(500).json({
        title: genericErrorTitle + "creation!",
        message: "Lesson not created!" + genericErrorMessage
      });
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "creation!",
      message: "Lesson not created!" + genericErrorMessage
    });
  }
}

exports.updateLessonById = (req, res, next) => {
  const id = req.body.id;
  const lesson = new Lessons({
    _id: id,
    project: req.body.project,
    type: req.body.type,
    classification: req.body.classification,
    severity: req.body.severity,
    case: req.body.case,
    impact: req.body.impact,
    remidiation: req.body.remidiation,
    lesson: req.body.lesson
  });

  Lessons.updateOne({ _id: id }, lesson)
  .then(result => {
    console.log(id);
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: "Lesson(#" + id +") updated!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "update!",
      message: "Lesson(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "update!",
      message: "Lesson not updated!" + genericErrorMessage
    });
  });
}

exports.deleteLessonById = (req, res, next) => {
  const id = req.params.id;

  Lessons.deleteOne({ _id: id })
  .then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "Lesson(#" + id +") deleted!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "delete!",
      message: "Lesson(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "delete!",
      message: "Lesson not deleted!" + genericErrorMessage
    });
  });
}

exports.getLessons = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const lesson = req.query.lesson;
  const dateFrom = req.query.datefrom;
  const dateTo = req.query.dateto;
  const project = req.query.project;
  const type = req.query.type;
  const classification = req.query.classification;
  const severity = req.query.severity;

  let lessonsQuery = Lessons.find().populate('creator');

  if(lesson){
    let tLesson = lesson.replace(/-/g, ' ');
    lessonsQuery.where('lesson',tLesson);
  }

  if(dateFrom){
    let tDFrom = dateFrom.replace(/-/g, '\/');
    lessonsQuery.where('creationDate').gte(tDFrom);
  }

  if(dateTo){
    let tDTo = dateTo.replace(/-/g, '\/');
    lessonsQuery.where('creationDate').lte(tDTo);
  }

  if (pageSize && currentPage) {
    lessonsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  if(project){
    lessonsQuery.where('project', project);
  }

  if(type){
    lessonsQuery.where('type', type);
  }

  if(classification){
    lessonsQuery.where('classification', classification);
  }

  if(severity){
    lessonsQuery.where('severity', severity);
  }

  let fetchLessons;

  lessonsQuery.then(documents => {
    fetchLessons = documents;
    return lessonsQuery.countDocuments();
  }).then(lessonCount => {
    res.status(200).json({
      message: "Lessons fetched successfully!",
      lessons: fetchLessons,
      count: lessonCount
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "fetch!",
      message: "Fetching lessons failed!" + genericErrorMessage
    });
  });
}

exports.getLessonById = (req, res, next) => {
  const id = req.params.id;
  Lessons.findById(id)
  .then(lesson => {
    if(lesson){
      res.status(200).json(lesson);
    }else{
      res.status(404).json({
        title: genericErrorTitle + "fetch-one!",
        message: "Lesson(#" + id + ") not found!" + genericErrorMessage
      });
    }
  });
}
