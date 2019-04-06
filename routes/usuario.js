'use strict'

var express = require ('express');
var UsuarioController = require('../controllers/usuario');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/usuarios'});
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');
api.post('/registro',md_auth.ensureAuth,UsuarioController.saveUsuario);
api.post('/login',UsuarioController.loginUsuario);
api.get('/usuario/:id',md_auth.ensureAuth,UsuarioController.getUsuario);
api.get('/usuarios/?:page',md_auth.ensureAuth,UsuarioController.getUsuarios);
api.put('/update-usuario/:id',md_auth.ensureAuth,UsuarioController.updateUsuario);
api.post('/upload-image-usuario/:id',[md_auth.ensureAuth, md_upload],UsuarioController.uploadImage);
api.get('/get-image-usuario/:imageFile',UsuarioController.getImageFile);

module.exports = api;