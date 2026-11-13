const prisma = require('../src/data/prisma')

async function main() {
    await prisma.$transaction(async (transaction) => {
        await transaction.tarefa.deleteMany()
        await transaction.usuario.deleteMany()

        const usuarios = await Promise.all([
            transaction.usuario.create({
                data: { nome: 'Ana Souza', email: 'ana.souza@empresa.com' }
            }),
            transaction.usuario.create({
                data: { nome: 'Bruno Lima', email: 'bruno.lima@empresa.com' }
            }),
            transaction.usuario.create({
                data: { nome: 'Carla Mendes', email: 'carla.mendes@empresa.com' }
            })
        ])
        console.log('Usuários de teste cadastrados.')

        await Promise.all([
            transaction.tarefa.create({
                data: {
                    descricao: 'Conferir os ingredientes recebidos do fornecedor.',
                    nome_setor: 'Estoque',
                    prioridade: 'ALTA',
                    status: 'A_FAZER',
                    usuarioId: usuarios[0].id
                }
            }),
            transaction.tarefa.create({
                data: {
                    descricao: 'Higienizar a linha de produção antes do próximo lote.',
                    nome_setor: 'Produção',
                    prioridade: 'MEDIA',
                    status: 'FAZENDO',
                    usuarioId: usuarios[1].id
                }
            }),
            transaction.tarefa.create({
                data: {
                    descricao: 'Verificar a temperatura de armazenamento dos produtos.',
                    nome_setor: 'Qualidade',
                    prioridade: 'ALTA',
                    status: 'A_FAZER',
                    usuarioId: usuarios[2].id
                }
            }),
            transaction.tarefa.create({
                data: {
                    descricao: 'Organizar os pedidos para expedição.',
                    nome_setor: 'Expedição',
                    prioridade: 'BAIXA',
                    status: 'PRONTO',
                    usuarioId: usuarios[0].id
                }
            }),
            transaction.tarefa.create({
                data: {
                    descricao: 'Registrar a quantidade produzida no turno.',
                    nome_setor: 'Produção',
                    prioridade: 'MEDIA',
                    status: 'FAZENDO',
                    usuarioId: usuarios[1].id
                }
            }),
            transaction.tarefa.create({
                data: {
                    descricao: 'Revisar as etiquetas dos produtos embalados.',
                    nome_setor: 'Qualidade',
                    prioridade: 'BAIXA',
                    status: 'PRONTO',
                    usuarioId: usuarios[2].id
                }
            })
        ])
        console.log('Tarefas de teste cadastradas.')
    })
}

main()
    .catch((erro) => {
        console.error(erro)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
