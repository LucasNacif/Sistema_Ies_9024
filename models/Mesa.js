const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mesaSchema = new Schema({
  fechaMesa: Date,
  horaMesa: Number,
  banderaBoo: Boolean,
  Materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia' },
  estadoActual: { type: String, enum: ['activa', 'suspendida'], default: 'activa' },
});

module.exports = mongoose.model("Mesa", mesaSchema);
