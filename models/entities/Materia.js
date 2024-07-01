const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MateriaSchema = new Schema({
    nombreMateria: String,
    materCorrel: String,
    EstadoAlumno: [{
        type: Schema.Types.ObjectId,
        ref:"EstadoAlumno",
    }],
    carrera: {
        type: Schema.Types.ObjectId,
        ref:"Carrera"
    }
})

class Materia{
    constructor(idMateria, nombreMateria, materCorrel, idCarrera) {
        this.idMateria=idMateria;
        this.nombreMateria=nombreMateria;
        this.materCorrel=materCorrel;
        this.idCarrera=idCarrera;
    }
}

module.exports = mongoose.model("Materia", MateriaSchema)