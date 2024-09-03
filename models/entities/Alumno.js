const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definición del esquema
const alumnoSchema = new Schema({
  numDocAlumn: String,
  emailAlumm: String,
  nombreCompleto: String,
  nombre: String,
  corte: String,
  tituloSecundario: { type: Boolean, default: false },
  psicofisico: { type: Boolean, default: false },
  partidaNacim: { type: Boolean, default: false },
  dniActualizado: { type: Boolean, default: false },
  analiticoFiel: { type: Boolean, default: false },
  antecedenPen: { type: Boolean, default: false },
  Estado: [
    {
      type: Schema.Types.ObjectId,
      ref: "AlumnoEstado",
    },
  ],
});

class Alumno {
  constructor(
    idAlumno,
    numDocAlumn,
    emailAlumm,
    nombreCompleto,
    nombre,
    corte,
    tituloSecundario,
    psicofisico,
    partidaNacim,
    dniActualizado,
    analiticoFiel,
    antecedenPen
  ) {
    this.idAlumno = idAlumno;
    this.numDocAlumn = numDocAlumn;
    this.emailAlumm = emailAlumm;
    this.nombreCompleto = nombreCompleto;
    this.nombre = nombre;
    this.corte = corte;
    this.tituloSecundario = tituloSecundario;
    this.psicofisico = psicofisico;
    this.partidaNacim = partidaNacim;
    this.dniActualizado = dniActualizado;
    this.analiticoFiel = analiticoFiel;
    this.antecedenPen = antecedenPen;
  }
}

// alumnoSchema.loadClass(Alumno); esto sirve para manipular el schema
// como clase de node

// Crear y exportar el modelo
const AlumnoModel = mongoose.model("Alumno", alumnoSchema);
module.exports = AlumnoModel;
