'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    nick: String,
    rol: {type: Schema.ObjectId, ref:'Rol'},
    email: String,
    password: String,
    createAt: String,
    image: String,
    activo: Boolean
});

module.exports = mongoose.model('Usuario' ,UsuarioSchema);