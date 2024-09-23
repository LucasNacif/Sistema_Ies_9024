const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carreraSchema = new Schema({
    nombreCarrera: { type: String, required: true },
    titulo: { type: String, required: true },
    cargaHoraria: { type: Number, required: true },
    duracion: { type: Number, required: true },
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno' }],
    planEstudio: [{ type: Schema.Types.ObjectId, ref: 'PlanEstudio' }] 
}) 

module.exports = mongoose.model("Carrera", carreraSchema);


class Carrera {
    constructor(nombreCarrera, titulo, cargaHoraria, duracion, planEstudio = null, alumnos = []) {
        this.nombreCarrera = nombreCarrera;
        this.titulo = titulo;
        this.cargaHoraria = cargaHoraria;
        this.duracion = duracion;
        this.planEstudio = planEstudio;
        this.alumnos = alumnos;
    }
}


module.exports = mongoose.model("Carrera", carreraSchema)