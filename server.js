require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const hbs = require("hbs");
const moment = require('moment');

//HELPERS
// Registrar el helper 'and'
hbs.registerHelper("and", function (...args) {
  return args.every(Boolean);
});

// Helper para convertir a JSON
hbs.registerHelper("json", function(context) {
  return JSON.stringify(context);
});

// Helper para mostrar la fecha formateada en la vista
hbs.registerHelper('formatDate', (date) => {
  return moment(date).format('DD/MM/YYYY');
});

// Helper para mostrar la hora y fecha formateada en la vista
hbs.registerHelper('formatDateAndHours', function(date) {
  return moment(date).format('DD/MM/YYYY - HH:mm:ss');  
});

// Registrar un helper para comparación de igualdad
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

// Configuración del motor de vistas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

// Conexion a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar a MongoDB Atlas:", err));

// Zona de ruteo
const alumnoRouters = require("./App/routes/R_Alumno.js");
const carreraRouters = require("./App/routes/R_Carrera.js");
const loginRouters = require("./App/routes/R_login");
const inscripcionRouters = require("./App/routes/R_InscripcionMesas");
const alumnoEstadoRoutes = require("./App/routes/R_alumnoEstado");
const mesaRouters = require("./App/routes/R_Mesa");
const superAdminRouters = require("./App/routes/R_SuperAdmin.js");

app.use(loginRouters);
app.use(inscripcionRouters);
app.use(carreraRouters);
app.use(alumnoRouters);
app.use(alumnoEstadoRoutes);
app.use(mesaRouters);
app.use(superAdminRouters);

//Middlewares
const { verificarSesion, verificarRol } = require('./App/middlewares/autorizacion.js');


// Ruta del index
app.get('/', verificarSesion, (req, res) => {
  if (req.usuario) {
    return res.redirect(req.usuario.rol === 'alumno' ? '/inscripcion/obtenerMesasSegunAlum' :
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

app.get('/alumnoEstado', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
  res.render("Admin_AlumnoEstado");
})

app.listen(port, () => {
  console.log(`Escuchando en el  puerto ${port}`);
});
