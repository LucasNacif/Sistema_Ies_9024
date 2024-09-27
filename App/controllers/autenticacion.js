const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const Usuario = require('../../models/Usuario');
dotenv.config();

// Función para redirigir según el rol del usuario
const redirigirSegunRol = (usuario, res) => {
  switch (usuario.rol) {
    case 'alumno':
      return res.status(200).send({ status: "ok", redirect: "/mensaExamenAlumno" });
    case 'bedel':
      return res.status(200).send({ status: "ok", redirect: "/Administracion" });
    case 'superAdmin':
      return res.status(200).send({ status: "ok", redirect: "/AdministracionSuperAdmin" });
    default:
      return res.status(403).send({ status: "Error", message: "Rol no reconocido" });
  }
};
exports.login = async (req, res) => {
  const { dni, password } = req.body;

  // Verificar que se reciban los campos requeridos
  if (!dni || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const usuario = await Usuario.findOne({ dni });
    if (!usuario) {
      return res.status(400).send({ status: "Error", message: "Nombre de usuario o contraseña incorrectos" });
    }

    // Comparar la contraseña ingresada con la almacenada
    const loginCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!loginCorrecto) {
      return res.status(400).send({ status: "Error", message: "Nombre de usuario o contraseña incorrectos" });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { dni: usuario.dni, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Configuración de la cookie
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === "production",  Solo enviar cookie en HTTPS en producción
      path: "/"
    };

    // Enviar la cookie al cliente
    res.cookie("jwt", token, cookieOptions);

    return redirigirSegunRol(usuario, res);

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).send({ status: "Error", message: "Ha ocurrido un error" });
  }
};

exports.registrar = async (req, res) => {
  const { dni, email, nombre, password} = req.body;

  if (!dni || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const usuario = await Usuario.findOne({ dni });

    if (usuario) {
      return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
    }

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);

    const nuevoUsuario = new Usuario({
      dni,
      email,
      nombre,
      password: hashPassword,
      rol:'alumno' //tecnicamente este metodo es solo para registrar alumnos, pero capaz lo hago para que un superAdmin registre un bedel
    });

    await nuevoUsuario.save();

     // Crear el token JWT
     const token = jwt.sign(
      { dni: nuevoUsuario.dni, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Configuración de la cookie
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === "production",  Solo enviar cookie en HTTPS en producción
      path: "/"
    };

    // Enviar la cookie al cliente
    res.cookie("jwt", token, cookieOptions);
    res.status(201).send({ status: "ok", message: "Usuario creado correctamente", redirect: "/mesaExamenAlumno" });


//cambiar por:  return res.status(400).send({ status: "Error", message: "Nombre de usuario o contraseña incorrectos" });



  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error interno del servidor" });
  }
}
exports.exit = (req, res) => {
  res.clearCookie("jwt"); // Elimina la cookie jwt
  return res.redirect("/");;
};




