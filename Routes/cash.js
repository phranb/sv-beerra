const express = require('express')
const api = express.Router()
const Flows = require('../Controllers/InOutFlowCtrl')

api.post('/in',Flows.addInflow)
api.get('/in',Flows.getIN)
api.get('/out',Flows.getOUT)
api.post('/out',Flows.addOutFlow)
api.get('/total',Flows.responseTotal)
api.get('/month',Flows.responseTotalMonth)
api.post('/day',Flows.totalDay)
api.delete('/:id',Flows.deleteInflow)
api.delete('/out/:id',Flows.deleteOutFlow)
module.exports =api