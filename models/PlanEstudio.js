const mongoose = require('mongoose');

const PlanEstudioSchema = new mongoose.Schema({
    carrera: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrera', }, 
    materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'materia' }], 
    nombre: { type: String, required: true }, 
    fechaAlta: { type: Date, default: Date.now },
    fechaBaja: { type: Date } 
});

module.exports = mongoose.model('PlanEstudio', PlanEstudioSchema);
