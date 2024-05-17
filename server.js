const express = require("express");
const path = require('path')
const Handlebars = require('handlebars');
const fs = require('fs');
const Seguridad = require("./seguridad.js");

const app = express();

const Controlador = require('./controlador');

app.use(express.json());
app.use(express.urlencoded({extended : false}))

const port = 3000;

app.use("/", express.static(path.join(__dirname, "/views")));

// Especifica la ubicación de tus archivos .hbs
app.set("views", path.join(__dirname, "views")); // Ruta a la carpeta "views"

let _url = path.join(__dirname,'./views/');


_url = "http://localhost:"+port;

//var objeto = {url : _url+"/login"};
var objeto = {url : _url};
let destino = {url:""}
//------------- zona de ruteo ------------------
app.get('/', (req,res)=>{

     var archivo = fs.readFileSync('./views/index.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})

app.post('/login', (req,res)=>{

    console.log("browser --> server 'post/login'");
    console.log("server --> seguridad 'registrado(req.body)'")

    let registrado = Seguridad.registrado(req.body);
    

    if(registrado==true){
        console.log("server <-r- seguridad 'true'");
        var archivo = fs.readFileSync('./views/menu.hbs','utf-8',(err,data)=>{
            if(err){
                console.log(err);         
            }else{
                //console.log("archivo leído");
            }
        });
        var template = Handlebars.compile(archivo);
        var salida = template(objeto);
        console.log("browser <-r- server 'menu.html'")
        res.send(salida);
    }else{
        console.log("server <-r- seguridad 'false'");
        console.log("browser <-r- server 'Error...!!!.html'")
        res.send("<p>Error...!!!</p>");
    }
})

app.get('/nuevo', (req,res)=>{
    console.log("llegó un post/nuevo");
    
    var archivo = fs.readFileSync('./views/nuevo.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);
})

app.post('/agregar',(req, res)=>{
    console.log("llegó post/agregar");
    console.log(req.body);
    console.log(req.body.afiliado);
    if(req.body.afiliado == undefined){
        req.body.afiliado = false;
    }else{
        req.body.afiliado = true;
    }
    console.log(req.body);
    console.log(req.body.afiliado);
    
    var archivo = fs.readFileSync('./views/menu.hbs','utf-8',(err,data)=>{
        if(err){
            console.log(err);         
        }else{
            console.log("archivo leído");
        }
    });
    var template = Handlebars.compile(archivo);
    var salida = template(objeto);
    res.send(salida);   
})



app.listen(port, ()=>{
    console.log('Escuchando en el puerto ${port}')
});