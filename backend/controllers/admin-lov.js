const LOV = require('../models/admin-lov');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Admin-LOV-Error: "

exports.add = (req, res, next) => {
  const lov = new LOV({
    code: req.body.code,
    description: req.body.description
  });

  lov.save()
  .then(newRecord => {
    console.log(newRecord);
    res.status(201).json({
      message: "LOV added successfully!",
      lov: {
        ...newRecord,
        id: newRecord._id
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "creation!",
      message: "LOV not created!" + genericErrorMessage
    });
  });
}

exports.update = (req, res, next) => {
  const id = req.body.id;
  const lov = new LOV({
    _id: id,
    code: req.body.name,
    description: req.body.description
  });

  LOV.updateOne({ _id: id }, lov)
  .then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: "LOV(#" + id +") updated!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "update!",
      message: "LOV(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "update!",
      message: "LOV not updated!" + genericErrorMessage
    });
  });
}

exports.delete = (req, res, next) => {
  const id = req.params.id;

  LOV.deleteOne({ _id: id })
  .then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "LOV(#" + id +") deleted!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "delete!",
      message: "LOV(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "delete!",
      message: "LOV not deleted!" + genericErrorMessage
    });
  });
}

exports.getList = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const code = req.query.code;

  let lovQuery = LOV.find().sort({code: 'asc'});
  let fetchedLOVs;

  if(code){
    lovQuery.where('code', code);
  }

  if (pageSize && currentPage) {
    lovQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  lovQuery.then(documents => {
    fetchedLOVs = documents;
    return lovQuery.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "LOVs fetched successfully!",
      lovs: fetchedLOVs,
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
  LOV.findById(id)
  .then(lov => {
    if(lov){
      res.status(200).json(lov);
    }else{
      res.status(404).json({
        title: genericErrorTitle + "fetch-one!",
        message: "LOV(#" + id + ") not found!" + genericErrorMessage
      });
    }
  });
}
