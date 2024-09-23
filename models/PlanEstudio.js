const mongoose = require('mongoose');

const PlanEstudioSchema = new mongoose.Schema({
    carrera: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrera', required: true }, // Referencia a la carrera
    materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'materia' }] // Referencias a las materias
});
class PlanEstudio {
    constructor(carrera, materias = []) {
        this.carrera = carrera; 
        this.materias = materias;
    }
}


module.exports = mongoose.model('PlanEstudio', PlanEstudioSchema);
