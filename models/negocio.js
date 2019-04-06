
'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NegocioSchema = Schema({
    nombre: String,
    aseguradora: {type: Schema.ObjectId, ref:'Aseguradora'},
    descripcion: String,
    clave: String,
    createAt: String,
    image: String,
    activo: Boolean
});
    

module.exports = mongoose.model('Negocio' ,NegocioSchema);