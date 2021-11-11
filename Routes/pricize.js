const express = require('express');
const api = express.Router();
const pricizeCtrl = require('../Controllers/pricizeCtrl')


api.post('/price',pricizeCtrl.addPricize);
api.get('/price',pricizeCtrl.getPricizes);
api.get('/price/:idPricize',pricizeCtrl.getPricize);
api.put('/price/:idPricize',pricizeCtrl.updatePricize);

api.post('/size',pricizeCtrl.addSize);
api.get('/size',pricizeCtrl.getSizes);
api.get('/size/growler',pricizeCtrl.getContainerSize);
api.get('/size/:idSize',pricizeCtrl.getSize);
api.put('/size/:idSize',pricizeCtrl.updateSize);



module.exports = api;