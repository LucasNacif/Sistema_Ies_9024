const dotenv = require('dotenv');
const Usuario = require('../../models/Usuario');
const jwt = require('jsonwebtoken');
dotenv.config();

// Middleware para verificar la sesión
const verificarSesion = async (req, res, next) => {
  try {
    let usuarioLogueado = null;
    const token = req.cookies.jwt; // Lee la info de la cookie

    if (!token) {
      return next(); // Si no hay token, sigue de largo
    }

    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);
   
    usuarioLogueado = await Usuario.findOne({ dni: usuarioDecodificado.dni });

    console.log("\n Rol del usuario log: ", usuarioLogueado.rol);

    if (usuarioLogueado) {
      req.usuario = usuarioLogueado;
    }
    next();
  } catch (error) {
    console.error('Error en verificar Sesion:', error.message);
    next();
  }
};
// Middleware para verificar roles
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const usuarioLogueado = req.usuario; // Obtiene el usuario de la solicitud

      if (!usuarioLogueado) {
        console.error("Error: no hay usuario en la solicitud");
        return res.redirect('/'); 
      }

      console.log("Roles del parámetro: ", rolesPermitidos);

      // Verifica si el rol pasado por parámetro es válido
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuarioLogueado.rol)) {
        return res.status(403).render('AccesoDenegado.hbs');
      }

      next(); // Si todo está bien, sigue al siguiente middleware
    } catch (error) {
      console.error('Error en verificarRol:', error.message);
      return res.status(403).render('AccesoDenegado.hbs');
    }
  };
};
const docAlumLogueado = async (req, res) => {
  try {
    const token = req.cookies.jwt; 
    if (!token) {
      return null; 
    }
    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET); 
    return usuarioDecodificado.dni;
    
  } catch (error) {
    console.error('Error al obtener el DNI del alumno logueado:', error.message);
    return null;
  }
};

module.exports = { verificarSesion, verificarRol, docAlumLogueado };
