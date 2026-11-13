
const API = 'http://localhost:3000';

const enums = {
    A_FAZER: 'A fazer',
    FAZENDO: 'Fazendo',
    PRONTO: 'Pronto',
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta'
};

let tarefas = [];


async function api(caminho, metodo = 'GET', dados = null) {
    const opcoes = {
        method: metodo
    };

    if (dados) {
        opcoes.headers = {
            'Content-Type': 'application/json'
        };

        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(API + caminho, opcoes);

    const resultado = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(resultado.erro || 'Erro na API');
    }

    return resultado;
}


function preencher(seletor, itens, campoTexto, campoValor) {
    const select = document.querySelector(seletor);

    select.innerHTML = '';

    for (const item of itens) {
        const opcao = document.createElement('option');

        opcao.value = campoValor(item);
        opcao.textContent = campoTexto(item);

        select.appendChild(opcao);
    }
}


function mostrarMensagem(texto, erro = false) {
    const mensagem = document.querySelector('#mensagem');

    if (!mensagem) {
        alert(texto);
        return;
    }

    mensagem.textContent = texto;

    if (erro) {
        mensagem.classList.add('erro');
    } else {
        mensagem.classList.remove('erro');
    }
}


async function prepararFormularioTarefa() {
    try {
        const usuarios = await api('/usuario/listar');
        const prioridades = await api('/prioridade/listar');
        const status = await api('/status/listar');

        preencher(
            '[name="usuarioId"]',
            usuarios,
            usuario => usuario.nome,
            usuario => usuario.id
        );

        preencher(
            '[name="prioridade"]',
            prioridades,
            valor => enums[valor],
            valor => valor
        );

        preencher(
            '[name="status"]',
            status,
            valor => enums[valor],
            valor => valor
        );

        const parametros = new URLSearchParams(location.search);
        const id = parametros.get('id');

        if (!id) {
            document.querySelector('[name="status"]').value = 'A_FAZER';
            return;
        }

        const lista = await api('/tarefa/listar');

        const tarefa = lista.find(item => String(item.id) === id);

        if (!tarefa) {
            throw new Error('Tarefa não encontrada');
        }

        const form = document.querySelector('#formTarefa');

        form.dataset.id = id;

        form.elements.descricao.value = tarefa.descricao;
        form.elements.nome_setor.value = tarefa.nome_setor;
        form.elements.usuarioId.value = tarefa.usuarioId;
        form.elements.prioridade.value = tarefa.prioridade;
        form.elements.status.value = tarefa.status;

        document.querySelector('#tituloFormulario').textContent = 'Editar Tarefa';
        document.querySelector('#salvarTarefa').textContent = 'Salvar';

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}


function criarCartao(tarefa) {
    const cartao = document.createElement('article');

    cartao.className = 'cartao';

    let usuario = 'Sem responsável';

    if (tarefa.usuario) {
        usuario = tarefa.usuario.nome;
    }

    cartao.innerHTML = `
        <h4></h4>

        <p></p>

        <span class="prioridade"></span>

        <small></small>

        <div class="botoes">
            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        </div>
    `;

    cartao.querySelector('h4').textContent = tarefa.descricao;

    cartao.querySelector('p').textContent =
        tarefa.nome_setor + ' · ' + usuario;

    cartao.querySelector('.prioridade').textContent =
        'Prioridade: ' + enums[tarefa.prioridade];

    const data = new Date(tarefa.data_cadastro);

    cartao.querySelector('small').textContent =
        data.toLocaleDateString('pt-BR');

    cartao.querySelector('.editar').onclick = function () {
        location.href = `tarefas.html?id=${tarefa.id}`;
    };

    cartao.querySelector('.excluir').onclick = function () {
        excluirTarefa(tarefa.id);
    };

    return cartao;
}


function renderizar() {
    const campoBusca = document.querySelector('#busca');

    const busca = campoBusca.value.toLowerCase();

    const colunas = document.querySelectorAll('.coluna');

    for (const coluna of colunas) {
        const status = coluna.dataset.status;

        const lista = coluna.querySelector('.lista');
        const contador = coluna.querySelector('.contador');

        lista.innerHTML = '';

        let quantidade = 0;

        for (const tarefa of tarefas) {
            let usuario = '';

            if (tarefa.usuario) {
                usuario = tarefa.usuario.nome;
            }

            const texto = (
                tarefa.descricao + ' ' +
                tarefa.nome_setor + ' ' +
                usuario
            ).toLowerCase();

            if (tarefa.status === status && texto.includes(busca)) {
                const cartao = criarCartao(tarefa);

                lista.appendChild(cartao);

                quantidade++;
            }
        }

        contador.textContent = quantidade;
    }
}


async function carregarQuadro() {
    try {
        tarefas = await api('/tarefa/listar');

        renderizar();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}


async function cadastrarUsuario(evento) {
    evento.preventDefault();

    const form = evento.currentTarget;

    const dados = Object.fromEntries(new FormData(form));

    try {
        await api('/usuario/cadastrar', 'POST', dados);

        form.reset();

        mostrarMensagem('Cadastro concluído com sucesso.');

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}


async function salvarTarefa(evento) {
    evento.preventDefault();

    const form = evento.currentTarget;

    const dados = Object.fromEntries(new FormData(form));

    const id = form.dataset.id;

    dados.usuarioId = Number(dados.usuarioId);

    try {
        if (id) {
            await api(`/tarefa/atualizar/${id}`, 'PUT', dados);
        } else {
            await api('/tarefa/cadastrar', 'POST', dados);
        }

        location.href = 'home.html';

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}


async function excluirTarefa(id) {
    const confirmar = confirm('Excluir esta tarefa?');

    if (!confirmar) {
        return;
    }

    try {
        await api(`/tarefa/excluir/${id}`, 'DELETE');

        await carregarQuadro();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}


const formUsuario = document.querySelector('#formUsuario');

if (formUsuario) {
    formUsuario.addEventListener('submit', cadastrarUsuario);
}


const formTarefa = document.querySelector('#formTarefa');

if (formTarefa) {
    formTarefa.addEventListener('submit', salvarTarefa);

    prepararFormularioTarefa();
}


const quadro = document.querySelector('.quadro');

if (quadro) {
    carregarQuadro();
}


const campoBusca = document.querySelector('#busca');

if (campoBusca) {
    campoBusca.addEventListener('input', renderizar);
}
