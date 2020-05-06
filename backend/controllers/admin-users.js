const bcrypt = require("bcrypt");
const Auth = require('../models/auth');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Admin-Users-Error: "

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.pwd, 10).then(hash => {
    const user = new Auth({
      user: req.body.user,
      pwd: hash,
      email: req.body.email,
      empId: req.body.empId,
      name: req.body.name,
      role: req.body.role
    });

    user.save().then(result => {
      res.status(201).json({
        message: "User created!",
        user: {
          ...result,
          id: result._id
        }
      });
    }).catch(error => {
      console.log(error);
      res.status(500).json({
        title: genericErrorTitle + "create!",
        message: "Invalid authentication!" + genericErrorMessage
      });
    });
  });
}

exports.updateUser = (req, res, next) => {
  const id = req.body.id;
  const user = new Auth({
    _id: id,
    email: req.body.email,
    empId: req.body.empId,
    name: req.body.name,
    role: req.body.role
  });

  Auth.updateOne({ _id: id }, user)
  .then(result => {
    console.log(id);
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: "User(#" + id +") updated!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "update!",
      message: "User(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "update!",
      message: "User not updated!" + genericErrorMessage
    });
  });
}

exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  Auth.deleteOne({ _id: id })
  .then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "User(#" + id +") deleted!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "delete!",
      message: "User(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "delete!",
      message: "User not deleted!" + genericErrorMessage
    });
  });
}

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const empId = req.query.empId;
  const email = req.query.email;
  const user = req.query.user;

  let userQuery = Auth.find();
  let fetchUsers;

  if(empId){
    let tEmpId = empId.replace(/-/g, " ");
    userQuery.where('empId', tEmpId);
  }

  if(email){
    let tEmail = email.replace(/-/g, " ") + '@indracompany.com';
    userQuery.where('email', tEmail);
  }

  if(user){
    let tUser = user.replace(/-/g, " ");
    userQuery.where('user', tUser);
  }

  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  userQuery.then(documents => {
    fetchUsers = documents;
    return userQuery.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Users fetched successfully!",
      users: fetchUsers,
      count: count
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "fetch!",
      message: "Fetching users failed!" + genericErrorMessage
    });
  });

}

exports.getUser = (req, res, next) => {
  const id = req.params.id;
  Auth.findById(id)
  .then(user => {
    if(user){
      console.log(user);
      res.status(200).json(user);
    }else{
      res.status(404).json({
        title: genericErrorTitle + "fetch-one!",
        message: "User(#" + id + ") not found!" + genericErrorMessage
      });
    }
  });
}

exports.changePassword = (req, res, next) => {
  const id = req.params.id;
  let fetchedUser;

  if(req.body.oldPwd === req.body.newPwd){
    res.status(401).json({
      title: genericErrorTitle + "change-password!",
          message: "New and Old password is the same!" + genericErrorMessage
    });
  }

  Auth.findOne({ _id: id })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: genericErrorTitle + "change-password!",
          message: "User(#" + id + ") not found!" + genericErrorMessage
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.oldPwd, fetchedUser.pwd);
    }).then(result => {
      if (!result) {
        return res.status(401).json({
          title: genericErrorTitle + "change-password!",
          message: "Submitted old password is invalid." + genericErrorMessag
        });
      }

      bcrypt.hash(req.body.newPwd, 10).then(hash => {
        const user = new Auth({
          _id: id,
          pwd: hash
        });

      Auth.updateOne({ _id: id }, user)
        .then(result => {
          if(result.n > 0){
            res.status(200).json({
              message: "User(#" + id +") password changed!"
            });
          }
        }).catch(error => {
          console.log(error);
          res.status(500).json({
            title: genericErrorTitle + "change-password!",
            message: "Unexpected error encountered during changing password." + genericErrorMessage
          });
        });
      });
    }).catch(err => {
      console.log(err);
      return res.status(401).json({
        title: genericErrorTitle + "change-password!",
        message: "Unexpected error encountered during changing password." + genericErrorMessage
      });
    });
}
