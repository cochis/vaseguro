
'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    descripcion: String,
    negocio: {type: Schema.ObjectId, ref:'Negocio'},
    clave: String,
    createAt: String,
    activo: Boolean
});
    

module.exports = mongoose.model('Producto' ,ProductoSchema);