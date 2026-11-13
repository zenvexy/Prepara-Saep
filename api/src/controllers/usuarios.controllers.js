const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const lista = await prisma.usuario.findMany();
    return res.status(200).json(lista);
};

const cadastrar = async (req, res) => {
    const usuario = req.body;
    const item = await prisma.usuario.create({
        data: usuario
    });
    return res.status(201).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    const item = await prisma.usuario.update({
        where: { id: Number(id) },
        data: dados
    });
    return res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const tarefasAndamento = await prisma.tarefa.count({
        where: { usuarioId: Number(id) }
    });

    if (tarefasAndamento > 0) {
        return res.status(400).json({
            erro: `Não é possível excluir este usuario pois ele possui ${tarefasAndamento} tarefa(s) vinculado(s).`
        });
    }

    const item = await prisma.usuario.delete({
        where: { id: Number(id) }
    });

    return res.status(200).json(item);
};

module.exports = {
    cadastrar,
    listar,
    atualizar,
    excluir
};