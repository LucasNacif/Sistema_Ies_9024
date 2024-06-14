class MesaEstado{
    constructor(idMesaEstado, fechaInicio, horaInicio, idMesa, idEstadoMesa) {
        this.idMesaEstado=idMesaEstado;
        this.fechaInicio=fechaInicio;
        this.horaInicio=horaInicio;
        this.idMesa=idMesa;
        this.idEstadoMesa=idEstadoMesa;
    }
}
module.exports(MesaEstado);