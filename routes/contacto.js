'use strict'

var express = require ('express');
var ContactoController = require('../controllers/contacto');
var multipart = require('connect-multiparty');
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');
api.post('/registroContacto',ContactoController.saveContacto);
api.get('/contacto/:id',md_auth.ensureAuth,ContactoController.getContacto);
api.get('/contactos/?:page',md_auth.ensureAuth,ContactoController.getContactos);
api.put('/update-contacto/:id',md_auth.ensureAuth,ContactoController.updateContacto);

module.exports = api;