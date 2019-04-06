'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CotizacionSchema = Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    cp: Number,
    marca: String,
    version: String,
    modelo: String,
    createAt: String,
    validacion: Boolean,
    emitida: Boolean,
    producto: {type: Schema.ObjectId, ref:'Producto'},
    activo: Boolean,
    pasos:String

    });

module.exports = mongoose.model('Cotizacion' ,CotizacionSchema);