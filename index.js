
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const passport = require ('passport');
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(config.db, (err)=>{
    if(err)
        console.log(`Error al conectar la base de datos ${err}`)
    
        console.log("DB conectada")
    app.listen(config.port,()=>{
        console.log("Servidor corriendo en el puerto" + config.port)
    });
});
