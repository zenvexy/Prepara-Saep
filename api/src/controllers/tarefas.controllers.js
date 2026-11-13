const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const lista = await prisma.tarefa.findMany({
        include: { usuario: true }
    });
    return res.status(200).json(lista);
};

const cadastrar = async (req, res) => {
    const tarefa = req.body;

    const item = await prisma.tarefa.create({
        data: tarefa,
        include: { usuario: true }
    });

    return res.status(201).json(item);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.tarefa.findUnique({
        where: { id: Number(id) },
        include: { usuario: true }
    });

    if (!item) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    return res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const tarefaId = Number(id);
    const dados = req.body;

    const tarefa = await prisma.tarefa.findUnique({
        where: { id: tarefaId }
    });

    if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    const item = await prisma.tarefa.update({
        where: { id: tarefaId },
        data: dados,
        include: { usuario: true }
    });

    return res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;
    const tarefaId = Number(id);

    const tarefa = await prisma.tarefa.findUnique({
        where: { id: tarefaId }
    });

    if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    const item = await prisma.tarefa.delete({
        where: { id: tarefaId }
    });

    return res.status(200).json(item);
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};