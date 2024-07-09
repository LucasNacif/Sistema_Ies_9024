const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

dotenv.config();

const usuarios = [{
  user: "a",
  email: "a@a.com",
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2"
}]


async function login(req,res){
  
  const user = req.body.user;
  const password = req.body.password;

  if(!user || !password){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }

  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if(!usuarioAResvisar){
    return res.status(400).send({status:"Error",message:"Error durante login, el usuario no es igual"})
  }

  const loginCorrecto = await bcryptjs.compare(password,usuarioAResvisar.password);
  if(!loginCorrecto){
    return res.status(400).send({status:"Error",message:"Error durante login, la pass no es igual"})
  }

  const token = jsonwebtoken.sign(
    {user:usuarioAResvisar.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});


    if (process.env.NODE_ENV === 'production') {
      // Configuración específica para producción
      message = ('production')
  } else {
      // Configuración para otros entornos (desarrollo, pruebas, etc.)
      message = ('desarrollo')
  }

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      // httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === "production", // Solo enviar cookie en HTTPS en producción pa que se pueda desde el localHost
      path: "/"
    }
    res.cookie("jwt", token, cookieOption);

    return res.status(200).send({ status: "ok", message , redirect: "/admin" });
  }


  //FALTA HACER QUE LO LEA DEL TXT A LOS USERS Y SI NO ESTAN QUE LOS META AL TXT
async function register(req,res){
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;
  if(!user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }

  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if(usuarioAResvisar){
    return res.status(400).send({status:"Error",message:"Este usuario ya existe"})
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password,salt);
  const nuevoUsuario ={
    user, email, password: hashPassword
  }

  usuarios.push(nuevoUsuario);
  console.log(usuarios);
  return res.status(200).send({status:"ok",message:"Usuario creado correctamente",redirect: "/admin"  })
}

module.exports = {
  usuarios,
  login,
  register
};