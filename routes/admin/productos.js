var express = require('express');
var router = express.Router();
var productosModel = require('../../models/productosModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);

// Middleware para verificar si el usuario está autenticado
function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.nombre) {
        next(); // El usuario está autenticado, continúa
    } else {
        res.redirect('/admin/login'); // Redirige al login si no está autenticado
    }
}

// Ruta principal para productos con middleware de autenticación
router.get('/', async function (req, res, next) {
    var productos = await productosModel.getProductos();
    productos = productos.map(producto => {
        if (producto.img_id) {
            const imagen = cloudinary.url(producto.img_id, {
                width: 100,
                height: 100,
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

    res.render('admin/productos', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        productos
    });
});

// Ruta para mostrar el formulario de agregar producto
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

// Ruta para procesar el formulario de agregar producto
router.post('/agregar', async (req, res, next) => {
    try {
        var img_id = '';
        if (req.files && Object.keys(req.files).length > 0) {
            const imagen = req.files.imagen;
            const result = await uploader(imagen.tempFilePath);
            img_id = result.public_id;
        }

        if (req.body.titulo != "" && req.body.descripcion != "") {
            await productosModel.insertProducto({ ...req.body, img_id }); // Inserta el producto en la base de datos
            res.redirect('/admin/productos');
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se pudo cargar el producto'
        });
    }
});

// Ruta para editar un producto (GET)
router.get('/editar/:id', verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await productosModel.getProductoById(id);
        if (producto) {
            const imagen = cloudinary.url(producto.img_id, {
                width: 100,
                height: 100,
                crop: 'fill'
            });
            res.render('admin/editar', {
                layout: 'admin/layout',
                producto: {...producto, imagen}
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar el producto');
    }
});

// Ruta para actualizar un producto (POST)
router.post('/editar/:id', verificarAutenticacion, async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    let img_id = req.body.img_id;

    if (!titulo || !descripcion) {
        return res.render('admin/editar', {
            layout: 'admin/layout',
            producto: { id, titulo, descripcion, img_id },
            error: true,
            message: 'Todos los campos son requeridos'
        });
    }

    try {
        if (req.files && Object.keys(req.files).length > 0) {
            const imagen = req.files.imagen;
            const result = await uploader(imagen.tempFilePath);
            img_id = result.public_id;
        } else {
            const producto = await productosModel.getProductoById(id);
            img_id = producto.img_id; // Mantener la imagen actual si no se sube una nueva
        }

        await productosModel.updateProducto(id, { titulo, descripcion, img_id });
        res.redirect('/admin/productos');
    } catch (error) {
        console.log(error);
        res.render('admin/editar', {
            layout: 'admin/layout',
            producto: { id, titulo, descripcion, img_id },
            error: true,
            message: 'Error al actualizar el producto'
        });
    }
});

// Ruta para eliminar un producto (GET)
router.get('/eliminar/:id', verificarAutenticacion, async (req, res, next) => {
    const { id } = req.params;
    try {
        await productosModel.deleteProductoById(id);
        res.redirect('/admin/productos');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar el producto');
    }
});

module.exports = router;
