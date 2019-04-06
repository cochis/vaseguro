'use strict'

var jwt = require('jwt-simple');

var moment= require('moment');
var secret = 'backend_secret_v@$3gur0';

exports.createToken = function (usuario){
    var payload = {
        sub: usuario._id,
        nombre: usuario.name,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        rol: usuario.rol,
        nick: usuario.nick,
        email: usuario.password,
        password: usuario.password,
        createAt: usuario.createAt,
        image: usuario.image,
        iat: moment().unix(),
        exp: moment().unix(30,'days').unix
    };

    return jwt.encode(payload,secret);
};

    