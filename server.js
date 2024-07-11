require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require("path");
const Handlebars = require("handlebars");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Configuración
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());

// Rutas individuales
const userRouters = require("./App/routes/R_user");
const loginRouters = require("./App/routes/R_login");

// Configuración del motor de vistas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));
let _url = path.join(__dirname, "./views/");
_url = "http://localhost:" + port;
var objeto = { url: _url };

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((err) => console.error('Error al conectar a MongoDB Atlas:', err));

// Middlewares de autorización
const { soloPublico} = require('./App/middlewares/authorization.js');

// Zona de ruteo
app.get("/", soloPublico, (req, res) => res.render('bedelMenu'));
app.get("/nuevo", (req, res) => res.render('nuevoAlumno'));
app.get("/menu", (req, res) => res.render('menu'));

//Rutas individuales
app.use(userRouters);
app.use(loginRouters);

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});

