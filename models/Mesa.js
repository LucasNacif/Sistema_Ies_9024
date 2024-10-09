const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mesaSchema = new Schema({
  fechaMesa: Date,
  horaMesa: Number,
  banderaBooleana: Boolean,
  Materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia' },
  Alumno: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', unique: true}],
  estadoActual: { type: String, enum: ['activa', 'suspendida'], default: 'activa' },
});

module.exports = mongoose.model("Mesa", mesaSchema);
