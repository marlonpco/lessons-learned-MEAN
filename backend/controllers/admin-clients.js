const Client = require('../models/admin-clients');

const genericErrorMessage = " Please contact system admin.";
const genericErrorTitle = "Admin-Clients-Error: "

exports.addClient = (req, res, next) => {
  const client = new Client({
    name: req.body.name,
    description: req.body.description
  });

  client.save()
  .then(newRecord => {
    console.log(newRecord);
    res.status(201).json({
      message: "Client added successfully!",
      client: {
        ...newRecord,
        id: newRecord._id
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "creation!",
      message: "Client not created!" + genericErrorMessage
    });
  });
}

exports.updateClient = (req, res, next) => {
  const id = req.body.id;
  const client = new Client({
    _id: id,
    name: req.body.name,
    description: req.body.description
  });

  Client.updateOne({ _id: id }, client)
  .then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({
        message: "Client(#" + id +") updated!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "update!",
      message: "Client(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "update!",
      message: "Client not updated!" + genericErrorMessage
    });
  });
}

exports.deleteClient = (req, res, next) => {
  const id = req.params.id;

  Client.deleteOne({ _id: id })
  .then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "Client(#" + id +") deleted!"
      });
    }else{
      res.status(404).json({
      title: genericErrorTitle + "delete!",
      message: "Client(#" + id + ") not found!" + genericErrorMessage
    });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "delete!",
      message: "Client not deleted!" + genericErrorMessage
    });
  });
}

exports.getClients = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  let clientQuery = Client.find();
  let fetchClients;

  if (pageSize && currentPage) {
    clientQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  clientQuery.then(documents => {
    fetchClients = documents;
    return clientQuery.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Clients fetched successfully!",
      clients: fetchClients,
      count: count
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      title: genericErrorTitle + "fetch!",
      message: "Fetching clients failed!" + genericErrorMessage
    });
  });
}

exports.getClient = (req, res, next) => {
  const id = req.params.id;
  Client.findById(id)
  .then(client => {
    if(client){
      res.status(200).json(client);
    }else{
      res.status(404).json({
        title: genericErrorTitle + "fetch-one!",
        message: "Client(#" + id + ") not found!" + genericErrorMessage
      });
    }
  });
}
