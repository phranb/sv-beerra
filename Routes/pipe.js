const express = require('express');
const api = express.Router();
const pipeCtrl = require('../Controllers/pipeCtrl')

api.get('/',pipeCtrl.getpipes);
api.put('/:idPipe',pipeCtrl.updatePipe)
module.exports = api;