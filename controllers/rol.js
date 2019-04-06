
'use strict'
var bcript = require('bcrypt-nodejs');
var Rol = require('../models/rol');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');

function saveRol(req,res) {
    var params = req.body;
    var rol = new Rol();

    if (params.nombre
        //  && 
        // params.tipo && 
        // params.descripcion &&
        // params.clave &&
        // params.createAt &&
        // params.image 
        ) {
            rol.nombre = params.nombre;
            rol.tipo = params.tipo;
            rol.descripcion = params.descripcion;
            rol.clave = params.clave;
            rol.createAt = params.createAt;
            rol.image = params.image;
            //Controlar el rol duplicado
            Rol.find({ $or: [
                {clave: rol.clave.toLowerCase()},
                {nombre: rol.nombre.toLowerCase()}
            ]}).exec((err,rols) => {
                if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});
                if (rols && rols.length >=1 ){
                    return res.status(500).send({message: 'Ya esta registrado'});
                }
                else {
                    rol.save((err,rolStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
                        if(rolStored){
                            res.status(200).send({rol: rolStored});
                        }else {
                            res.status(404).send({message: 'No se ha registrado el rol'})
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



//buscar un rol

function getRol (req,res) {
    var rolId = req.params.id;
    Rol.findById(rolId, (err,rol) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!rol) return res.status(404).send({message: 'El rol no existe!!'});
        return res.status(200).send({rol});
    });
}
//Buscar todos los rols

function getRols(req,res){
	var identity_usuario_id = req.usuario.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Rol.find().sort('_id').paginate(page,itemsPerPage,(err,rols,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!rols) return res.status(404).send({
			message: 'No hay roles disponibles'
		});

		return res.status(200).send({
			rols,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
function updateRol (req,res) {
    var rolId = req.params.id;
	var update = req.body;

	
	Rol.findByIdAndUpdate(rolId,update,{new:true},(err, rolUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!rolUpdated) return res.status(404).send({message:'No se ha podido actualizar el rol'});

		return res.status(200).send({rol: rolUpdated});

	});
    
}



module.exports = {
    saveRol,
    getRol,
    getRols,
    updateRol
   

}