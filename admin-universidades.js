"use strict";

import {
    db
} from "./firebase-config.js";

import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* ==================================================
   ELEMENTOS
================================================== */

const botaoNovaUniversidade =
    document.getElementById(
        "btn-nova-universidade-admin"
    );

const botaoAbrirUniversidades =
    document.getElementById(
        "btn-gerenciar-universidades"
    );

const botaoFecharUniversidades =
    document.getElementById(
        "btn-fechar-gerenciador-universidades"
    );

const botaoAbrirCalendario =
    document.getElementById(
        "btn-gerenciar-calendario"
    );

const gerenciadorUniversidades =
    document.getElementById(
        "gerenciador-universidades-admin"
    );

const gerenciadorCalendario =
    document.getElementById(
        "gerenciador-calendario-admin"
    );

const formularioUniversidade =
    document.getElementById(
        "form-universidade-admin"
    );

const tituloFormularioUniversidade =
    document.getElementById(
        "titulo-form-universidade-admin"
    );

const mensagemUniversidades =
    document.getElementById(
        "mensagem-universidades-admin"
    );

const campoId =
    document.getElementById(
        "universidade-admin-id"
    );

const campoNome =
    document.getElementById(
        "universidade-admin-nome"
    );

const campoSigla =
    document.getElementById(
        "universidade-admin-sigla"
    );

const campoLogo =
    document.getElementById(
        "universidade-admin-logo"
    );

const campoTipo =
    document.getElementById(
        "universidade-admin-tipo"
    );

const campoCategoria =
    document.getElementById(
        "universidade-admin-categoria"
    );

const campoRotuloCategoria =
    document.getElementById(
        "universidade-admin-rotulo-categoria"
    );

const campoEstado =
    document.getElementById(
        "universidade-admin-estado"
    );

const campoUf =
    document.getElementById(
        "universidade-admin-uf"
    );

const campoCidades =
    document.getElementById(
        "universidade-admin-cidades"
    );

const campoModalidadePresencial =
    document.getElementById(
        "universidade-admin-modalidade-presencial"
    );

const campoModalidadeEad =
    document.getElementById(
        "universidade-admin-modalidade-ead"
    );

const campoIngresso =
    document.getElementById(
        "universidade-admin-ingresso"
    );

const camposAreas =
    Array.from(
        document.querySelectorAll(
            ".campo-area-universidade-admin"
        )
    );

const listaCursosFormulario =
    document.getElementById(
        "lista-cursos-universidade-admin"
    );

const botaoAdicionarCurso =
    document.getElementById(
        "btn-adicionar-curso-admin"
    );

const campoDescricao =
    document.getElementById(
        "universidade-admin-descricao"
    );

const campoSite =
    document.getElementById(
        "universidade-admin-site"
    );

const campoPaginaCursos =
    document.getElementById(
        "universidade-admin-pagina-cursos"
    );

const campoPossuiBolsa =
    document.getElementById(
        "universidade-admin-possui-bolsa"
    );

const campoPossuiAssistencia =
    document.getElementById(
        "universidade-admin-possui-assistencia"
    );

const botaoSalvarUniversidade =
    document.getElementById(
        "btn-salvar-universidade-admin"
    );

const botaoCancelarEdicao =
    document.getElementById(
        "btn-cancelar-edicao-universidade"
    );

const pesquisaUniversidades =
    document.getElementById(
        "pesquisa-universidades-admin"
    );

const contadorUniversidades =
    document.getElementById(
        "contador-universidades-admin"
    );

const listaUniversidades =
    document.getElementById(
        "lista-universidades-admin"
    );


/* ==================================================
   ESTADO
================================================== */

let universidades = [];

let universidadeEmEdicao = null;

let pararObservacaoUniversidades = null;


const nomesAreas = {
    tecnologia:
        "Tecnologia",

    engenharia:
        "Engenharia",

    saude:
        "Saúde",

    humanas:
        "Humanas",

    administracao:
        "Administração",

    design:
        "Design"
};


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


function normalizarTexto(
    texto
) {
    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();
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


function separarLinhas(
    texto
) {
    return String(texto || "")
        .split(/\r?\n/)
        .map(
            function (item) {
                return item.trim();
            }
        )
        .filter(Boolean);
}


function juntarLinhas(
    itens
) {
    if (!Array.isArray(itens)) {
        return "";
    }

    return itens.join("\n");
}


function mostrarMensagemUniversidade(
    texto,
    tipo = "sucesso"
) {
    if (!mensagemUniversidades) {
        return;
    }

    mensagemUniversidades.textContent =
        texto;

    mensagemUniversidades.className =
        `mensagem-calendario-admin mensagem-${tipo}`;

    mensagemUniversidades.hidden =
        false;
}


function limparMensagemUniversidade() {
    if (mensagemUniversidades) {
        mensagemUniversidades.hidden =
            true;
    }
}


/* ==================================================
   CAMPOS DE CURSOS
================================================== */

function criarOpcoesAreaCurso(
    areaSelecionada
) {
    return Object.entries(
        nomesAreas
    )
        .map(
            function ([valor, nome]) {
                const selecionada =
                    valor === areaSelecionada
                        ? "selected"
                        : "";

                return `
                    <option
                        value="${valor}"
                        ${selecionada}
                    >
                        ${nome}
                    </option>
                `;
            }
        )
        .join("");
}


function adicionarLinhaCurso(
    curso = {}
) {
    if (!listaCursosFormulario) {
        return;
    }

    const linha =
        document.createElement("div");

    linha.className =
        "linha-curso-universidade-admin";

    const area =
        curso.area &&
        nomesAreas[curso.area]
            ? curso.area
            : "tecnologia";

    linha.innerHTML = `
        <label>
            Nome do curso

            <input
                type="text"
                class="campo-nome-curso-admin"
                value="${escaparHtml(
                    curso.nome || ""
                )}"
                placeholder="Exemplo: Ciência da Computação"
            >
        </label>

        <label>
            Área

            <select class="campo-area-curso-admin">
                ${criarOpcoesAreaCurso(area)}
            </select>
        </label>

        <button
            type="button"
            class="botao-remover-curso-admin"
            aria-label="Remover curso"
        >
            Remover
        </button>
    `;

    listaCursosFormulario.appendChild(
        linha
    );
}


function obterCursosFormulario() {
    return Array.from(
        listaCursosFormulario.querySelectorAll(
            ".linha-curso-universidade-admin"
        )
    )
        .map(
            function (linha) {
                const nome =
                    linha.querySelector(
                        ".campo-nome-curso-admin"
                    )
                        ?.value
                        .trim() || "";

                const area =
                    linha.querySelector(
                        ".campo-area-curso-admin"
                    )
                        ?.value || "tecnologia";

                return {
                    nome,
                    area
                };
            }
        )
        .filter(
            function (curso) {
                return Boolean(
                    curso.nome
                );
            }
        );
}


function obterAreasSelecionadas() {
    return camposAreas
        .filter(
            function (campo) {
                return campo.checked;
            }
        )
        .map(
            function (campo) {
                return campo.value;
            }
        );
}


function obterModalidadesSelecionadas() {
    const modalidades = [];

    if (
        campoModalidadePresencial.checked
    ) {
        modalidades.push(
            "presencial"
        );
    }

    if (campoModalidadeEad.checked) {
        modalidades.push(
            "ead"
        );
    }

    return modalidades;
}


/* ==================================================
   LISTAGEM
================================================== */

function renderizarUniversidades() {
    if (!listaUniversidades) {
        return;
    }

    const termo =
        normalizarTexto(
            pesquisaUniversidades?.value
        );

    const universidadesFiltradas =
        universidades.filter(
            function (universidade) {
                const textoCompleto =
                    normalizarTexto(
                        [
                            universidade.nome,
                            universidade.sigla,
                            universidade.tipo,
                            universidade.categoria,
                            universidade.estado,
                            universidade.uf,
                            ...(universidade.cidades || [])
                        ].join(" ")
                    );

                return textoCompleto.includes(
                    termo
                );
            }
        );

    contadorUniversidades.textContent =
        `${universidadesFiltradas.length} de ${universidades.length} universidade(s)`;

    listaUniversidades.innerHTML = "";

    if (
        universidadesFiltradas.length === 0
    ) {
        listaUniversidades.innerHTML = `
            <p class="lista-eventos-admin-vazia">
                Nenhuma universidade encontrada.
            </p>
        `;

        return;
    }

    universidadesFiltradas.forEach(
        function (universidade) {
            const item =
                document.createElement(
                    "article"
                );

            item.className =
                "item-universidade-admin";

            const quantidadeCursos =
                Array.isArray(
                    universidade.cursos
                )
                    ? universidade.cursos.length
                    : 0;

            const quantidadeCidades =
                Array.isArray(
                    universidade.cidades
                )
                    ? universidade.cidades.length
                    : 0;

            item.innerHTML = `
                <div class="logo-item-universidade-admin">

                    <img
                        src="${escaparHtml(
                            universidade.logo
                        )}"
                        alt=""
                    >

                </div>

                <div class="conteudo-item-universidade-admin">

                    <span>
                        ${escaparHtml(
                            universidade.tipo ||
                            "instituição"
                        )}
                        •
                        ${escaparHtml(
                            universidade.rotuloCategoria ||
                            universidade.categoria ||
                            ""
                        )}
                    </span>

                    <h3>
                        ${escaparHtml(
                            universidade.nome ||
                            "Universidade sem nome"
                        )}
                    </h3>

                    <p>
                        ${escaparHtml(
                            universidade.sigla ||
                            universidade.id
                        )}
                        •
                        ${quantidadeCursos} curso(s)
                        •
                        ${quantidadeCidades} cidade(s)
                    </p>

                </div>

                <div class="acoes-item-evento-admin">

                    <button
                        type="button"
                        data-acao-universidade="editar"
                        data-id="${encodeURIComponent(
                            universidade.id
                        )}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="botao-excluir-evento-admin"
                        data-acao-universidade="excluir"
                        data-id="${encodeURIComponent(
                            universidade.id
                        )}"
                    >
                        Excluir
                    </button>

                </div>
            `;

            listaUniversidades.appendChild(
                item
            );
        }
    );
}


function iniciarObservacaoUniversidades() {
    if (
        pararObservacaoUniversidades ||
        !listaUniversidades
    ) {
        return;
    }

    pararObservacaoUniversidades =
        onSnapshot(
            collection(
                db,
                "universidades"
            ),

            function (resultado) {
                universidades =
                    resultado.docs
                        .map(
                            function (
                                documento
                            ) {
                                return {
                                    ...documento.data(),

                                    id:
                                        documento.id
                                };
                            }
                        )
                        .sort(
                            function (
                                universidadeA,
                                universidadeB
                            ) {
                                return String(
                                    universidadeA.nome ||
                                    ""
                                ).localeCompare(
                                    String(
                                        universidadeB.nome ||
                                        ""
                                    ),
                                    "pt-BR"
                                );
                            }
                        );

                renderizarUniversidades();
            },

            function (erro) {
                console.error(
                    "Erro ao carregar universidades no ADMIN:",
                    erro
                );

                mostrarMensagemUniversidade(
                    "Não foi possível carregar as universidades.",
                    "erro"
                );
            }
        );
}


/* ==================================================
   FORMULÁRIO
================================================== */

function limparFormularioUniversidade() {
    universidadeEmEdicao =
        null;

    campoId.disabled =
        false;

    formularioUniversidade.reset();

    delete campoId.dataset
        .editadoManualmente;

    campoEstado.value =
        "Rio de Janeiro";

    campoUf.value =
        "RJ";

    campoTipo.value =
        "publica";

    campoCategoria.value =
        "federal";

    campoModalidadePresencial.checked =
        true;

    campoPossuiBolsa.checked =
        true;

    campoPossuiAssistencia.checked =
        true;

    camposAreas.forEach(
        function (campo) {
            campo.checked =
                true;
        }
    );

    listaCursosFormulario.innerHTML =
        "";

    adicionarLinhaCurso();

    tituloFormularioUniversidade.textContent =
        "Cadastrar universidade";

    botaoCancelarEdicao.hidden =
        true;
}


function preencherFormularioUniversidade(
    universidade
) {
    universidadeEmEdicao =
        universidade;

    tituloFormularioUniversidade.textContent =
        "Editar universidade";

    campoId.value =
        universidade.id;

    campoId.disabled =
        true;

    campoNome.value =
        universidade.nome || "";

    campoSigla.value =
        universidade.sigla || "";

    campoLogo.value =
        universidade.logo || "";

    campoTipo.value =
        universidade.tipo || "publica";

    campoCategoria.value =
        universidade.categoria || "federal";

    campoRotuloCategoria.value =
        universidade.rotuloCategoria || "";

    campoEstado.value =
        universidade.estado || "";

    campoUf.value =
        universidade.uf || "";

    campoCidades.value =
        juntarLinhas(
            universidade.cidades
        );

    campoModalidadePresencial.checked =
        universidade.modalidade
            ?.includes(
                "presencial"
            ) || false;

    campoModalidadeEad.checked =
        universidade.modalidade
            ?.includes(
                "ead"
            ) || false;

    campoIngresso.value =
        juntarLinhas(
            universidade.ingresso
        );

    camposAreas.forEach(
        function (campo) {
            campo.checked =
                universidade.areas
                    ?.includes(
                        campo.value
                    ) || false;
        }
    );

    listaCursosFormulario.innerHTML =
        "";

    if (
        Array.isArray(
            universidade.cursos
        ) &&
        universidade.cursos.length > 0
    ) {
        universidade.cursos.forEach(
            adicionarLinhaCurso
        );
    } else {
        adicionarLinhaCurso();
    }

    campoDescricao.value =
        universidade.descricao || "";

    campoSite.value =
        universidade.site || "";

    campoPaginaCursos.value =
        universidade.paginaCursos || "";

    campoPossuiBolsa.checked =
        universidade.possuiBolsa ===
        true;

    campoPossuiAssistencia.checked =
        universidade
            .possuiAssistenciaEstudantil ===
        true;

    botaoCancelarEdicao.hidden =
        false;

    gerenciadorUniversidades
        .scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );
}


/* ==================================================
   SALVAR
================================================== */

async function salvarUniversidade(
    eventoSubmit
) {
    eventoSubmit.preventDefault();

    limparMensagemUniversidade();

    const documentoId =
        universidadeEmEdicao?.id ||
        normalizarIdentificador(
            campoId.value ||
            campoSigla.value ||
            campoNome.value
        );

    if (!documentoId) {
        mostrarMensagemUniversidade(
            "Informe um identificador para a universidade.",
            "erro"
        );

        return;
    }

    const idJaExiste =
        universidades.some(
            function (universidade) {
                return (
                    universidade.id ===
                    documentoId
                );
            }
        );

    if (
        !universidadeEmEdicao &&
        idJaExiste
    ) {
        mostrarMensagemUniversidade(
            "Já existe uma universidade com esse identificador.",
            "erro"
        );

        return;
    }

    const cidades =
        separarLinhas(
            campoCidades.value
        );

    const ingresso =
        separarLinhas(
            campoIngresso.value
        );

    const modalidades =
        obterModalidadesSelecionadas();

    const cursos =
        obterCursosFormulario();

    const areasSelecionadas =
        obterAreasSelecionadas();

    const areasCursos =
        cursos.map(
            function (curso) {
                return curso.area;
            }
        );

    const areas =
        Array.from(
            new Set([
                ...areasSelecionadas,
                ...areasCursos
            ])
        );

    if (cidades.length === 0) {
        mostrarMensagemUniversidade(
            "Informe pelo menos uma cidade.",
            "erro"
        );

        return;
    }

    if (modalidades.length === 0) {
        mostrarMensagemUniversidade(
            "Selecione pelo menos uma modalidade.",
            "erro"
        );

        return;
    }

    if (ingresso.length === 0) {
        mostrarMensagemUniversidade(
            "Informe pelo menos uma forma de ingresso.",
            "erro"
        );

        return;
    }

    if (cursos.length === 0) {
        mostrarMensagemUniversidade(
            "Adicione pelo menos um curso.",
            "erro"
        );

        return;
    }

    botaoSalvarUniversidade.disabled =
        true;

    botaoSalvarUniversidade.textContent =
        "Salvando...";

    try {
        const dados = {
            nome:
                campoNome.value.trim(),

            sigla:
                campoSigla.value
                    .trim()
                    .toUpperCase(),

            logo:
                campoLogo.value.trim(),

            tipo:
                campoTipo.value,

            categoria:
                campoCategoria.value,

            rotuloCategoria:
                campoRotuloCategoria
                    .value
                    .trim(),

            estado:
                campoEstado.value.trim(),

            uf:
                campoUf.value
                    .trim()
                    .toUpperCase(),

            cidades,

            modalidade:
                modalidades,

            ingresso,

            possuiBolsa:
                campoPossuiBolsa.checked,

            possuiAssistenciaEstudantil:
                campoPossuiAssistencia
                    .checked,

            areas,

            cursos,

            descricao:
                campoDescricao.value.trim(),

            site:
                campoSite.value.trim(),

            paginaCursos:
                campoPaginaCursos
                    .value
                    .trim(),

            atualizadoEm:
                serverTimestamp()
        };

        if (!universidadeEmEdicao) {
            dados.criadoEm =
                serverTimestamp();
        }

        await setDoc(
            doc(
                db,
                "universidades",
                documentoId
            ),

            dados,

            {
                merge:
                    Boolean(
                        universidadeEmEdicao
                    )
            }
        );

        mostrarMensagemUniversidade(
            universidadeEmEdicao
                ? "Universidade atualizada com sucesso."
                : "Universidade cadastrada com sucesso."
        );

        limparFormularioUniversidade();

    } catch (erro) {
        console.error(
            "Erro ao salvar universidade:",
            erro
        );

        mostrarMensagemUniversidade(
            "Não foi possível salvar a universidade.",
            "erro"
        );

    } finally {
        botaoSalvarUniversidade.disabled =
            false;

        botaoSalvarUniversidade.textContent =
            "Salvar universidade";
    }
}


/* ==================================================
   EXCLUIR
================================================== */

async function excluirUniversidade(
    universidadeId
) {
    const universidade =
        universidades.find(
            function (item) {
                return (
                    item.id ===
                    universidadeId
                );
            }
        );

    const confirmou =
        window.confirm(
            `Excluir definitivamente “${
                universidade?.nome ||
                universidadeId
            }”?`
        );

    if (!confirmou) {
        return;
    }

    try {
        await deleteDoc(
            doc(
                db,
                "universidades",
                universidadeId
            )
        );

        if (
            universidadeEmEdicao?.id ===
            universidadeId
        ) {
            limparFormularioUniversidade();
        }

        mostrarMensagemUniversidade(
            "Universidade excluída com sucesso."
        );

    } catch (erro) {
        console.error(
            "Erro ao excluir universidade:",
            erro
        );

        mostrarMensagemUniversidade(
            "Não foi possível excluir a universidade.",
            "erro"
        );
    }
}


/* ==================================================
   INTERAÇÕES
================================================== */

botaoNovaUniversidade?.addEventListener(
    "click",

    function () {
        limparMensagemUniversidade();

        limparFormularioUniversidade();

        gerenciadorUniversidades
            .scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );

        window.setTimeout(
            function () {
                campoNome.focus();
            },
            350
        );
    }
);

botaoAbrirUniversidades?.addEventListener(
    "click",

    function () {
        gerenciadorCalendario.hidden =
            true;

        gerenciadorUniversidades.hidden =
            false;

        iniciarObservacaoUniversidades();

        gerenciadorUniversidades
            .scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );
    }
);


botaoFecharUniversidades?.addEventListener(
    "click",

    function () {
        gerenciadorUniversidades.hidden =
            true;

        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );
    }
);


botaoAbrirCalendario?.addEventListener(
    "click",

    function () {
        gerenciadorUniversidades.hidden =
            true;
    }
);


campoNome?.addEventListener(
    "input",

    function () {
        if (
            !universidadeEmEdicao &&
            !campoId.dataset
                .editadoManualmente
        ) {
            campoId.value =
                normalizarIdentificador(
                    campoSigla.value ||
                    campoNome.value
                );
        }
    }
);


campoSigla?.addEventListener(
    "input",

    function () {
        campoSigla.value =
            campoSigla.value.toUpperCase();

        if (
            !universidadeEmEdicao &&
            !campoId.dataset
                .editadoManualmente
        ) {
            campoId.value =
                normalizarIdentificador(
                    campoSigla.value ||
                    campoNome.value
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


campoUf?.addEventListener(
    "input",

    function () {
        campoUf.value =
            campoUf.value.toUpperCase();
    }
);


botaoAdicionarCurso?.addEventListener(
    "click",

    function () {
        adicionarLinhaCurso();
    }
);


listaCursosFormulario?.addEventListener(
    "click",

    function (eventoClique) {
        const botaoRemover =
            eventoClique.target.closest(
                ".botao-remover-curso-admin"
            );

        if (!botaoRemover) {
            return;
        }

        const linha =
            botaoRemover.closest(
                ".linha-curso-universidade-admin"
            );

        const linhas =
            listaCursosFormulario.querySelectorAll(
                ".linha-curso-universidade-admin"
            );

        if (linhas.length === 1) {
            linha.querySelector(
                ".campo-nome-curso-admin"
            ).value = "";

            linha.querySelector(
                ".campo-area-curso-admin"
            ).value = "tecnologia";

            return;
        }

        linha.remove();
    }
);


formularioUniversidade?.addEventListener(
    "submit",
    salvarUniversidade
);


botaoCancelarEdicao?.addEventListener(
    "click",

    function () {
        limparMensagemUniversidade();
        limparFormularioUniversidade();
    }
);


pesquisaUniversidades?.addEventListener(
    "input",
    renderizarUniversidades
);


listaUniversidades?.addEventListener(
    "click",

    function (eventoClique) {
        const botao =
            eventoClique.target.closest(
                "button[data-acao-universidade]"
            );

        if (!botao) {
            return;
        }

        const universidadeId =
            decodeURIComponent(
                botao.dataset.id
            );

        if (
            botao.dataset
                .acaoUniversidade ===
            "editar"
        ) {
            const universidade =
                universidades.find(
                    function (item) {
                        return (
                            item.id ===
                            universidadeId
                        );
                    }
                );

            if (universidade) {
                limparMensagemUniversidade();

                preencherFormularioUniversidade(
                    universidade
                );
            }
        }

        if (
            botao.dataset
                .acaoUniversidade ===
            "excluir"
        ) {
            excluirUniversidade(
                universidadeId
            );
        }
    }
);


/* ==================================================
   INICIALIZAÇÃO
================================================== */

limparFormularioUniversidade();