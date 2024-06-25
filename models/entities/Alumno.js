const mongoose = require('mongoose');

// Definición del esquema
const alumnoSchema = new mongoose.Schema({
  idAlumno: {
    type: Number,
    required: true,
    unique: true,
  },
  numDocAlumn: {
    type: String,
    required: true,
  },
  emailAlumm: {
    type: String,
    required: true,
    unique: true,
  },
  nombreCompleto: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  corte: {
    type: String,
    required: true,
  },
  tituloSecundario: {
    type: Boolean,
    required: true,
  },
  psicofisico: {
    type: Boolean,
    required: true,
  },
  partidaNacim: {
    type: Boolean,
    required: true,
  },
  dniActualizado: {
    type: Boolean,
    required: true,
  },
  analiticoFiel: {
    type: Boolean,
    required: true,
  },
  antecedenPen: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

// Clase Alumno
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

alumnoSchema.loadClass(Alumno);

// Crear y exportar el modelo
const AlumnoModel = mongoose.model('Alumno', alumnoSchema);
module.exports = AlumnoModel;
