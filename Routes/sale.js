const express = require('express')
const api = express.Router()
const saleController = require('../Controllers/saleCtrl')

api.post('/',saleController.createSale)
api.delete('/:idSale',saleController.deleteSale)
api.get('/',saleController.getSales)
api.get('/growlers/:idSale/',saleController.getGrowler)
api.get('/pints/:idSale/',saleController.getPint)
api.get('/bottles/:idSale/',saleController.getBottle)
api.get('/other/:idSale/',saleController.getOther)
api.get('/containers/:idSale/',saleController.getContainer)
api.get('/salesformonth', saleController.salesForMonth)
api.get('/typesformonth', saleController.TypesForMonth)
api.get('/litresformonth', saleController.prueba)
api.get('/litresforbrewery', saleController.litresForBrewery)
api.get('/counter/:idClient/',saleController.getSalesofClient)
api.post('/totalDay',saleController.totalSales)


module.exports = api