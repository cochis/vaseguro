'use strict'
var bcript = require('bcrypt-nodejs');
var Aseguradora = require('../models/aseguradora');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');
//registro aseguradora
function saveAseguradora(req,res) {
    var params = req.body;
    var aseguradora = new Aseguradora();
    if (params.nombre && 
        params.descripcion &&
        params.clave &&
        params.createAt &&
        params.rol) {
            aseguradora.nombre = params.nombre;
            aseguradora.descripcion = params.descripcion;
            aseguradora.clave = params.clave;
            aseguradora.createAt = params.createAt;
            aseguradora.rol = params.rol;
            aseguradora.negocio = null;
            
            //Controlar el usuario duplicado
            Aseguradora.find({ clave: aseguradora.clave}).exec((err,aseguradoras) => {
               
                if(err) return res.status(500).send({message: 'Error en la peticion de aseguradoras'});
                if (aseguradoras && aseguradoras.length >=1 ){
                    return res.status(500).send({message: 'Ya esta registrado la aseguradora'});
                }
                else {
                    aseguradora.save((err,aseguradoraStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar la aseguradora'});
                        if(aseguradoraStored){
                            res.status(200).send({aseguradora: aseguradoraStored});
                        }else {
                            res.status(404).send({message: 'No se ha registrado la aseguradora'})
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

//buscar un aseguradora

function getAseguradora (req,res) {
    var aseguradoraId = req.params.id;
    Aseguradora.findById(aseguradoraId, (err,aseguradora) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!aseguradora) return res.status(404).send({message: 'La aseguradora no existe!!'});
        return res.status(200).send({aseguradora});
    });
}
function getNegocioAseguradora (req,res) {
    var negocioId = req.params.id;
    console.log(negocioId);
    var page = 1;
    var itemsPerPage = 100;
    Aseguradora.find({ negocio: negocioId}).sort('_id').paginate(page,itemsPerPage,(err,aseguradoras,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!aseguradoras) return res.status(404).send({
			message: 'No hay usuarios disponibles'
		});

		return res.status(200).send({
			aseguradoras,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
    // Aseguradora.findById({ negocio: negocioId}, (err,aseguradora) => {
    //     if(err) return res.status(500).send({message:  err + 'Error en la peticion!!'});
    //     if(!aseguradora) return res.status(404).send({message: 'La aseguradora o el negocio no existe!!'});
    //     return res.status(200).send({aseguradora});
    // });
}

//Buscar todos los usuarios

function getAseguradoras(req,res){
	
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Aseguradora.find().sort('_id').paginate(page,itemsPerPage,(err,aseguradoras,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!aseguradoras) return res.status(404).send({
			message: 'No hay usuarios disponibles'
		});

		return res.status(200).send({
			aseguradoras,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
    
function updateAseguradora (req,res) {
    var aseguradoraId = req.params.id;
    var update = req.body;
    console.log(update);
	Aseguradora.findByIdAndUpdate(aseguradoraId,update,{new:true},(err, aseguradoraUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!aseguradoraUpdated) return res.status(404).send({message:'No se ha podido actualizar la aseguradora'});
		return res.status(200).send({aseguradora: aseguradoraUpdated});
	});
}
function uploadImage (req, res){
    var aseguradoraId = req.params.id;
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        // if(usuarioId != req.usuario.sub) {
            
        //     return removeFilesOfUploads(res,file_path,'No tienes permisos para realizar cambios');
         
        // }
		if(file_ext=='png' || file_ext=='svg' || file_ext == 'jpg' || file_ext == 'jpeg'|| file_ext == 'gif'){
			//Actualizar documento de usuario logueago
			Aseguradora.findByIdAndUpdate(aseguradoraId,{image:file_name},{new:true},(err,aseguradoraId)=>{
				if(err) return res.status(500).send({message:'Error de la peticion'});
				if(!aseguradoraId) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
				return res.status(200).send({usuario: aseguradoraId});
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
    
	var path_file = './uploads/aseguradoras/'+image_file;
    


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
    saveAseguradora,
    getAseguradora,
    getAseguradoras,
    updateAseguradora,
    uploadImage,
    getImageFile,
    getNegocioAseguradora



}