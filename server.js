require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Handlebars = require("handlebars");
const fs = require("fs");
const userRouters = require("./App/routes/user");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

let _url = path.join(__dirname, "./views/");
_url = "http://localhost:" + port;
var objeto = { url: _url };

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB Atlas:', err));

// Zona de ruteo
app.get("/", (req, res) => {
  var archivo = fs.readFileSync("./views/index.hbs", "utf-8");
  var template = Handlebars.compile(archivo);
  var salida = template(objeto);
  res.send(salida);
});

app.get("/nuevo", (req, res) => {
  console.log("llegó un post/nuevo");
  var archivo = fs.readFileSync("./views/nuevo.hbs", "utf-8");
  var template = Handlebars.compile(archivo);
  var salida = template(objeto);
  res.send(salida);
});

app.get("/menu", (req, res) => {
  var archivo = fs.readFileSync("./views/menu.hbs", "utf-8");
  var template = Handlebars.compile(archivo);
  var salida = template(objeto);
  res.send(salida);
});

app.use(userRouters);

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});


    // app.post("/login", (req, res) => {
    //   console.log("browser --> server 'post/login'");
    //   console.log("server --> seguridad 'registrado(req.body)'");
    
    //   let registrado = Seguridad.registrado(req.body);
    
    //   if (registrado == true) {
    //     console.log("server <-r- seguridad 'true'");
    //     var archivo = fs.readFileSync("./views/menu.hbs", "utf-8", (err, data) => {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         //console.log("archivo leído");
    //       }
    //     });
    //     var template = Handlebars.compile(archivo);
    //     var salida = template(objeto);
    //     console.log("browser <-r- server 'menu.html'");
    //     res.send(salida);
    //   } else {
    //     console.log("server <-r- seguridad 'false'");
    //     console.log("browser <-r- server 'Error...!!!.html'");
    //     res.send("<p>Error...!!!</p>");
    //   }
    // });