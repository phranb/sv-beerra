const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiKeg = require('./Routes/keg');
const apiCash = require('./Routes/cash')
const apiPricize = require('./Routes/pricize')
const apiBrewery = require('./Routes/brewery')
const apiPipe = require('./Routes/pipe');
const apiBottle = require('./Routes/bottle');
const apiSale = require('./Routes/sale');
const apiPayment = require ('./Routes/payment');
const apiClient = require('./Routes/client')
const apiOutflow = require('./Routes/outflow');
const apiContainer = require('./Routes/container')
const api = require('./Routes/index')
const cors = require('cors');
const auth = require('./Middelwares/auth1')



app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(cors());
app.use(auth.checkTocken)

app.use('/',api);

app.use('/keg',auth.isLoggedIN,apiKeg);
app.use('/cash',auth.isLoggedIN,apiCash);
app.use('/payment',auth.isLoggedIN,apiPayment);
app.use('/outflow',apiOutflow);
app.use('/bottle',auth.isLoggedIN,apiBottle);
app.use('/clients',apiClient);
app.use('/pipe',auth.isLoggedIN,apiPipe);
app.use('/brewery',auth.isLoggedIN,apiBrewery);
app.use('/pricize',auth.isLoggedIN,apiPricize);
app.use('/sale',auth.isLoggedIN,apiSale);
app.use('/container',auth.isLoggedIN,apiContainer)
app.use(errorHandling)

function errorHandling(error,req,res,next){

    res.status( error.status || 500)
    res.send(error.message)
}

module.exports = app;