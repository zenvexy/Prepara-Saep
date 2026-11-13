const express = require("express");

const router = express.Router();

const { listar } = require("../enums/prioridades");

router.get("/listar", listar);

module.exports = router;