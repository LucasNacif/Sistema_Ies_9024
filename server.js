require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());

// Configuración del motor de vistas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {

})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((err) => console.error('Error al conectar a MongoDB Atlas:', err));

// Middlewares de autorización
const { soloPublico } = require('./App/middlewares/authorization.js');

// Rutas individuales
//const userRouters = require("./App/routes/R_user");
const loginRouters = require("./App/routes/R_login");
const alumnoRouters = require("./App/routes/R_Alumno");

// Zona de ruteo
app.get("/", soloPublico, (req, res) => res.render('bedelMenu'));
app.get("/nuevo", (req, res) => res.render('nuevoAlumno'));
app.get("/menu", (req, res) => res.render('menu'));
app.get('/listar',  alumnoRouters);

// Rutas individuales
app.use(alumnoRouters);
//app.use(userRouters);
app.use(loginRouters);

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});