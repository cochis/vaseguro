'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContactoSchema = Schema({
    nombre: String,
    telefono: String,
    correo: String,
    negocio: Number,
    comentarios: String,
    contactado: Boolean,
    falso: Boolean
    });

module.exports = mongoose.model('Contacto' ,ContactoSchema);