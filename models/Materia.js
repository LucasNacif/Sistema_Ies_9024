const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
    nombreMateria: { type: String, required: true },
    correlativas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }] // Referencias a las materias correlativas
});

class Materia {
    constructor(nombreMateria, correlativas = []) {
        this.nombreMateria = nombreMateria; 
        this.correlativas = correlativas; 
    }
}


module.exports = mongoose.model('Materia', MateriaSchema);
