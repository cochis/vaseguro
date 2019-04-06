'use strict'
var bcript = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');

//registro usuario
function saveUsuario(req,res) {
    var params = req.body;
    var usuario = new Usuario();
    if (params.nombre && 
        params.apellidoPaterno && 
        params.apellidoMaterno &&
        params.nick &&
        params.rol &&
        params.email &&
        params.password) {
            usuario.nombre = params.nombre;
            usuario.apellidoPaterno = params.apellidoPaterno;
            usuario.apellidoMaterno = params.apellidoMaterno;
            usuario.nick = params.nick;
            usuario.rol = params.rol;
            usuario.email = params.email;
            //Controlar el usuario duplicado
            Usuario.find({ $or: [
                {email: usuario.email.toLowerCase()},
                {nick: usuario.nick.toLowerCase()}
            ]}).exec((err,usuarios) => {
                if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});
                if (usuarios && usuarios.length >=1 ){
                    return res.status(500).send({message: 'Ya esta registrado ese mail o nick'});
                }
                else {
                    //Cifra la password
                    bcript.hash(params.password, null, null, (err,hash) =>{
                        usuario.password = hash;

                        usuario.save((err,usuarioStored) => {
                            if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
                            if(usuarioStored){
                                res.status(200).send({usuario: usuarioStored});
                            }else {
                                res.status(404).send({message: 'No se ha registrado el usuario'})
                            }

                        });
                    });
                    
                }
            });

            
            
        } else {

            res.status(200).send({
                message:'Envia todos los campos necesarios !!!'  
            });
        }
}
//logueo de usuario
function loginUsuario(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    Usuario.findOne({email: email}, (err, usuario) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(usuario){
            bcript.compare(password, usuario.password, (err, check)=> {
                if(check){
                    if(params.token){
                        //devolver token
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        });
                    }else {
                        //devolver datos de usuario
                        usuario.password = undefined;
                        return res.status(200).send({usuario});
                    }
                }else {
                    return res.status(404).send({message: 'El usuario no se ha podido loguear!!'});
                }
            });
        } else {
            return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
        }
    });
}

//buscar un usuario

function getUsuario (req,res) {
    var usuarioId = req.params.id;
    Usuario.findById(usuarioId, (err,usuario) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!usuario) return res.status(404).send({message: 'El usuario no existe!!'});
        return res.status(200).send({usuario});
    });
}

//Buscar todos los usuarios

function getUsuarios(req,res){
	var identity_usuario_id = req.usuario.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Usuario.find().sort('_id').paginate(page,itemsPerPage,(err,usuarios,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!usuarios) return res.status(404).send({
			message: 'No hay usuarios disponibles'
		});

		return res.status(200).send({
			usuarios,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
function updateUsuario (req,res) {
    var usuarioId = req.params.id;
	var update = req.body;

	//borrar password
	delete update.password;
	Usuario.findOneAndUpdate(usuarioId,update,{new:true},(err, usuarioUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!usuarioUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

		return res.status(200).send({usuario: usuarioUpdated});

	});
    
}

function uploadImage (req, res){
    var usuarioId = req.params.id;
	if(req.files){
		var file_path = req.files.image.path;
	
		var file_split = file_path.split('/');
		
		var file_name = file_split[2];
		
		var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(usuarioId != req.usuario.sub) {
            return removeFilesOfUploads(res,file_path,'No tienes permisos para realizar cambios');
        }
		if(file_ext=='png' || file_ext == 'jpg' || file_ext == 'jpeg'|| file_ext == 'gif'){
			//Actualizar documento de usuario logueago
			Usuario.findOneAndUpdate(usuarioId,{image:file_name},{new:true},(err,usuarioId)=>{
				if(err) return res.status(500).send({message:'Error de la peticion'});
				if(!usuarioId) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
				return res.status(200).send({usuario: usuarioId});
			});
		}else {
			//elimninar archivo
			return removeFilesOfUploads(res,file_path,'La extension no es valida');
		}
	}
	else {
		return res.status(200).send({message:'No se han subido archivos'});
	}
}


function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/usuarios/'+image_file;
    // console.log(path_file);
	fs.exists(path_file,(exists)=> {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else {
			res.status(200).send({message:'No existe la imagen'});
		}
	});
}

function removeFilesOfUploads(res,file_path,message){
    //eliminar archivo
        fs.unlink(file_path,(err) => {
            return res.status(200).send({message: message});
        });
    
    }

module.exports = {
    saveUsuario,
    loginUsuario,
    getUsuario,
    getUsuarios,
    updateUsuario,
    uploadImage,
    getImageFile

}