
'use strict'
var bcript = require('bcrypt-nodejs');
var Producto = require('../models/producto');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');


function saveProducto(req,res) {
    var params = req.body;
    var producto = new Producto();
       
    if (params.nombre && 
        params.descripcion &&
        params.negocio &&
        params.clave &&
        params.createAt 
         ) {
            producto.nombre = params.nombre;
            producto.descripcion = params.descripcion;
            producto.negocio = params.negocio;
            producto.clave = params.clave;
            producto.createAt = params.createAt;
            

            //Controlar el producto duplicado
            Producto.find({ $or: [
                {clave: producto.clave.toLowerCase()},
                {nombre: producto.nombre.toLowerCase()}
            ]}).exec((err,productos) => {
                if(err) return res.status(500).send({message: 'Error en la peticion de productos'});
                if (productos && productos.length >=1 ){
                    return res.status(500).send({message: 'Ya esta registrado'});
                }
                else {
                    producto.save((err,productoStored) => {
                        
                        if(err) return res.status(500).send({message: 'Error al guardar el producto'});
                        if(productoStored){
                            res.status(200).send({producto: productoStored});
                        }else {
                            res.status(404).send({message: 'No se ha registrado el producto'})
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



//buscar un producto

function getProducto (req,res) {
    var productoId = req.params.id;
    Producto.findById(productoId, (err,producto) => {
        if(err) return res.status(500).send({message: 'Error en la peticion!!'});
        if(!producto) return res.status(404).send({message: 'El producto no existe!!'});
        return res.status(200).send({producto});
    });
}
//Buscar todos los productos

function getProductos(req,res){
	//var identity_usuario_id = req.usuario.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 100;

	Producto.find().sort('_id').paginate(page,itemsPerPage,(err,productos,total)=>{
		if(err) return res.status(500).send({
			message:'Error en la peticion'});
		if(!productos) return res.status(404).send({
			message: 'No hay productos disponibles'
		});

		return res.status(200).send({
			productos,
			total,
			pages: Math.ceil(total/itemsPerPage)				
		});


	});
}
function updateProducto (req,res) {
    var productoId = req.params.id;
	var update = req.body;

	
	Producto.findByIdAndUpdate(productoId,update,{new:true},(err, productoUpdated) => {
		if(err) return res.status(500).send({message:'Error de la peticion'});
		if(!productoUpdated) return res.status(404).send({message:'No se ha podido actualizar el producto'});

		return res.status(200).send({producto: productoUpdated});

	});
    
}



module.exports = {
    saveProducto,
    getProducto,
    getProductos,
    updateProducto,
   
   

}