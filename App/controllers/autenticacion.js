const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const Usuario = require('../../models/Usuario');
const async = require('hbs/lib/async');
dotenv.config();


// Función para crear un token
const crearTokenJWT = (usuario) => {
  return jwt.sign({ dni: usuario.dni, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  //PARAMETROS:(informacion que va a ir dentro del token) (clave  para firmar el toke) (expiracion del token)
};

// Función para configurar la cookie JWT
const configurarCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    sameSite: 'strict', // esto es para prevenir ataques CSRF
    secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
    httpOnly: true, // Esto es para mejorar la seguridad
    path: "/"
  };
  res.cookie("jwt", token, cookieOptions);
};

// Función para redirigir según el rol del usuario
const redirigirSegunRol = (usuario, res) => {
  switch (usuario.rol) {
    case 'alumno':
      return res.status(200).send({ status: "ok", redirect: "/inscripcion/obtenerMesasSegunAlum/" });
    case 'bedel':
      return res.status(200).send({ status: "ok", redirect: "/Administracion" });
    case 'superAdmin':
      return res.status(200).send({ status: "ok", redirect: "/AdministracionSuperAdmin" });
    default:
      return res.status(403).send({ status: "Error", message: "Rol no reconocido" });
  }
};

// Método de login
exports.login = async (req, res) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const usuario = await Usuario.findOne({ dni });
    if (!usuario) {
      return res.status(400).send({ status: "Error", message: "Nombre de usuario o contraseña incorrectos" });
    }

    // Comparar contraseñas
    const loginCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!loginCorrecto) {
      return res.status(400).send({ status: "Error", message: "Nombre de usuario o contraseña incorrectos" });
    }

    // Creo el token JWT y configuro la cookie
    const token = crearTokenJWT(usuario);
    configurarCookie(res, token);

    // Redirigir
    return redirigirSegunRol(usuario, res);

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).send({ status: "Error", message: "Ha ocurrido un error interno" });
  }
};


// Método de registro para alumnos y bedeles
exports.registrar = async (req, res) => {
  const { dni, email, nombre, password, rol } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Los campos están incompletos" });
  }

    // Validación del DNI
    const dniRegex = /^\d{7,8}$/;
    if (!dni || !dniRegex.test(dni)) {
      return res.status(400).json({ message: "DNI inválido" });
    }

  try {
    const usuarioExistente = await Usuario.findOne({ dni });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Este usuario ya existe" });
    }

    // Hashear contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      dni,
      email,
      nombre,
      password: hashPassword,
      rol: rol === "bedel" ? "bedel" : "alumno"
    });
    await nuevoUsuario.save();

    //  Se hace este if porque si el rol es bedel significa que un super admin esta creando el usuario
    //  por lo que no necesita volver a genera un token ya que ya se encuentra logueado
    if (nuevoUsuario.rol === "alumno") {

      // Creo el token JWT y configuro la cookie
      const token = crearTokenJWT(nuevoUsuario);
      configurarCookie(res, token);

      return redirigirSegunRol(nuevoUsuario, res);

    } else {
      return res.status(200).json({ message: "Bedel creado exitosamente" });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Metodo para traer bedeles
exports.traerBedel = async (req, res) => {
  try {
    const bedel = await Usuario.find({ rol: "bedel" });
    if (!bedel) {
      return res.status(404).json({ message: "No hay bedeles registrados" });
    }
    return res.status(200).json(bedel);
  } catch (error) {
    console.error('Error en traerBedel:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Metodo para eliminar usuarios
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Usuario.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ status: "Error", message: "Bedel no encontrado " });
    }
    res.json({ message: 'Bedel eliminado correctamente' });
  } catch (err) {
    console.error(err)
    res.status(500).json("Error al eliminar un usuario")
  }
};

// Método para cerrar sesión
exports.exit = (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  return res.redirect("/");

};
