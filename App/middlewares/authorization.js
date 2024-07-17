const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const { usuarios } = require('../controllers/authentication.js');

dotenv.config();

function revisarCookie(req) {
    try {
      const cookieJWT = req.cookies.jwt;
      if (!cookieJWT) {
        return false;
      }
      const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
      const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
      return !! usuarioAResvisar
    } catch (error) {
      console.error('Error al verificar cookie:', error);
      return false;
    }
  }

function soloAdmin(req, res, next) {
    const logueado = revisarCookie(req);
    if (logueado) {
        return next();
    }
    return res.redirect("/");
}

function soloPublico(req, res, next) {
    const logueado = revisarCookie(req);
    if (!logueado) {
      return next(); 
    }
    return res.redirect("/admin");
  }

module.exports = {
    soloAdmin,
    soloPublico,
    revisarCookie
};
