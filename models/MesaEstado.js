const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mesaEstadoSchema = new Schema({
  fechaInicio: Date,
  horaInicio: Number,
  mesa: {
    type: Schema.Types.ObjectId,
    ref: "Mesa",
  },
  estadoMesa: {
    type: Schema.Types.ObjectId,
    ref: "EstadoMesa",
  },
});
//module.exports(MesaEstado);
module.exports = mongoose.model("MesaEstado", mesaEstadoSchema);