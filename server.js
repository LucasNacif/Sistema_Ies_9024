require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

//Esto es para usar una collecion y que mongoose la cree en la bd(forma rapida)
const Alumno = require('./models/Alumno');
const AlumnoEstado = require('./models/AlumnoEstado');
const Carrera = require('./models/Carrera');  
const Materia = require('./models/Materia');
const Mesa = require('./models/Mesa');
const PlanEstudio = require('./models/PlanEstudio');
const Usuario = require('./models/Usuario');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const hbs = require('hbs');
// Registrar el helper 'and'
hbs.registerHelper('and', function (...args) {
    return args.every(Boolean);
});
// Helper para formatear fechas
hbs.registerHelper('formatDate', function (date) {
  return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
});

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
const inscripcionRouters = require("./App/routes/R_InscripcionMesas");

// Zona de ruteo
app.use(carreraRouters);
app.use(alumnoRouters);
app.use(loginRouters);
app.use(inscripcionRouters);

app.get("/", (req, res) => res.render("Admin_PanelControl"));
app.get("/index", (req, res) => res.render("index"));
app.get("/alumno", (req, res) => res.render("Admin_PlanEstudio"));
app.get("/mesa", (req, res) => res.render("Admin_Mesa"));
app.get("/materia", (req, res) => res.render("Admin_Materia"));
app.get("/Administracion", (req, res) => res.render("Admin_PanelControl"));
app.get("/AdministracionSuperAdmin", (req, res) => res.render("SuperAdmin_PanelControl"));
app.get("/alumnoMesaExamen", (req, res) => res.render("Alumno_MesaExamen"));
app.get("/alumnoEstado", (req, res) => res.render("Admin_AlumnoEstado"));


// // NO BORRAR QUE ME COSTO UN HUEVO HACERLO :)

// const { verificarSesion, verificarRol } = require('./App/middlewares/autorizacion.js');

// // Ruta del index
// app.get('/', verificarSesion, (req, res) => {
//   if (req.usuario) {
//     return res.redirect(req.usuario.rol === 'alumno' ? '/inscripcion/obtenerMesasSegunAlum' :
//                         req.usuario.rol === 'bedel' ? '/Administracion' :
//                         req.usuario.rol === 'superAdmin' ? '/AdministracionSuperAdmin' : '/');
//   }
//   res.render('index');
// });

// //Ruta de panel de administracion para el Super Admin
// app.get('/AdministracionSuperAdmin', verificarSesion, verificarRol(['superAdmin']), (req, res) => {
//   res.render("SuperAdmin_PanelControl.hbs");
// });

// //Rutas para bedel
// app.get('/Administracion', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
//   res.render("Admin_PanelControl.hbs");
// });
// app.get('/mesa', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
//   res.render('Admin_Mesa');
// });
// app.get('/alumno', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
//   res.render("Admin_Alumno.hbs");
// });
// app.get('/materia', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
//   res.render("Admin_Materia.hbs");
// });
// app.get('/alumnoEstado', verificarSesion, verificarRol(['bedel', 'superAdmin']), (req, res) => {
//   res.render("Admin_AlumnoEstado");
// })

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
