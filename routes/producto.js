'use strict'

var express = require ('express');
var ProductoController = require('../controllers/producto');
var api = express.Router();
var md_auth  = require('../middlewares/authenticated');
api.post('/registroProducto',md_auth.ensureAuth,ProductoController.saveProducto);
api.get('/producto/:id',ProductoController.getProducto);
api.get('/productos/?:page',ProductoController.getProductos);
api.put('/update-producto/:id',md_auth.ensureAuth,ProductoController.updateProducto);

module.exports = api;