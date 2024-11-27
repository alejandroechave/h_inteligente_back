var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');

// Renderiza la página de login
router.get('/', function (req, res, next) {
  res.render('admin/login', { 
    layout: 'admin/layout', // Plantilla de diseño para admin
  });
});

// Procesa el formulario de login
router.post('/', async (req, res, next) => {
  try {
    var usuario = req.body.usuario; // Usuario ingresado
    var password = req.body.password; // Contraseña ingresada

    // Verifica credenciales en el modelo de usuarios
    var data = await usuariosModel.getUserByUsernameAndPassword(usuario, password);
    
    if (data != undefined) {
      // Almacena datos en la sesión si las credenciales son válidas
      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;

      // Redirige a la página de administración de productos
      res.redirect('/admin/productos');
    } else {
      // Renderiza nuevamente la página de login con mensaje de error
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true // Indica que las credenciales son incorrectas
      });
    }
  } catch (error) {
    console.error(error);
    // En caso de error, renderiza la página de login con mensaje de error genérico
    res.render('admin/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

// Cierra sesión y destruye la sesión activa
router.get('/logout', function (req, res, next) { 
  req.session.destroy(); // Elimina los datos de la sesión
  res.render('admin/login', {
    layout: 'admin/layout'
  });
});

module.exports = router;
