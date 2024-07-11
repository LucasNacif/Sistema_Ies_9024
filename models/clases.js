class Alumno {
  constructor(
    numDocAlumn,
    emailAlumm,
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
    this.numDocAlumn = numDocAlumn;
    this.emailAlumm = emailAlumm;
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

  static fromJSON(json) {
    if (json.class == "Alumno") {
      return new Alumno(
        json.numDocAlumn,
        json.emailAlumm,
        json.nombreCompleto,
        json.nombre,
        json.corte,
        json.tituloSecundario,
        json.psicofisico,
        json.partidaNacim,
        json.dniActualizado,
        json.analiticoFiel,
        json.antecedenPen
      );
    }
  }
}


class Usuario {
  constructor(nombre, usuario, pass, token, perfil) {
    this.nombre = nombre;
    this.usuario = usuario;
    this.pass = pass;
    this.token = token;
    this.perfil = perfil;
    this.class = "Usuario";
  }

  static fromJSON(json) {
    if (json.class == "Usuario") {
      let nuevoUsuario = new Usuario();
      nuevoUsuario.nombre = json.nombre;
      nuevoUsuario.usuario = json.usuario;
      nuevoUsuario.pass = json.pass;
      nuevoUsuario.token = json.token;
      nuevoUsuario.perfil = json.perfil;
      nuevoUsuario.class = json.class;

      return nuevoUsuario;
    }
  }
}

class Perfil {
  constructor() {
    this.cuso = [];
  }

  addCasoUso(cu) {
    this.cuso.push(cu);
  }

  delCasoUso(cu) {
    if (this.cuso.includes(cu)) {
      let tmpCuso = this.cuso.filter((x) => x != cu);
      this.cuso = tmpCuso;
    }
  }
}

module.exports = { Alumno, Usuario, Perfil };
