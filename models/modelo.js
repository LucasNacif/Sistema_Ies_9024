const fs = require("fs");
const Clases = require("./clases.js");


function guardarUsuario(data) {
  let str_usuarios = fs.readFileSync("./db/usuarios.txt", "utf-8");
  let usuarios = [];
  if (str_usuarios) {
    usuarios = JSON.parse(str_usuarios);
  }

  usuarios.push(data);
  fs.writeFileSync("./db/usuarios.txt", JSON.stringify(usuarios));
}

function getUsuarios() {
  let str_usuarios = fs.readFileSync("./db/usuarios.txt", "utf-8");
  let usuarios = [];
  if (str_usuarios) {
    usuarios = JSON.parse(str_usuarios);
  }
  let objUsuarios = [];
  usuarios.forEach((x) => objUsuarios.push(Clases.Usuario.fromJSON(x)));

  return objUsuarios;
}

function guardar(data) {
  let str_Alumnos = fs.readFileSync("./dbAlumnos.txt", "utf-8");
  let alumnos = [];
  if (str_Alumnos) {
    alumnos = JSON.parse(str_Alumnos);
  }

  alumnos.push(data);
  fs.writeFileSync("./dbAlumnos.txt", JSON.stringify(alumnos));
}

function obtenerAlumnos() {
  try {
    const str_Alumnos = fs.readFileSync("./dbAlumnos.txt", "utf-8");
    if (!str_Alumnos) {
      console.error("El archivo está vacío o no se pudo leer");
      return [];
    }
    return JSON.parse(str_Alumnos);
    
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    return [];
  }
}
module.exports = { guardar, obtenerAlumnos, guardarUsuario, getUsuarios };
