const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const Usuario = require('../../models/Usuario');
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

// Método de registro
exports.registrar = async (req, res) => {
  const { dni, email, nombre, password } = req.body;

  if (!dni || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ dni });
    if (usuarioExistente) {
      return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
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
      rol: 'alumno' //tecnicamente este metodo es solo para registrar alumnos, pero capaz lo hago para que un superAdmin registre un bedel
    });

    await nuevoUsuario.save();

    // Creo el token JWT y configuro la cookie
    const token = crearTokenJWT(nuevoUsuario);
    configurarCookie(res, token);

    return res.status(201).send({ status: "ok", message: "Usuario creado correctamente", redirect: "/mesaExamenAlumno" });

  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).send({ status: "Error", message: "Error interno del servidor" });
  }
};

// Método para cerrar sesión
exports.exit = (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  return res.redirect("/");
};