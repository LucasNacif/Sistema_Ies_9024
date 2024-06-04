const fs = require('fs')
const Clases = require('./clases.js')

function guardarUsuario(data){

    let str_usuarios = fs.readFileSync('./db/usuarios.txt','utf-8')
    let usuarios = []
    if(str_usuarios){
        usuarios = JSON.parse(str_usuarios)
    }
    
    usuarios.push(data)
    fs.writeFileSync('./db/usuarios.txt',JSON.stringify(usuarios))
}

function getUsuarios(){    
 
    let str_usuarios = fs.readFileSync('./db/usuarios.txt','utf-8')
    let usuarios = []
    if(str_usuarios){ 
        usuarios = JSON.parse(str_usuarios);
    }
    let objUsuarios = [];
    usuarios.forEach(x=>objUsuarios.push(Clases.Usuario.fromJSON(x)))

    return objUsuarios;

}

function guardar(data){

    let str_mercaderias = fs.readFileSync('./db.txt','utf-8')
    let mercaderias = []
    if(str_mercaderias){
        mercaderias = JSON.parse(str_mercaderias)
    }
    
    mercaderias.push(data)
    fs.writeFileSync('./db.txt',JSON.stringify(mercaderias))
}

function obtener(){

    let str_mercaderias = fs.readFileSync('./db.txt','utf-8')
    let mercaderias = []
    if(str_mercaderias){
        mercaderias = JSON.parse(str_mercaderias)
    }

    return mercaderias;

}

module.exports = {guardar, obtener, guardarUsuario, getUsuarios}