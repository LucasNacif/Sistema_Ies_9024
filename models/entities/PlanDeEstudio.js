const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PlanDeEstudioSchema = new Schema({
    nombrePlan: String,
    fechaAlta : Date,
    fechaBaja : Date,
    carrera: {
        type: Schema.Types.ObjectId,
        ref:"Carrera"
    }
})

class PlanDeEstudio{
    constructor(idPlan, nombrePlan, fechaAlta, fechaBaja, idCarrera) {
        this.idPlan=idPlan;
        this.nombrePlan=nombrePlan;
        this.fechaAlta=fechaAlta;
        this.fechaBaja=fechaBaja;
        this.idCarrera=idCarrera;
    }
}

module.exports = mongoose.model("PlanEstudio", PlanDeEstudioSchema)