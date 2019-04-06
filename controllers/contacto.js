'use strict'
var bcript = require('bcrypt-nodejs');
var Contacto = require('../models/contacto');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');

//registro cotizacion
function saveContacto(req,res) {
    var params = req.body;
    var contacto = new Contacto();

    if (params.nombre && 
        params.telefono && 
        params.correo ) {
            contacto.nombre = params.nombre;
            contacto.telefono = params.telefono;
            contacto.correo = params.correo;
            contacto.negocio = params.negocio;
            contacto.comentarios = params.comentarios;
            contacto.contactado = false;
            contacto.falso = false;
           
            //Controlar el usuario duplicado
            contacto.save((err,contactoStored) => {
                if(err) return res.status(500).send({message: 'Error al hacer el contacto'});
                if(contactoStored){
                    res.status(200).send({contacto: contactoStored});
                }else {
                    res.status(404).send({message: 'No se ha registrado el contacto'})
                }
            });

            
            
        } else {

            res.status(200).send({
                message:'Envia todos los campos necesarios !!!'  
            });
        }
}


// //buscar un Cotizacion

function getContacto (req,res) {
    var contactoId = req.params.id;
    Contacto.findById(contactoId, (err,contacto) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!contacto) return res.status(404).send({message: 'El contacto no existe!!'});
        return res.status(200).send({contacto});
    });
}

// //Buscar todos las cotozaciones

function getContactos(req,res){
	var identity_usuario_id = req.usuario.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Contacto.find().sort('_id').paginate(page,itemsPerPage,(err,contactos,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!contactos) return res.status(404).send({
			message: 'No hay contactos disponibles'
		});

		return res.status(200).send({
			contactos,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
function updateContacto (req,res) {
    var contactoId = req.params.id;
	var update = req.body;

	Contacto.findOneAndUpdate(contactoId,update,{new:true},(err, ContactoUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!ContactoUpdated) return res.status(404).send({message:'No se ha podido actualizar el contacto'});

		return res.status(200).send({contacto: ContactoUpdated});

	});
    
}


module.exports = {
    saveContacto,
    getContacto,
    getContactos,
    updateContacto
    

}