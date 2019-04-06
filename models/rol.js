'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RolSchema = Schema({
    nombre: String,
    tipo: String,
    descripcion: String,
    clave: String,
    createAt: String,
    image: String,
    activo: Boolean
});
    

module.exports = mongoose.model('Rol' ,RolSchema);