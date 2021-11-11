const express = require('express');
const api = express.Router();
const paymentCtrl = require('../Controllers/paymentCtrl')


api.post('/',paymentCtrl.addPayment);
api.get('/',paymentCtrl.getPayments);
api.get('/:idPayment',paymentCtrl.getPayment);





module.exports = api;