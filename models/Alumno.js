const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alumnoSchema = new Schema({
  numDocAlumn: { type: String, unique: true },
  nombreCompleto: String,
  corte: String,
  emailAlumn: String,
  curso: { type: String, enum: ['Primero', 'Segundo', 'Tercero', 'Cuarto'] },
  tituloSecundario: { type: Boolean, default: false },
  psicofisico: { type: Boolean, default: false },
  partidaNacim: { type: Boolean, default: false },
  dniActualizado: { type: Boolean, default: false },
  analiticoFiel: { type: Boolean, default: false },
  antecedenPen: { type: Boolean, default: false },
  banderaBooleana: { type: Boolean, default: true },
});

module.exports = mongoose.model("Alumno", alumnoSchema)
