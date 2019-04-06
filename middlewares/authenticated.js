'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'backend_secret_v@$3gur0';
var Rol = require('../models/rol');
exports.ensureAuth = function (req, res, next) {

    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autentificacion'});
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment.unix()){
            return res.status(401).send({message:'El token ha expirado'});
        }
    }
    catch(ex){
        return res.status(404).send({message:'El token no es valido'});
    }
    Rol.findById(payload.rol, (err,rol) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!rol) return res.status(404).send({message: 'No se encuentra el rol para validacion!!'});
        if(rol.tipo == '1' || rol.tipo == '2'){
            req.usuario = payload;
            next();
        } else {
            return res.status(200).send({message:'El tipo de usuario no tiene permitido el mantenimiento'});
        }
    });

    

};
