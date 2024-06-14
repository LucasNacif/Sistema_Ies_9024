
class EstadoAlumno {
    constructor(idEstadoALumno, profesorTitular, estadoActual, idAlumno, idMateria) {
        this.idEstadoALumno=idEstadoALumno;
        this.profesorTitular=profesorTitular;
        this.estadoActual=estadoActual;
        this.idAlumno=idAlumno;
        this.idMateria=idMateria;
    }
}
module.exports(EstadoAlumno);