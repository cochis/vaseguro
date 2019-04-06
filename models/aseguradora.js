
'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AseguradoraSchema = Schema({
    nombre: String,
    descripcion: String,
    clave: String,
    createAt: String,
    image: String,
    rol: {type: Schema.ObjectId, ref:'Rol'},
    negocio: {type: Schema.ObjectId, ref:'Negocio'},
    activo: Boolean
});
    

module.exports = mongoose.model('Aseguradora' ,AseguradoraSchema);