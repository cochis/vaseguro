'use strict'

var express = require ('express');
var CotizacionController = require('../controllers/cotizacion');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/usuarios'});
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');
api.post('/registroCotizacion',CotizacionController.saveCotizacion);
api.get('/cotizacion/:id',md_auth.ensureAuth,CotizacionController.getCotizacion);
api.get('/cotizaciones/?:page',md_auth.ensureAuth,CotizacionController.getCotizaciones);
api.put('/update-cotizacion/:id',md_auth.ensureAuth,CotizacionController.updateCotizacion);


module.exports = api;