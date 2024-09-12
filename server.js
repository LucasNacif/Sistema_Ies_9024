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
app.use(express.static(path.join(__dirname, "public")));
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
const alumnoRouters = require("./App/routes/R_alumno.js");
const loginRouters = require("./App/routes/R_login");

// Zona de ruteo
app.get("/", soloPublico, (req, res) => res.render("index"));
app.get("/alumno", soloPublico, (req, res) => res.render("Alumno_Admin.hbs"));
app.get("/carrera", soloPublico, (req, res) => res.render("Carrera_Adimn"));
app.get("/mesa", soloPublico, (req, res) => res.render("Mesa_Admin"));
app.get("/index", soloPublico, (req, res) => res.render("index"));
app.get("/test", soloPublico, (req, res) => res.render("listarAlumnos"));

app.use(alumnoRouters);
app.use(loginRouters);

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});