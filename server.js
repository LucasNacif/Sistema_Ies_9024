require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;


//Esto es para usar una collecion y que mongoose la cree en la bd(forma rapida)
const Alumno = require('./models/Alumno');
const Materia = require('./models/Materia');
const Carrera = require('./models/Carrera');
const PlanEstudio = require('./models/PlanEstudio');

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
const alumnoRouters = require("./App/routes/R_Alumno.js");
const carreraRouters = require("./App/routes/R_Carrera.js");
const loginRouters = require("./App/routes/R_login");



// Zona de ruteo
app.use(carreraRouters);
app.use(alumnoRouters);
app.use(loginRouters);

app.get("/", soloPublico, (req, res) => res.render("Carrera_Adimn"));
app.get("/alumno", soloPublico, (req, res) => res.render("Alumno_Admin.hbs"));
app.get("/carrera", soloPublico, (req, res) => res.render("Carrera_Adimn"));
app.get("/mesa", soloPublico, (req, res) => res.render("Mesa_Admin"));
app.get("/index", soloPublico, (req, res) => res.render("index"));
app.get("/test", soloPublico, (req, res) => res.render("listarAlumnos"));


app.get("/planEstudio/:id", async (req, res) => {
  try {
       const carrera = await Carrera.findById(req.params.id).populate('plan.materias').populate('alumnos');
      res.render('planEstudio', { carrera });
  } catch (error) {
      res.status(500).send('Error al obtener el plan de estudio');
  }
});


app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});