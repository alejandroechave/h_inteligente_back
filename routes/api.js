var express = require('express');
var router = express.Router();
var productosModel = require('./../models/productosModel');
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

router.get('/productos', async function (req, res, next) {
    let productos = await productosModel.getProductos();

    productos = productos.map(producto => {
        if (producto.img_id) {
            const imagen = cloudinary.url(producto.img_id, {
                width: 960,
                height: 200,
                crop: 'fill'
            });
            return {
                ...producto,
                imagen
            };
        } else {
            return {
                ...producto,
                imagen: ''
            };
        }
    });
    res.json(productos);
});

router.post('/contacto', async (req, res) => {
    const mail = {
        to: 'flavia.ursino@gmail.com',
        subject: 'Contacto Web',
        html: `${req.body.nombre} se contactó a través de la web y quiere más información a este correo: ${req.body.email}.<br>Mensaje: ${req.body.mensaje}<br>Su Tel es: ${req.body.telefono}`
    };

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transport.sendMail(mail);
        res.status(201).json({
            error: false,
            message: 'Mensaje enviado'
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({
            error: true,
            message: 'Error al enviar el mensaje'
        });
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var productosModel = require('./../models/productosModel');
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

router.get('/productos', async function (req, res, next) {
    let productos = await productosModel.getProductos();

    productos = productos.map(producto => {
        if (producto.img_id) {
            const imagen = cloudinary.url(producto.img_id, {
                width: 960,
                height: 200,
                crop: 'fill'
            });
            return {
                ...producto,
                imagen
            };
        } else {
            return {
                ...producto,
                imagen: ''
            };
        }
    });
    res.json(productos);
});

router.post('/contacto', async (req, res) => {
    const mail = {
        to: 'alejandroechave@gmail.com',
        subject: 'Contacto Web',
        html: `${req.body.nombre} se contactó a través de la web y quiere más información a este correo: ${req.body.email}.<br>Mensaje: ${req.body.mensaje}<br>Su Tel es: ${req.body.telefono}`
    };

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "14f8a70c4c7c44",
            pass: "16f0d8d60a5c4c"
        }
    });

    try {
        await transport.sendMail(mail);
        res.status(201).json({
            error: false,
            message: 'Mensaje enviado'
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({
            error: true,
            message: 'Error al enviar el mensaje'
        });
    }
});

module.exports = router;
