require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;


//Esto es para usar una collecion y que mongoose la cree en la bd(forma rapida)
// const Alumno = require('./models/Alumno');
// const Materia = require('./models/Materia');
// const Carrera = require('./models/Carrera');
// const Curso = require('./models/Curso');
// const PlanEstudio = require('./models/PlanEstudio');
// const Usuario = require('./models/Usuario');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Configuración del motor de vistas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((err) => console.error('Error al conectar a MongoDB Atlas:', err));


// Rutas individuales
const alumnoRouters = require("./App/routes/R_Alumno.js");
const carreraRouters = require("./App/routes/R_Carrera.js"); 
const loginRouters = require("./App/routes/R_login");

// Zona de ruteo
app.use(carreraRouters);
app.use(alumnoRouters);
app.use(loginRouters);

// app.get("/", (req, res) => res.render("PanelControl_Admin"));
// app.get("/alumno", (req, res) => res.render("Alumno_Admin.hbs"));
// app.get("/carrera", (req, res) => res.render("PanelControl_Admin"));
// app.get("/mesa", (req, res) => res.render("Mesa_Admin"));
// app.get("/materia", (req, res) => res.render("Materias_Admin"));
// app.get("/index", (req, res) => res.render("index"));

//NO BORRAR QUE ME COSTO UN HUEVO HACERLO---------->
//rutas para ocupar con el login
const { verificarSesion, verificarRol } = require('./App/middlewares/autorizacion.js');

// Ruta del index
app.get('/', verificarSesion, (req, res) => {
  if (req.usuario) {
    return res.redirect(req.usuario.rol === 'alumno' ? '/mensaExamenAlumno' :
                        req.usuario.rol === 'bedel' ? '/Administracion' :
                        req.usuario.rol === 'superAdmin' ? '/AdministracionSuperAdmin' : '/');
  }
  res.render('index');
});

//Ruta de panel de administracion para el Super Admin
app.get('/AdministracionSuperAdmin', verificarSesion, verificarRol(['superAdmin']), (req, res) => {
  res.render("SuperAdmin_PanelControl.hbs");
});

//Rutas para bedel
app.get('/Administracion', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
  res.render("Admin_PanelControl.hbs");
});
app.get('/mesa', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
  res.render('Admin_Mesa');
});
app.get('/alumno', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
  res.render("Admin_Alumno.hbs");
});
app.get('/materia', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
  res.render("Admin_Materia.hbs");
});

//Rutas para alumno
app.get('/mensaExamenAlumno', verificarSesion, verificarRol(['alumno']), (req, res) => {
  res.render('Alumno_MesaExamen');
});


app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});