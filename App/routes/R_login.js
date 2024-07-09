const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authentication.js");
const { soloPublico, soloAdmin } = require("../middlewares/authorization.js");

router.get("/register", soloPublico, (req, res) => res.render("register"));
router.get("/admin", soloAdmin, (req, res) => res.render("bedelMenu"));

router.post(`/login`, login);
router.post(`/register`, register);

router.get("/logout", (req, res) => {
  res.clearCookie('jwt')
  res.redirect("/");

  //se hace aqui ya que httpOnly: true hace que no se pueda manejar la cookie con js del front,
  // por eso se envia la peticion al server para que se elimine desde aqui
});

module.exports = router;
