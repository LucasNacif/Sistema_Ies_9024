class Alumno {
  constructor(nom, coh, em, pap) {
    this.nombre = nom;
    this.cohorte = coh;
    this.email = em;
    this.papeles = pap;
  }

  static fromJSON(json) {
    if (json.class == "Alumno") {
      let nuevoAlumno = new Alumno();
      nuevoAlumno.nombre = json.nombre;
      nuevoAlumno.cohorte = json.cohorte;
      nuevoAlumno.email = json.email;
      nuevoAlumno.papeles = json.papeles;

      return nuevoAlumno;
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
