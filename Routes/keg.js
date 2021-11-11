const express = require('express');
const api = express.Router();
const kegCtrl = require('../Controllers/kegCtrl')

api.get('/',kegCtrl.getkegs);
api.get('/kegConnected',kegCtrl.getkegConnected);
api.get('/:idKeg',kegCtrl.getkeg);
api.post('/',kegCtrl.createKeg);
api.delete('/:idKeg',kegCtrl.deleteKeg);
api.put('/:idKeg',kegCtrl.updateKeg)
api.put('/connect/:idKeg/',kegCtrl.connect)
api.put('/disconect/:idKeg/',kegCtrl.disconect)
api.put('/empty/:idKeg/',kegCtrl.empty)
api.put('/pay/:idKeg/',kegCtrl.pay)
api.put('/started/:idKeg/',kegCtrl.started)
module.exports = api;