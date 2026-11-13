const express = require("express");

const router = express.Router();

const { listar } = require("../enums/status");

router.get("/listar", listar);

module.exports = router;