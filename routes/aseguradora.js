'use strict'

var express = require ('express');
var AseguradoraController = require('../controllers/aseguradora');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/aseguradoras'});
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');

api.post('/registroAseguradora',md_auth.ensureAuth,AseguradoraController.saveAseguradora);
api.get('/aseguradora/:id',AseguradoraController.getAseguradora);
api.get('/negocios-aseguradora/:id',AseguradoraController.getNegocioAseguradora);
api.get('/aseguradoras/?:page',AseguradoraController.getAseguradoras);
api.put('/update-aseguradora/:id',AseguradoraController.updateAseguradora);
api.post('/upload-image-aseguradora/:id',[md_auth.ensureAuth, md_upload],AseguradoraController.uploadImage);
api.get('/get-image-aseguradora/:imageFile',AseguradoraController.getImageFile);

module.exports = api;