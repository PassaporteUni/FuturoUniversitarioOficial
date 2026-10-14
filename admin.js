"use strict";

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* ==================================================
   ELEMENTOS DE ACESSO
================================================== */

const estadoCarregando =
    document.getElementById(
        "admin-carregando"
    );

const estadoNegado =
    document.getElementById(
        "admin-negado"
    );

const conteudoAdmin =
    document.getElementById(
        "admin-conteudo"
    );

const mensagemNegado =
    document.getElementById(
        "mensagem-admin-negado"
    );

const identificacaoAdmin =
    document.getElementById(
        "identificacao-admin"
    );

const botaoSair =
    document.getElementById(
        "btn-sair-admin"
    );


/* ==================================================
   ELEMENTOS DO CALENDÁRIO
================================================== */

const botaoAbrirCalendario =
    document.getElementById(
        "btn-gerenciar-calendario"
    );

const botaoFecharCalendario =
    document.getElementById(
        "btn-fechar-gerenciador-calendario"
    );

const gerenciadorCalendario =
    document.getElementById(
        "gerenciador-calendario-admin"
    );

const formularioEvento =
    document.getElementById(
        "form-evento-admin"
    );

const campoId =
    document.getElementById(
        "evento-admin-id"
    );

const campoTitulo =
    document.getElementById(
        "evento-admin-titulo"
    );

const campoDescricao =
    document.getElementById(
        "evento-admin-descricao"
    );

const campoData =
    document.getElementById(
        "evento-admin-data"
    );

const campoCategoria =
    document.getElementById(
        "evento-admin-categoria"
    );

const campoInstituicao =
    document.getElementById(
        "evento-admin-instituicao"
    );

const campoProcessoId =
    document.getElementById(
        "evento-admin-processo-id"
    );

const campoPeriodoInicio =
    document.getElementById(
        "evento-admin-periodo-inicio"
    );

const campoPeriodoFim =
    document.getElementById(
        "evento-admin-periodo-fim"
    );

const campoAbertoAte =
    document.getElementById(
        "evento-admin-aberto-ate"
    );

const campoUrlOficial =
    document.getElementById(
        "evento-admin-url-oficial"
    );

const botaoCancelarEdicao =
    document.getElementById(
        "btn-cancelar-edicao-evento"
    );

const botaoSalvarEvento =
    document.getElementById(
        "btn-salvar-evento-admin"
    );

const tituloFormulario =
    document.getElementById(
        "titulo-form-evento-admin"
    );

const mensagemCalendario =
    document.getElementById(
        "mensagem-calendario-admin"
    );

const listaEventos =
    document.getElementById(
        "lista-eventos-admin"
    );

const contadorEventos =
    document.getElementById(
        "contador-eventos-admin"
    );

const pesquisaEventos =
    document.getElementById(
        "pesquisa-eventos-admin"
    );


/* ==================================================
   ESTADO
================================================== */

let eventosCalendario = [];

let eventoEmEdicao = null;

let pararObservacaoEventos = null;


/* ==================================================
   PROTEÇÃO ADMINISTRATIVA
================================================== */

function esconderEstados() {
    estadoCarregando.hidden = true;
    estadoNegado.hidden = true;
    conteudoAdmin.hidden = true;
}


function mostrarAcessoNegado(
    mensagem
) {
    esconderEstados();

    mensagemNegado.textContent =
        mensagem;

    estadoNegado.hidden = false;
}


function redirecionarParaLogin() {
    const urlLogin =
        new URL(
            "./pages/login.html",
            import.meta.url
        );

    urlLogin.searchParams.set(
        "voltar",
        window.location.href
    );

    window.location.replace(
        urlLogin.href
    );
}


async function verificarAdministrador(
    usuario
) {
    const referencia =
        doc(
            db,
            "administradores",
            usuario.uid
        );

    const resultado =
        await getDoc(referencia);

    return (
        resultado.exists() &&
        resultado.data().ativo === true
    );
}


/* ==================================================
   FUNÇÕES AUXILIARES
================================================== */

function normalizarIdentificador(
    texto
) {
    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        )
        .slice(
            0,
            100
        );
}


function escaparHtml(
    valor
) {
    return String(valor || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatarData(
    dataTexto
) {
    if (!dataTexto) {
        return "Sem data";
    }

    const partes =
        dataTexto.split("-");

    const data =
        new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );

    return data.toLocaleDateString(
        "pt-BR"
    );
}


function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {
    if (!mensagemCalendario) {
        return;
    }

    mensagemCalendario.textContent =
        texto;

    mensagemCalendario.className =
        `mensagem-calendario-admin mensagem-${tipo}`;

    mensagemCalendario.hidden =
        false;
}


function limparMensagem() {
    if (mensagemCalendario) {
        mensagemCalendario.hidden =
            true;
    }
}


/* ==================================================
   LISTAGEM DOS EVENTOS
================================================== */

function renderizarEventos() {
    if (!listaEventos) {
        return;
    }

    const termo =
        String(
            pesquisaEventos?.value || ""
        )
            .trim()
            .toLowerCase();

    const eventosFiltrados =
        eventosCalendario.filter(
            function (evento) {
                return [
                    evento.titulo,
                    evento.instituicao,
                    evento.categoria,
                    evento.data
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(termo);
            }
        );

    contadorEventos.textContent =
        `${eventosFiltrados.length} de ${eventosCalendario.length} evento(s)`;

    listaEventos.innerHTML = "";

    if (
        eventosFiltrados.length === 0
    ) {
        listaEventos.innerHTML = `
            <p class="lista-eventos-admin-vazia">
                Nenhum evento encontrado.
            </p>
        `;

        return;
    }

    eventosFiltrados.forEach(
        function (evento) {
            const item =
                document.createElement(
                    "article"
                );

            item.className =
                "item-evento-admin";

            item.innerHTML = `
                <div class="data-item-evento-admin">
                    ${escaparHtml(
                        formatarData(
                            evento.data
                        )
                    )}
                </div>

                <div class="conteudo-item-evento-admin">

                    <span>
                        ${escaparHtml(
                            evento.categoria ||
                            "evento"
                        )}
                    </span>

                    <h3>
                        ${escaparHtml(
                            evento.titulo ||
                            "Evento sem título"
                        )}
                    </h3>

                    <p>
                        ${escaparHtml(
                            evento.instituicao ||
                            "Instituição não informada"
                        )}
                    </p>

                </div>

                <div class="acoes-item-evento-admin">

                    <button
                        type="button"
                        data-acao="editar"
                        data-id="${encodeURIComponent(
                            evento.id
                        )}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="botao-excluir-evento-admin"
                        data-acao="excluir"
                        data-id="${encodeURIComponent(
                            evento.id
                        )}"
                    >
                        Excluir
                    </button>

                </div>
            `;

            listaEventos.appendChild(
                item
            );
        }
    );
}


function iniciarObservacaoEventos() {
    if (
        pararObservacaoEventos ||
        !listaEventos
    ) {
        return;
    }

    pararObservacaoEventos =
        onSnapshot(
            collection(
                db,
                "eventosCalendario"
            ),

            function (resultado) {
                eventosCalendario =
                    resultado.docs
                        .map(
                            function (
                                documento
                            ) {
                                return {
                                    id:
                                        documento.id,

                                    ...documento.data()
                                };
                            }
                        )
                        .sort(
                            function (
                                eventoA,
                                eventoB
                            ) {
                                return String(
                                    eventoA.data ||
                                    ""
                                ).localeCompare(
                                    String(
                                        eventoB.data ||
                                        ""
                                    )
                                );
                            }
                        );

                renderizarEventos();
            },

            function (erro) {
                console.error(
                    "Erro ao carregar eventos no ADMIN:",
                    erro
                );

                mostrarMensagem(
                    "Não foi possível carregar os eventos.",
                    "erro"
                );
            }
        );
}


/* ==================================================
   EDIÇÃO
================================================== */

function preencherFormulario(
    evento
) {
    eventoEmEdicao =
        evento;

    tituloFormulario.textContent =
        "Editar evento";

    campoId.value =
        evento.id;

    campoId.disabled =
        true;

    campoTitulo.value =
        evento.titulo || "";

    campoDescricao.value =
        evento.descricao || "";

    campoData.value =
        evento.data || "";

    campoCategoria.value =
        evento.categoria || "evento";

    campoInstituicao.value =
        evento.instituicao || "";

    campoProcessoId.value =
        evento.processoId || "";

    campoPeriodoInicio.value =
        evento.periodoInicio || "";

    campoPeriodoFim.value =
        evento.periodoFim || "";

    campoAbertoAte.value =
        evento.abertoAte || "";

    campoUrlOficial.value =
        evento.urlOficial || "";

    botaoCancelarEdicao.hidden =
        false;

    gerenciadorCalendario.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );
}


function limparFormulario() {
    eventoEmEdicao =
        null;

    formularioEvento.reset();

    campoId.disabled =
        false;

    delete campoId.dataset
        .editadoManualmente;

    tituloFormulario.textContent =
        "Cadastrar evento";

    botaoCancelarEdicao.hidden =
        true;
}


/* ==================================================
   SALVAR
================================================== */

async function salvarEvento(
    eventoSubmit
) {
    eventoSubmit.preventDefault();

    limparMensagem();

    const documentoId =
        eventoEmEdicao?.id ||
        normalizarIdentificador(
            campoId.value ||
            campoTitulo.value
        );

    if (!documentoId) {
        mostrarMensagem(
            "Informe um identificador para o evento.",
            "erro"
        );

        return;
    }

    const idJaExiste =
        eventosCalendario.some(
            function (evento) {
                return (
                    evento.id ===
                    documentoId
                );
            }
        );

    if (
        !eventoEmEdicao &&
        idJaExiste
    ) {
        mostrarMensagem(
            "Já existe um evento com esse identificador.",
            "erro"
        );

        return;
    }

    botaoSalvarEvento.disabled =
        true;

    botaoSalvarEvento.textContent =
        "Salvando...";

    try {
        const dados = {
            titulo:
                campoTitulo.value.trim(),

            descricao:
                campoDescricao.value.trim(),

            data:
                campoData.value,

            categoria:
                campoCategoria.value,

            instituicao:
                campoInstituicao.value.trim(),

            processoId:
                campoProcessoId.value.trim(),

            periodoInicio:
                campoPeriodoInicio.value,

            periodoFim:
                campoPeriodoFim.value,

            abertoAte:
                campoAbertoAte.value,

            urlOficial:
                campoUrlOficial.value.trim(),

            atualizadoEm:
                serverTimestamp()
        };

        if (!eventoEmEdicao) {
            dados.criadoEm =
                serverTimestamp();
        }

        await setDoc(
            doc(
                db,
                "eventosCalendario",
                documentoId
            ),

            dados,

            {
                merge:
                    Boolean(
                        eventoEmEdicao
                    )
            }
        );

        mostrarMensagem(
            eventoEmEdicao
                ? "Evento atualizado com sucesso."
                : "Evento cadastrado com sucesso."
        );

        limparFormulario();

    } catch (erro) {
        console.error(
            "Erro ao salvar evento:",
            erro
        );

        mostrarMensagem(
            "Não foi possível salvar o evento.",
            "erro"
        );

    } finally {
        botaoSalvarEvento.disabled =
            false;

        botaoSalvarEvento.textContent =
            "Salvar evento";
    }
}


/* ==================================================
   EXCLUIR
================================================== */

async function excluirEvento(
    eventoId
) {
    const evento =
        eventosCalendario.find(
            function (item) {
                return (
                    item.id ===
                    eventoId
                );
            }
        );

    const confirmou =
        window.confirm(
            `Excluir definitivamente “${
                evento?.titulo ||
                eventoId
            }”?`
        );

    if (!confirmou) {
        return;
    }

    try {
        await deleteDoc(
            doc(
                db,
                "eventosCalendario",
                eventoId
            )
        );

        if (
            eventoEmEdicao?.id ===
            eventoId
        ) {
            limparFormulario();
        }

        mostrarMensagem(
            "Evento excluído com sucesso."
        );

    } catch (erro) {
        console.error(
            "Erro ao excluir evento:",
            erro
        );

        mostrarMensagem(
            "Não foi possível excluir o evento.",
            "erro"
        );
    }
}


/* ==================================================
   INTERAÇÕES DO GERENCIADOR
================================================== */

botaoAbrirCalendario?.addEventListener(
    "click",

    function () {
        gerenciadorCalendario.hidden =
            false;

        iniciarObservacaoEventos();

        gerenciadorCalendario
            .scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );
    }
);


botaoFecharCalendario?.addEventListener(
    "click",

    function () {
        gerenciadorCalendario.hidden =
            true;

        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );
    }
);


campoTitulo?.addEventListener(
    "input",

    function () {
        if (
            !eventoEmEdicao &&
            !campoId.dataset
                .editadoManualmente
        ) {
            campoId.value =
                normalizarIdentificador(
                    campoTitulo.value
                );
        }
    }
);


campoId?.addEventListener(
    "input",

    function () {
        campoId.dataset
            .editadoManualmente =
                campoId.value
                    ? "true"
                    : "";
    }
);


formularioEvento?.addEventListener(
    "submit",
    salvarEvento
);


botaoCancelarEdicao?.addEventListener(
    "click",
    limparFormulario
);


pesquisaEventos?.addEventListener(
    "input",
    renderizarEventos
);


listaEventos?.addEventListener(
    "click",

    function (eventoClique) {
        const botao =
            eventoClique.target.closest(
                "button[data-acao]"
            );

        if (!botao) {
            return;
        }

        const eventoId =
            decodeURIComponent(
                botao.dataset.id
            );

        if (
            botao.dataset.acao ===
            "editar"
        ) {
            const evento =
                eventosCalendario.find(
                    function (item) {
                        return (
                            item.id ===
                            eventoId
                        );
                    }
                );

            if (evento) {
                preencherFormulario(
                    evento
                );
            }
        }

        if (
            botao.dataset.acao ===
            "excluir"
        ) {
            excluirEvento(
                eventoId
            );
        }
    }
);


/* ==================================================
   AUTENTICAÇÃO
================================================== */

onAuthStateChanged(
    auth,

    async function (usuario) {
        if (!usuario) {
            redirecionarParaLogin();
            return;
        }

        try {
            const possuiPermissao =
                await verificarAdministrador(
                    usuario
                );

            if (!possuiPermissao) {
                mostrarAcessoNegado(
                    "Sua conta está conectada, mas não possui permissão administrativa."
                );

                return;
            }

            esconderEstados();

            identificacaoAdmin.textContent =
                `Administrador conectado: ${
                    usuario.displayName ||
                    usuario.email ||
                    usuario.uid
                }`;

            conteudoAdmin.hidden =
                false;

        } catch (erro) {
            console.error(
                "Erro ao verificar administrador:",
                erro
            );

            mostrarAcessoNegado(
                "Não foi possível confirmar sua permissão administrativa."
            );
        }
    },

    function (erro) {
        console.error(
            "Erro de autenticação do administrador:",
            erro
        );

        mostrarAcessoNegado(
            "Não foi possível verificar a conta conectada."
        );
    }
);


/* ==================================================
   SAIR
================================================== */

botaoSair?.addEventListener(
    "click",

    async function () {
        botaoSair.disabled =
            true;

        try {
            await signOut(auth);

            redirecionarParaLogin();

        } catch (erro) {
            console.error(
                "Erro ao sair da conta administrativa:",
                erro
            );

            botaoSair.disabled =
                false;
        }
    }
);