const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// ====================================
// Obtener productos                  =
// ====================================
app.get('/productos', verificaToken, (req, res) => {

    // trear todos los productos
    // populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })

            });


        })

})

// ====================================
// Obtener un producto por id         =
// ====================================
app.get('/productos/:id', verificaToken, (req, res) => {

    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });

            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

})

// ====================================
// Buscar productos                   =
// ====================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                productos
            });

        })

})

// ====================================
// Crear productos                    =
// ====================================
app.post('/productos', verificaToken, (req, res) => {

    //grabar usuario
    //grabar categoria
    let body = req.body;

    let producto = new Producto({

        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })

})

// ====================================
// Actualizar producto                =
// ====================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            });

        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.nombre = body.nombre;

        productoDB.save((err, productoGuardado) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        })


    });

})

// ====================================
// Borrar producto                =
// ====================================
app.delete('/productos/:id', verificaToken, (req, res) => {

    //cambiar disponible a false
    let id = req.params.id;

    let disponibleCambio = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponibleCambio, { new: true }, (err, productoBorrado) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!productoBorrado) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });

        }

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'El producto esta desactivado'
        })

    })

})

module.exports = app;