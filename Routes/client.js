const express = require('express');
const api = express.Router();
const clientCtrl = require('../Controllers/clientCtrl');
api.post('/',clientCtrl.createClient);
api.get('/:idClient',clientCtrl.getClient);
api.get('/',clientCtrl.getClients);
api.put('/:idClient',clientCtrl.updateClient);
api.delete('/:idClient',clientCtrl.deleteClient);
module.exports = api;