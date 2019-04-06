'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
//cargar rutas
var usuario_routes = require('./routes/usuario');
var rol_routes = require('./routes/rol');
var aseguradora_routes = require('./routes/aseguradora');
var producto_routes = require('./routes/producto');
var negocio_routes = require('./routes/negocio');
var cotizacion_routes = require('./routes/cotizacion');
var contacto_routes = require('./routes/contacto');
 


//middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//rutas
app.use('/', express.static('client', {redirect:false}));

app.use('/api', usuario_routes);
app.use('/api', rol_routes);
app.use('/api', aseguradora_routes);
app.use('/api', producto_routes);
app.use('/api', negocio_routes );
app.use('/api', cotizacion_routes );
app.use('/api', contacto_routes );

app.get('*',function(req, res, next){
    res.sendFile(path.resolve('client/index.html'));
});

module.exports = app;