const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mesaSchema = new Schema({
  fechaMesa: Date,
  horaMesa: String,
  Materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia' },
  Alumno: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' }], default: [] },
  estadoActual: { type: String, enum: ['activa', 'suspendida'], default: 'activa' },
});


module.exports = mongoose.model("Mesa", mesaSchema);
