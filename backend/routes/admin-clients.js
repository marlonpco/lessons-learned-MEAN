const express = require('express');

const auth = require('../middlewares/authentication');
const ClientsController = require('../controllers/admin-clients');

const router = express.Router();

router.get("", auth, ClientsController.getClients);
router.get("/:id", auth, ClientsController.getClient);
router.post("", auth, ClientsController.addClient);
router.put("/:id", auth, ClientsController.updateClient);
router.delete("/:id", auth, ClientsController.deleteClient);

module.exports = router;
