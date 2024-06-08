const Clases = require("../models/clases.js");
const Modelo = require("../models/modelo.js");

function nuevo(req, res) {
  // Pasar 'req' y 'res' como parámetros
  console.log("--nuevo(data)-->[controlador]");
  // Accedo a los datos del formulario a través de 'req.body'
  console.log(req.body);

  let newAlumno = new Clases.Alumno(
    req.body.nombre,
    parseInt(req.body.cohorte),
    req.body.email,
    req.body.papeles
  );
  /* const AlumnoJson = {
    nombre: newAlumno.nombre,
    cohorte: newAlumno.cohorte,
    email: newAlumno.email,
    papeles: newAlumno.papeles,
  };
  const alumnoJSONString = JSON.stringify(AlumnoJson);*/

  Modelo.guardar(newAlumno);

  // Redirigir al usuario a la página del menú
  res.redirect("/menu");
}

function obtenerAlumnosTxt() {
  console.log("alumnos");
  const alumnos = Modelo.obtenerAlumnos();
  return alumnos;
}

module.exports = { nuevo, obtenerAlumnosTxt };
