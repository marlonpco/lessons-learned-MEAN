const Project = require('../models/admin-projects');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Admin-Projects-Error: "

exports.add = (req, res, next) => {
  const project = new Project({
    name: req.body.name,
    areaId: req.body.areaId,
    clientId: req.body.clientId,
    phaseId: req.body.phaseId
  });

  project.save()
  .then(newRecord => {
    console.log(newRecord);
    res.status(201).json({
      message: "Project added successfully!",
      project: {
        ...newRecord,
        id: newRecord._id
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "creation!",
      message: "Project not created!" + genericErrorMessage
    });
  });
}

exports.update = (req, res, next) => {
  const id = req.body.id;
  const project = new Project({
    _id: id,
    name: req.body.name,
    areaId: req.body.areaId,
    clientId: req.body.clientId,
    phaseId: req.body.phaseId
  });

  Project.updateOne({ _id: id }, project)
  .then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: "Project(#" + id +") updated!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "update!",
      message: "Project(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "update!",
      message: "Project not updated!" + genericErrorMessage
    });
  });
}

exports.delete = (req, res, next) => {
  const id = req.params.id;

  Project.deleteOne({ _id: id })
  .then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "Project(#" + id +") deleted!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "delete!",
      message: "Project(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "delete!",
      message: "Project not deleted!" + genericErrorMessage
    });
  });
}

exports.getList = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  let projectQuery = Project.find().populate('areaId').populate('phaseId').populate('clientId');
  let fetchedProjects;

  if (pageSize && currentPage) {
    projectQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  projectQuery.then(documents => {
    fetchedProjects = documents;
    return projectQuery.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Projects fetched successfully!",
      projects: fetchedProjects,
      count: count
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "fetch!",
      message: "Fetching lovs failed!" + genericErrorMessage
    });
  });
}

exports.getOne = (req, res, next) => {
  const id = req.params.id;
  Project.findById(id)
  .then(project => {
    if(project){
      res.status(200).json(project);
    }else{
      res.status(404).json({
        title: genericErrorTitle + "fetch-one!",
        message: "Project(#" + id + ") not found!" + genericErrorMessage
      });
    }
  });
}
