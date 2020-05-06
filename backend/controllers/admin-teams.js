const Team = require('../models/admin-teams');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Admin-Teams-Error: "

exports.add = (req, res, next) => {
  const team = new Team({
    project: req.body.project,
    user: req.body.user
  });

  team.save()
  .then(newRecord => {
    console.log(newRecord);
    res.status(201).json({
      message: "Team added successfully!",
      team: {
        ...newRecord,
        id: newRecord._id
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "creation!",
      message: "Team not created!" + genericErrorMessage
    });
  });
}

exports.update = (req, res, next) => {
  const id = req.body.id;
  const team = new Team({
    _id: id,
    project: req.body.project,
    user: req.body.user
  });

  Team.updateOne({ _id: id }, team)
  .then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: "Team(#" + id +") updated!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "update!",
      message: "Team(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "update!",
      message: "Team not updated!" + genericErrorMessage
    });
  });
}

exports.delete = (req, res, next) => {
  const id = req.params.id;

  Team.deleteOne({ _id: id })
  .then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "Team(#" + id +") deleted!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "delete!",
      message: "Team(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "delete!",
      message: "Team not deleted!" + genericErrorMessage
    });
  });
}

exports.getList = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userId = req.query.user;

  let teamQuery = Team.find();
  let fetchedTeams;

  if(userId){
    teamQuery.where('user', userId);
  }

  if (pageSize && currentPage) {
    teamQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  teamQuery.populate('project').populate('user');

  teamQuery.then(documents => {
    fetchedTeams = documents;
    return teamQuery.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Teams fetched successfully!",
      teams: fetchedTeams,
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
  Team.findById(id)
  .then(team => {
    if(team){
      res.status(200).json(team);
    }else{
      res.status(404).json({
        title: genericErrorTitle + "fetch-one!",
        message: "Team(#" + id + ") not found!" + genericErrorMessage
      });
    }
  });
}
