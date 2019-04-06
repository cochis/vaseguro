'use strict'

var express = require ('express');
var RolController = require('../controllers/rol');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/rol'});
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');
api.post('/registroRol',md_auth.ensureAuth,RolController.saveRol);
api.get('/rol/:id',md_auth.ensureAuth,RolController.getRol);
api.get('/rols/?:page',md_auth.ensureAuth,RolController.getRols);
api.put('/update-rol/:id',md_auth.ensureAuth,RolController.updateRol);
module.exports = api;