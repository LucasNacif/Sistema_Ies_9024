const mongoose = require('mongoose');

const PlanEstudioSchema = new mongoose.Schema({
    materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }],
    alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' }],
    fechaAlta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlanEstudio', PlanEstudioSchema);
