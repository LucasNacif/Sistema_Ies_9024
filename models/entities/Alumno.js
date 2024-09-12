const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema
const alumnoSchema = new Schema({
  numDocAlumn: String,
  nombreCompleto: String,
  nombre: String,
  corte: String,
  emailAlumn: String,
  tituloSecundario: { type: Boolean, default: false },
  psicofisico: { type: Boolean, default: false },
  partidaNacim: { type: Boolean, default: false },
  dniActualizado: { type: Boolean, default: false },
  analiticoFiel: { type: Boolean, default: false },
  antecedenPen: { type: Boolean, default: false },
  banderaBooleana: { type: Boolean, default: true},
  AlumnoEstado: [{
    type: Schema.Types.ObjectId,
    ref: "AlumnoEstado",
  }],
});

class Alumno {  
  constructor(
    idAlumno,
    numDocAlumn,
    nombreCompleto,
    nombre,
    corte,
    emailAlumn,
    tituloSecundario,
    psicofisico,
    partidaNacim,
    dniActualizado,
    analiticoFiel,
    antecedenPen,
  ) {
    this.idAlumno = idAlumno;
    this.numDocAlumn = numDocAlumn;
    this.nombreCompleto = nombreCompleto;
    this.nombre = nombre;
    this.corte = corte;
    this.emailAlumn = emailAlumn;
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
const AlumnoModel = mongoose.model('Alumno', alumnoSchema);
module.exports = AlumnoModel;
