'use strict'
var bcript = require('bcrypt-nodejs');
var Negocio = require('../models/negocio');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');

//registro negocio
function saveNegocio(req,res) {
    var params = req.body;
    var negocio = new Negocio();
    if (params.nombre && 
        params.aseguradora && 
        params.descripcion &&
        params.clave &&
        params.createAt ) {
            negocio.nombre = params.nombre;
            negocio.aseguradora = params.aseguradora;
            negocio.descripcion = params.descripcion;
            negocio.clave = params.clave;
            negocio.createAt = params.createAt;
            negocio.image = params.image;
            //Controlar el usuario duplicado
            Negocio.find({ clave: negocio.clave}).exec((err,negocios) => {
                if(err) return res.status(500).send({message: 'Error en la peticion de lineas de negocios'});
                if (negocios && negocios.length >=1 ){
                    return res.status(500).send({message: 'Ya esta registrado la linea de negocio'});
                }
                else {
                    negocio.save((err,negocioStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar la linea de negocio'});
                        if(negocioStored){
                            res.status(200).send({negocio: negocioStored});
                        }else {
                            res.status(404).send({message: 'No se ha registrado la linea de negocio'})
                        }
                    });
                }
            });
        } else {
            res.status(200).send({
                message:'Envia todos los campos necesarios !!!'  
            });
        }
}

//buscar un Negocio
function getNegocio (req,res) {
    var negocioId = req.params.id;
    Negocio.findById(negocioId, (err,negocio) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!negocio) return res.status(404).send({message: 'El negocio no existe!!'});
        return res.status(200).send({negocio});
    });
}

//Buscar todos los usuarios

function getNegocios(req,res){
	//var identity_usuario_id = req.usuario.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Negocio.find().sort('_id').paginate(page,itemsPerPage,(err,negocios,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!negocios) return res.status(404).send({
			message: 'No hay negocios disponibles'
		});

		return res.status(200).send({
			negocios,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
function updateNegocio (req,res) {
    
    var negocioId = req.params.id;
	var update = req.body;
	Negocio.findOneAndUpdate( negocioId,update,{new:true},(err, negocioUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!negocioUpdated) return res.status(404).send({message:'No se ha podido actualizar el negocio'});
		return res.status(200).send({negocio: negocioUpdated});

	});
    
}

function uploadImage (req, res){
    var negocioId = req.params.id;
    
    
	if(req.files){
        
		var file_path = req.files.null.path;
        
		var file_split = file_path.split('/');
		
		var file_name = file_split[2];
		
		var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        // if(usuarioId != req.usuario.sub) {
            
        //     return removeFilesOfUploads(res,file_path,'No tienes permisos para realizar cambios');
         
        // }
		
	

		if(file_ext=='png' || file_ext=='svg' || file_ext == 'jpg' || file_ext == 'jpeg'|| file_ext == 'gif'){
			//Actualizar documento de usuario logueago

			Negocio.findByIdAndUpdate(negocioId,{image:file_name},{new:true},(err,negocioId)=>{
				
				if(err) return removeFilesOfUploads(res,file_path,'Error en la peticion');
				if(!negocioId) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

				return res.status(200).send({usuario: negocioId});

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
	var path_file = './uploads/negocios/'+image_file;
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
    
    saveNegocio,
    getNegocio,
    getNegocios,
    updateNegocio,
    uploadImage,
    getImageFile

}