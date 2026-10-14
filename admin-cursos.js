"use strict";

import {
    db
} from "./firebase-config.js";

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
   HUB DE CONTEÚDOS
================================================== */

const botaoAbrirConteudos =
    document.getElementById(
        "btn-gerenciar-conteudos"
    );

const botaoFecharConteudos =
    document.getElementById(
        "btn-fechar-hub-conteudos"
    );

const hubConteudos =
    document.getElementById(
        "hub-conteudos-admin"
    );


botaoAbrirConteudos?.addEventListener(

    "click",

    function () {

        hubConteudos.hidden =
            false;


        hubConteudos.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );
    }
);


botaoFecharConteudos?.addEventListener(

    "click",

    function () {

        hubConteudos.hidden =
            true;


        window.scrollTo(
            {
                top:
                    0,

                behavior:
                    "smooth"
            }
        );
    }
);

const botaoAbrir =
    document.getElementById(
        "btn-gerenciar-cursos"
    );

const gerenciador =
    document.getElementById(
        "gerenciador-cursos-admin"
    );

const formulario =
    document.getElementById(
        "form-curso-admin"
    );


if (
    botaoAbrir &&
    gerenciador &&
    formulario
) {

    const obterElemento =
        function (id) {
            return document.getElementById(id);
        };


    const botaoFechar =
        obterElemento(
            "btn-fechar-gerenciador-cursos"
        );

    const botaoNovo =
        obterElemento(
            "btn-novo-curso-admin"
        );

    const botaoCancelar =
        obterElemento(
            "btn-cancelar-edicao-curso"
        );

    const botaoSalvar =
        obterElemento(
            "btn-salvar-curso-admin"
        );

    const tituloFormulario =
        obterElemento(
            "titulo-form-curso-admin"
        );

    const mensagem =
        obterElemento(
            "mensagem-cursos-admin"
        );

    const contador =
        obterElemento(
            "contador-cursos-admin"
        );

    const pesquisa =
        obterElemento(
            "pesquisa-cursos-admin"
        );

    const lista =
        obterElemento(
            "lista-cursos-admin"
        );

    const painelFormulario =
        gerenciador.querySelector(
            ".painel-form-curso-admin"
        );


    const campos = {

        id:
            obterElemento(
                "curso-admin-id"
            ),

        nome:
            obterElemento(
                "curso-admin-nome"
            ),

        simbolo:
            obterElemento(
                "curso-admin-simbolo"
            ),

        area:
            obterElemento(
                "curso-admin-area"
            ),

        modalidade:
            obterElemento(
                "curso-admin-modalidade"
            ),

        duracaoMeses:
            obterElemento(
                "curso-admin-duracao-meses"
            ),

        instituicaoResumo:
            obterElemento(
                "curso-admin-instituicao-resumo"
            ),

        descricaoResumo:
            obterElemento(
                "curso-admin-descricao-resumo"
            ),

        infoDuracao:
            obterElemento(
                "curso-admin-info-duracao"
            ),

        infoModalidade:
            obterElemento(
                "curso-admin-info-modalidade"
            ),

        infoNivel:
            obterElemento(
                "curso-admin-info-nivel"
            ),

        detalheInstituicao:
            obterElemento(
                "curso-admin-detalhe-instituicao"
            ),

        detalheLocal:
            obterElemento(
                "curso-admin-detalhe-local"
            ),

        detalheDuracao:
            obterElemento(
                "curso-admin-detalhe-duracao"
            ),

        detalheModalidade:
            obterElemento(
                "curso-admin-detalhe-modalidade"
            ),

        detalheTurno:
            obterElemento(
                "curso-admin-detalhe-turno"
            ),

        processoTitulo:
            obterElemento(
                "curso-admin-processo-titulo"
            ),

        processoStatus:
            obterElemento(
                "curso-admin-processo-status"
            ),

        processoStatusClasse:
            obterElemento(
                "curso-admin-processo-status-classe"
            ),

        processoAviso:
            obterElemento(
                "curso-admin-processo-aviso"
            ),

        processoDados:
            obterElemento(
                "curso-admin-processo-dados"
            ),

        textoOferta:
            obterElemento(
                "curso-admin-texto-oferta"
            ),

        verificacao:
            obterElemento(
                "curso-admin-verificacao"
            ),

        processoLink:
            obterElemento(
                "curso-admin-processo-link"
            ),

        processoTexto:
            obterElemento(
                "curso-admin-processo-texto"
            ),

        instituicaoLink:
            obterElemento(
                "curso-admin-instituicao-link"
            ),

        instituicaoTexto:
            obterElemento(
                "curso-admin-instituicao-texto"
            )
    };


    let cursos = [];

    let cursoEmEdicao =
        null;

    let pararObservacao =
        null;


    /* ==================================================
       FUNÇÕES AUXILIARES
    ================================================== */

    function normalizarIdentificador(
        texto
    ) {

        return String(
            texto ||
            ""
        )
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


    function normalizarPesquisa(
        texto
    ) {

        return String(
            texto ||
            ""
        )
            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .toLowerCase();
    }


    function escaparHtml(
        valor
    ) {

        return String(
            valor ??
            ""
        )
            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }


    function obterNomeArea(
        valor
    ) {

        const nomes = {

            tecnologia:
                "Tecnologia",

            administracao:
                "Administração",

            saude:
                "Saúde",

            industria:
                "Indústria"
        };


        return (
            nomes[
            valor
            ] ||

            valor ||

            "Curso técnico"
        );
    }


    function obterNomeModalidade(
        valor
    ) {

        const nomes = {

            presencial:
                "Presencial",

            online:
                "Online",

            hibrido:
                "Híbrido"
        };


        return (
            nomes[
            valor
            ] ||

            valor ||

            ""
        );
    }


    function mostrarMensagem(
        texto,
        tipo = "sucesso"
    ) {

        if (
            !mensagem
        ) {
            return;
        }


        mensagem.textContent =
            texto;


        mensagem.className =

            `mensagem-calendario-admin mensagem-${tipo}`;


        mensagem.hidden =
            false;
    }


    function esconderMensagem() {

        if (
            mensagem
        ) {

            mensagem.hidden =
                true;
        }
    }


    function converterProcessoParaTexto(
        processo
    ) {

        if (
            !Array.isArray(
                processo
            )
        ) {
            return "";
        }


        return processo

            .map(
                function (item) {

                    return (
                        `${item.rotulo || ""} | ${item.valor || ""}`
                    );
                }
            )

            .join(
                "\n"
            );
    }


    function converterTextoParaProcesso(
        texto
    ) {

        return String(
            texto ||
            ""
        )
            .split(
                "\n"
            )

            .map(
                function (linha) {

                    return linha.trim();
                }
            )

            .filter(
                Boolean
            )

            .slice(
                0,
                6
            )

            .map(
                function (linha) {

                    const separador =
                        linha.indexOf(
                            "|"
                        );


                    if (
                        separador === -1
                    ) {

                        return {

                            rotulo:
                                "Informação",

                            valor:
                                linha
                        };
                    }


                    return {

                        rotulo:
                            linha
                                .slice(
                                    0,
                                    separador
                                )
                                .trim(),

                        valor:
                            linha
                                .slice(
                                    separador + 1
                                )
                                .trim()
                    };
                }
            );
    }


    /* ==================================================
       FORMULÁRIO
    ================================================== */

    function limparFormulario() {

        formulario.reset();


        cursoEmEdicao =
            null;


        campos.id.disabled =
            false;


        campos.id.dataset
            .editadoManualmente =
            "";


        campos.detalheInstituicao
            .dataset
            .editadoManualmente =
            "";


        campos.simbolo.value =
            "🎓";


        campos.infoNivel.value =
            "Técnico";


        campos.processoTexto.value =
            "Fonte oficial do processo";


        campos.instituicaoTexto.value =
            "Site da instituição";


        tituloFormulario.textContent =
            "Cadastrar curso técnico";


        botaoSalvar.textContent =
            "Salvar curso";


        botaoCancelar.hidden =
            true;


        esconderMensagem();
    }


    function preencherFormulario(
        curso
    ) {

        const detalhes =
            curso.detalhes ||
            {};


        const informacoes =

            Array.isArray(
                curso.informacoesResumo
            )

                ? curso.informacoesResumo

                : [];


        cursoEmEdicao =
            curso;


        campos.id.value =
            curso.id ||
            "";


        campos.id.disabled =
            true;


        campos.nome.value =
            curso.nome ||
            "";


        campos.simbolo.value =
            curso.simbolo ||
            "🎓";


        campos.area.value =
            curso.area ||
            "tecnologia";


        campos.modalidade.value =
            curso.modalidade ||
            "presencial";


        campos.duracaoMeses.value =
            curso.duracaoMeses ||
            "";


        campos.instituicaoResumo.value =
            curso.instituicaoResumo ||
            "";


        campos.descricaoResumo.value =
            curso.descricaoResumo ||
            "";


        campos.infoDuracao.value =
            informacoes[0] ||
            "";


        campos.infoModalidade.value =
            informacoes[1] ||
            "";


        campos.infoNivel.value =
            informacoes[2] ||
            "Técnico";


        campos.detalheInstituicao.value =

            detalhes.instituicao ||

            curso.instituicaoResumo ||

            "";


        campos.detalheLocal.value =
            detalhes.local ||
            "";


        campos.detalheDuracao.value =
            detalhes.duracao ||
            "";


        campos.detalheModalidade.value =
            detalhes.modalidade ||
            "";


        campos.detalheTurno.value =
            detalhes.turno ||
            "";


        campos.processoTitulo.value =
            detalhes.processoTitulo ||
            "";


        campos.processoStatus.value =
            detalhes.status ||
            "";


        campos.processoStatusClasse.value =

            detalhes.statusClasse ||

            "status-em-breve";


        campos.processoAviso.value =
            detalhes.avisoStatus ||
            "";


        campos.processoDados.value =

            converterProcessoParaTexto(
                detalhes.processo
            );


        campos.textoOferta.value =
            detalhes.textoOferta ||
            "";


        campos.verificacao.value =
            detalhes.verificacao ||
            "";


        campos.processoLink.value =
            detalhes.processoLink ||
            "";


        campos.processoTexto.value =

            detalhes.processoTexto ||

            "Fonte oficial do processo";


        campos.instituicaoLink.value =
            detalhes.instituicaoLink ||
            "";


        campos.instituicaoTexto.value =

            detalhes.instituicaoTexto ||

            "Site da instituição";


        tituloFormulario.textContent =

            `Editar: ${curso.nome || curso.id}`;


        botaoSalvar.textContent =
            "Salvar alterações";


        botaoCancelar.hidden =
            false;


        esconderMensagem();


        painelFormulario
            ?.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );
    }


    function criarDadosCurso() {

        const id =
            normalizarIdentificador(
                campos.id.value
            );


        const nome =
            campos.nome
                .value
                .trim();


        const area =
            campos.area.value;


        const modalidade =
            campos.modalidade.value;


        return {

            id,

            dados: {

                nome,

                simbolo:

                    campos.simbolo
                        .value
                        .trim()

                    ||

                    "🎓",

                area,

                areaNome:
                    obterNomeArea(
                        area
                    ),

                modalidade,

                duracaoMeses:

                    Number(
                        campos.duracaoMeses.value
                    ),

                instituicaoResumo:

                    campos.instituicaoResumo
                        .value
                        .trim(),

                descricaoResumo:

                    campos.descricaoResumo
                        .value
                        .trim(),

                informacoesResumo:

                    [
                        campos.infoDuracao
                            .value
                            .trim(),

                        campos.infoModalidade
                            .value
                            .trim(),

                        campos.infoNivel
                            .value
                            .trim()
                    ]

                        .filter(
                            Boolean
                        ),

                detalhes: {

                    area:
                        obterNomeArea(
                            area
                        ),

                    titulo:
                        nome,

                    instituicao:

                        campos.detalheInstituicao
                            .value
                            .trim(),

                    local:

                        campos.detalheLocal
                            .value
                            .trim(),

                    duracao:

                        campos.detalheDuracao
                            .value
                            .trim(),

                    modalidade:

                        campos.detalheModalidade
                            .value
                            .trim(),

                    turno:

                        campos.detalheTurno
                            .value
                            .trim(),

                    processoTitulo:

                        campos.processoTitulo
                            .value
                            .trim(),

                    status:

                        campos.processoStatus
                            .value
                            .trim(),

                    statusClasse:

                        campos.processoStatusClasse
                            .value,

                    avisoStatus:

                        campos.processoAviso
                            .value
                            .trim(),

                    processo:

                        converterTextoParaProcesso(

                            campos.processoDados
                                .value
                        ),

                    textoOferta:

                        campos.textoOferta
                            .value
                            .trim(),

                    verificacao:

                        campos.verificacao
                            .value
                            .trim(),

                    processoLink:

                        campos.processoLink
                            .value
                            .trim(),

                    processoTexto:

                        campos.processoTexto
                            .value
                            .trim(),

                    instituicaoLink:

                        campos.instituicaoLink
                            .value
                            .trim(),

                    instituicaoTexto:

                        campos.instituicaoTexto
                            .value
                            .trim()
                },

                atualizadoEm:
                    serverTimestamp()
            }
        };
    }


    /* ==================================================
       LISTAGEM
    ================================================== */

    function renderizarCursos() {

        if (
            !lista ||
            !contador
        ) {
            return;
        }


        const termo =

            normalizarPesquisa(

                pesquisa
                    ?.value
                    .trim()
            );


        const filtrados =

            cursos.filter(

                function (curso) {

                    const texto =

                        normalizarPesquisa(

                            [
                                curso.nome,

                                curso.areaNome,

                                curso.area,

                                curso.instituicaoResumo,

                                curso.modalidade

                            ].join(" ")
                        );


                    return texto.includes(
                        termo
                    );
                }
            );


        contador.textContent =

            `${filtrados.length} de ${cursos.length} curso(s)`;


        lista.innerHTML =
            "";


        if (
            filtrados.length === 0
        ) {

            lista.innerHTML = `

                <p class="lista-eventos-admin-vazia">

                    Nenhum curso encontrado.

                </p>
            `;


            return;
        }


        filtrados.forEach(

            function (curso) {

                const item =

                    document.createElement(
                        "article"
                    );


                item.className =

                    "item-evento-admin item-curso-admin";


                item.innerHTML = `

                    <div class="data-item-evento-admin simbolo-item-curso-admin">

                        ${escaparHtml(
                    curso.simbolo ||
                    "🎓"
                )}

                    </div>


                    <div class="conteudo-item-evento-admin">

                        <span>

                            ${escaparHtml(
                    obterNomeArea(
                        curso.area
                    )
                )}

                        </span>


                        <h3>

                            ${escaparHtml(
                    curso.nome ||
                    "Curso sem nome"
                )}

                        </h3>


                        <p>

                            ${escaparHtml(
                    curso.instituicaoResumo ||
                    "Instituição não informada"
                )}

                            •

                            ${escaparHtml(
                    obterNomeModalidade(
                        curso.modalidade
                    )
                )}

                        </p>

                    </div>


                    <div class="acoes-item-evento-admin">

                        <button
                            type="button"
                            data-acao="editar"
                            data-id="${encodeURIComponent(
                    curso.id
                )}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="botao-excluir-evento-admin"
                            data-acao="excluir"
                            data-id="${encodeURIComponent(
                    curso.id
                )}"
                        >
                            Excluir
                        </button>

                    </div>
                `;


                lista.appendChild(
                    item
                );
            }
        );
    }


    function iniciarObservacao() {

        if (
            pararObservacao
        ) {
            return;
        }


        pararObservacao =

            onSnapshot(

                collection(
                    db,
                    "cursosTecnicos"
                ),


                function (snapshot) {

                    cursos =

                        snapshot.docs

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
                                    cursoA,
                                    cursoB
                                ) {

                                    return String(
                                        cursoA.nome ||
                                        ""
                                    ).localeCompare(

                                        String(
                                            cursoB.nome ||
                                            ""
                                        ),

                                        "pt-BR"
                                    );
                                }
                            );


                    renderizarCursos();
                },


                function (erro) {

                    console.error(

                        "Erro ao carregar cursos no ADMIN:",

                        erro
                    );


                    mostrarMensagem(

                        "Não foi possível carregar os cursos.",

                        "erro"
                    );
                }
            );
    }


    /* ==================================================
       SALVAR
    ================================================== */

    async function salvarCurso(
        evento
    ) {

        evento.preventDefault();


        if (
            !formulario.reportValidity()
        ) {
            return;
        }


        const {
            id,
            dados
        } =
            criarDadosCurso();


        if (
            !id
        ) {

            mostrarMensagem(

                "Digite um identificador válido para o curso.",

                "erro"
            );


            campos.id.focus();

            return;
        }


        if (
            !Number.isFinite(
                dados.duracaoMeses
            )

            ||

            dados.duracaoMeses < 1
        ) {

            mostrarMensagem(

                "Informe uma duração válida em meses.",

                "erro"
            );


            campos.duracaoMeses.focus();

            return;
        }


        if (
            dados.detalhes.processo.length === 0
        ) {

            mostrarMensagem(

                "Adicione pelo menos uma informação do processo seletivo.",

                "erro"
            );


            campos.processoDados.focus();

            return;
        }


        botaoSalvar.disabled =
            true;


        botaoSalvar.textContent =
            "Salvando...";


        try {

            const referencia =

                doc(
                    db,
                    "cursosTecnicos",
                    id
                );


            if (
                !cursoEmEdicao
            ) {

                const documentoExistente =

                    await getDoc(
                        referencia
                    );


                if (
                    documentoExistente.exists()
                ) {

                    mostrarMensagem(

                        "Já existe um curso com esse identificador.",

                        "erro"
                    );


                    return;
                }


                dados.criadoEm =
                    serverTimestamp();
            }


            const estavaEditando =

                Boolean(
                    cursoEmEdicao
                );


            await setDoc(

                referencia,

                dados,

                {
                    merge:
                        true
                }
            );


            limparFormulario();


            mostrarMensagem(

                estavaEditando

                    ? "Curso atualizado com sucesso."

                    : "Curso cadastrado com sucesso."
            );


        } catch (erro) {

            console.error(

                "Erro ao salvar curso:",

                erro
            );


            mostrarMensagem(

                "Não foi possível salvar o curso.",

                "erro"
            );


        } finally {

            botaoSalvar.disabled =
                false;


            botaoSalvar.textContent =

                cursoEmEdicao

                    ? "Salvar alterações"

                    : "Salvar curso";
        }
    }


    /* ==================================================
       EXCLUIR
    ================================================== */

    async function excluirCurso(
        id
    ) {

        const curso =

            cursos.find(

                function (item) {

                    return (
                        item.id ===
                        id
                    );
                }
            );


        const nome =
            curso?.nome ||
            id;


        const confirmou =

            window.confirm(

                `Tem certeza que deseja excluir o curso “${nome}”?`
            );


        if (
            !confirmou
        ) {
            return;
        }


        try {

            await deleteDoc(

                doc(
                    db,
                    "cursosTecnicos",
                    id
                )
            );


            if (
                cursoEmEdicao?.id ===
                id
            ) {

                limparFormulario();
            }


            mostrarMensagem(

                "Curso excluído com sucesso."
            );


        } catch (erro) {

            console.error(

                "Erro ao excluir curso:",

                erro
            );


            mostrarMensagem(

                "Não foi possível excluir o curso.",

                "erro"
            );
        }
    }


    /* ==================================================
       ABRIR E FECHAR GERENCIADOR
    ================================================== */

    botaoAbrir.addEventListener(

        "click",

        function () {

            if (
                hubConteudos
            ) {
                hubConteudos.hidden =
                    true;
            }


            gerenciador.hidden =
                false;

            iniciarObservacao();


            gerenciador
                .scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );
        }
    );


    botaoFechar?.addEventListener(

        "click",

        function () {

            gerenciador.hidden =
                true;


            limparFormulario();


            if (
                hubConteudos
            ) {

                hubConteudos.hidden =
                    false;


                hubConteudos.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );

                return;
            }


            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );
        }
    );


    botaoNovo?.addEventListener(

        "click",

        function () {

            limparFormulario();


            painelFormulario
                ?.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );


            campos.nome.focus();
        }
    );


    /* ==================================================
       EVENTOS DOS CAMPOS
    ================================================== */

    campos.nome?.addEventListener(

        "input",

        function () {

            if (
                !cursoEmEdicao

                &&

                !campos.id
                    .dataset
                    .editadoManualmente
            ) {

                campos.id.value =

                    normalizarIdentificador(

                        campos.nome.value
                    );
            }
        }
    );


    campos.id?.addEventListener(

        "input",

        function () {

            campos.id
                .dataset
                .editadoManualmente =

                campos.id.value

                    ? "true"

                    : "";
        }
    );


    campos.modalidade?.addEventListener(

        "change",

        function () {

            const nome =

                obterNomeModalidade(

                    campos.modalidade.value
                );


            if (
                !campos.infoModalidade
                    .value
                    .trim()
            ) {

                campos.infoModalidade.value =
                    nome;
            }


            if (
                !campos.detalheModalidade
                    .value
                    .trim()
            ) {

                campos.detalheModalidade.value =
                    nome;
            }
        }
    );


    campos.instituicaoResumo
        ?.addEventListener(

            "input",

            function () {

                if (
                    !campos.detalheInstituicao
                        .dataset
                        .editadoManualmente
                ) {

                    campos.detalheInstituicao.value =

                        campos.instituicaoResumo.value;
                }
            }
        );


    campos.detalheInstituicao
        ?.addEventListener(

            "input",

            function () {

                campos.detalheInstituicao
                    .dataset
                    .editadoManualmente =

                    campos.detalheInstituicao.value

                        ? "true"

                        : "";
            }
        );


    formulario.addEventListener(

        "submit",

        salvarCurso
    );


    botaoCancelar?.addEventListener(

        "click",

        limparFormulario
    );


    pesquisa?.addEventListener(

        "input",

        renderizarCursos
    );


    lista?.addEventListener(

        "click",

        function (evento) {

            const botao =

                evento.target.closest(

                    "button[data-acao]"
                );


            if (
                !botao
            ) {
                return;
            }


            const id =

                decodeURIComponent(

                    botao.dataset.id
                );


            if (
                botao.dataset.acao ===
                "editar"
            ) {

                const curso =

                    cursos.find(

                        function (item) {

                            return (
                                item.id ===
                                id
                            );
                        }
                    );


                if (
                    curso
                ) {

                    preencherFormulario(
                        curso
                    );
                }
            }


            if (
                botao.dataset.acao ===
                "excluir"
            ) {

                excluirCurso(
                    id
                );
            }
        }
    );


    limparFormulario();
}