require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const usuariosRoutes = require("./src/routes/usuarios.routes");
const tarefasRoutes = require("./src/routes/tarefas.routes");
const prioridadesRoutes = require("./src/routes/prioridades.routes");
const statusRoutes = require("./src/routes/status.routes");

app.use("/usuario", usuariosRoutes);
app.use("/tarefa", tarefasRoutes);
app.use("/prioridade", prioridadesRoutes);
app.use("/status", statusRoutes);

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
    console.log(`Online em http://localhost:${porta}`);
});