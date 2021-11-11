const express = require('express');
const api = express.Router();
const containerCtrl = require('../Controllers/containerCtrl')

api.get('/',containerCtrl.getContainers);
api.get('/:idContainer',containerCtrl.getContainer);
api.post('/',containerCtrl.addContainer);
api.delete('/:idContainer',containerCtrl.deleteContainer);
api.put('/:idContainer',containerCtrl.updateContainer)

module.exports = api;