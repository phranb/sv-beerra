const express = require('express');
const api = express.Router();
const breweryCtrl = require('../Controllers/breweryCtrl')

api.post('/',breweryCtrl.createBrewery);
api.get('/:idBrewery',breweryCtrl.getBrewery);
api.get('/',breweryCtrl.getBreweries);
api.put('/:idBrewery',breweryCtrl.updateBrewery);
api.delete('/:idBrewery',breweryCtrl.deleteBrewery);
module.exports = api;