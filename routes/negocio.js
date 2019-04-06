'use strict'

var express = require ('express');
var NegocioController = require('../controllers/negocio');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/negocios'});
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');

api.post('/registroNegocio',md_auth.ensureAuth,NegocioController.saveNegocio);
api.get('/negocio/:id',NegocioController.getNegocio);
api.get('/negocios/?:page',NegocioController.getNegocios);
api.put('/update-negocio/:id',md_auth.ensureAuth,NegocioController.updateNegocio);
api.post('/upload-image-negocio/:id',[md_auth.ensureAuth, md_upload],NegocioController.uploadImage);
api.get('/get-image-negocio/:imageFile',NegocioController.getImageFile);

module.exports = api;