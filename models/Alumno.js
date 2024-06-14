class Alumno {
  constructor(
    idAlumno,
    numDocAlumn,
    nombreCompleto,
    nombre,
    corte,
    tituloSecundario,
    psicofisico,
    partidaNacim,
    dniActualizado,
    analiticoFiel,
    antecedenPen
  ) {
    this.idAlumno = idAlumno;
    this.numDocAlumn = numDocAlumn;
    this.nombreCompleto = nombreCompleto;
    this.nombre = nombre;
    this.corte = corte;
    this.tituloSecundario = tituloSecundario;
    this.psicofisico = psicofisico;
    this.partidaNacim = partidaNacim;
    this.dniActualizado = dniActualizado;
    this.analiticoFiel = analiticoFiel;
    this.antecedenPen = antecedenPen;
  }
}
module.exports(Alumno);
