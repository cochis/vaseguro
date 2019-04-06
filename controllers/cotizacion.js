'use strict'
var bcript = require('bcrypt-nodejs');
var Cotizacion = require('../models/cotizacion');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');

//registro cotizacion
function saveCotizacion(req,res) {
    var params = req.body;
    var cotizacion = new Cotizacion();
    if (params.nombre && 
        params.apellidoPaterno && 
        params.apellidoMaterno &&
        params.cp &&
        params.marca &&
        params.version &&
        params.modelo) {
            cotizacion.nombre = params.nombre;
            cotizacion.apellidoPaterno = params.apellidoPaterno;
            cotizacion.apellidoMaterno = params.apellidoMaterno;
            cotizacion.marca = params.marca;
            cotizacion.version = params.version;
            cotizacion.modelo = params.modelo;
            cotizacion.validacion = false;
            cotizacion.emitida = false;
            cotizacion.pasos = params.pasos;
            
            //Controlar el usuario duplicado
            cotizacion.save((err,cotizacionStored) => {
                if(err) return res.status(500).send({message: 'Error al hacer la cotizacion'});
                if(cotizacionStored){
                    res.status(200).send({cotizacion: cotizacionStored});
                }else {
                    res.status(404).send({message: 'No se ha registrado la cotizacion'})
                }
            });

            
            
        } else {

            res.status(200).send({
                message:'Envia todos los campos necesarios !!!'  
            });
        }
}


// //buscar un Cotizacion

function getCotizacion (req,res) {
    var cotizacionId = req.params.id;
    Cotizacion.findById(cotizacionId, (err,cotizacion) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!cotizacion) return res.status(404).send({message: 'La Cotizacion no existe!!'});
        return res.status(200).send({cotizacion});
    });
}

// //Buscar todos las cotozaciones

function getCotizaciones(req,res){
	var identity_usuario_id = req.usuario.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Cotizacion.find().sort('_id').paginate(page,itemsPerPage,(err,cotizaciones,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!cotizaciones) return res.status(404).send({
			message: 'No hay cotizaciones disponibles'
		});

		return res.status(200).send({
			cotizaciones,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
function updateCotizacion (req,res) {
    var cotizacionId = req.params.id;
	var update = req.body;

	
	Cotizacion.findOneAndUpdate(cotizacionId,update,{new:true},(err, cotizacionUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!cotizacionUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

		return res.status(200).send({cotizacion: cotizacionUpdated});

	});
    
}


module.exports = {
    saveCotizacion,
    getCotizacion,
    getCotizaciones,
    updateCotizacion
    
}