'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;
mongoose.Promise = global.Promise;
//conexion db
mongoose.connect('mongodb://localhost:27017/db_vaseguro', {useNewUrlParser: true})
    .then(()=> {
        console.log('la conexion a la base de datos se realizo');

        //creando servidor
        app.listen(port, ()=> {
            console.log(`Servidor corriendo correctamente en el puerto ${port}`);

        });
    })
    .catch(err => console.log(err));

