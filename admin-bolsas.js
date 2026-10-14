"use strict";

import { db } from "./firebase-config.js";

import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const botaoAbrir =
    document.getElementById(
        "btn-gerenciar-bolsas"
    );

const gerenciador =
    document.getElementById(
        "gerenciador-bolsas-admin"
    );

const formulario =
    document.getElementById(
        "form-bolsa-admin"
    );

const hubConteudos =
    document.getElementById(
        "hub-conteudos-admin"
    );


if (
    botaoAbrir &&
    gerenciador &&
    formulario
) {
    const obterElemento =
        (id) =>
            document.getElementById(id);


    const botaoFechar =
        obterElemento(
            "btn-fechar-gerenciador-bolsas"
        );

    const botaoNovo =
        obterElemento(
            "btn-nova-bolsa-admin"
        );

    const botaoCancelar =
        obterElemento(
            "btn-cancelar-edicao-bolsa"
        );

    const botaoSalvar =
        obterElemento(
            "btn-salvar-bolsa-admin"
        );

    const tituloFormulario =
        obterElemento(
            "titulo-form-bolsa-admin"
        );

    const mensagem =
        obterElemento(
            "mensagem-bolsas-admin"
        );

    const contador =
        obterElemento(
            "contador-bolsas-admin"
        );

    const pesquisa =
        obterElemento(
            "pesquisa-bolsas-admin"
        );

    const lista =
        obterElemento(
            "lista-bolsas-admin"
        );

    const painelFormulario =
        gerenciador.querySelector(
            ".painel-form-bolsa-admin"
        );


    const campos = {
        id:
            obterElemento(
                "bolsa-admin-id"
            ),

        titulo:
            obterElemento(
                "bolsa-admin-titulo"
            ),

        simbolo:
            obterElemento(
                "bolsa-admin-simbolo"
            ),

        ordem:
            obterElemento(
                "bolsa-admin-ordem"
            ),

        tipo:
            obterElemento(
                "bolsa-admin-tipo"
            ),

        tipoTexto:
            obterElemento(
                "bolsa-admin-tipo-texto"
            ),

        nivel:
            obterElemento(
                "bolsa-admin-nivel"
            ),

        instituicao:
            obterElemento(
                "bolsa-admin-instituicao"
            ),

        descricao:
            obterElemento(
                "bolsa-admin-descricao"
            ),

        informacoes:
            obterElemento(
                "bolsa-admin-informacoes"
            ),

        prazoTexto:
            obterElemento(
                "bolsa-admin-prazo-texto"
            ),

        prazoOrdem:
            obterElemento(
                "bolsa-admin-prazo-ordem"
            ),

        url:
            obterElemento(
                "bolsa-admin-url"
            ),

        textoLink:
            obterElemento(
                "bolsa-admin-texto-link"
            )
    };


    let bolsas = [];

    let bolsaEmEdicao = null;

    let pararObservacao = null;

    let temporizadorMensagem = null;


    function normalizarTexto(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );
    }


    function normalizarIdentificador(
        texto
    ) {
        return normalizarTexto(texto)
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );
    }


    function escaparHtml(texto) {
        return String(texto ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function separarLinhas(texto) {
        return String(texto || "")
            .split(/\r?\n/)
            .map(
                (linha) =>
                    linha.trim()
            )
            .filter(Boolean);
    }


    function obterNomeNivel(nivel) {
        const nomes = {
            "ensino-medio":
                "Ensino médio",

            graduacao:
                "Graduação",

            tecnico:
                "Curso técnico"
        };

        return (
            nomes[nivel] ||
            nivel ||
            "Nível não informado"
        );
    }


    function obterTextoTipo(tipo) {
        const nomes = {
            integral:
                "Bolsa integral",

            parcial:
                "Bolsa parcial",

            financiamento:
                "Financiamento",

            auxilio:
                "Auxílio estudantil"
        };

        return (
            nomes[tipo] ||
            "Bolsa"
        );
    }


    function mostrarMensagem(
        texto,
        tipo = "sucesso"
    ) {
        if (!mensagem) {
            return;
        }

        window.clearTimeout(
            temporizadorMensagem
        );

        mensagem.textContent =
            texto;

        mensagem.classList.remove(
            "mensagem-sucesso",
            "mensagem-erro"
        );

        mensagem.classList.add(
            tipo === "erro"
                ? "mensagem-erro"
                : "mensagem-sucesso"
        );

        mensagem.hidden = false;

        temporizadorMensagem =
            window.setTimeout(
                function () {
                    mensagem.hidden =
                        true;
                },
                5000
            );
    }


    function limparFormulario() {
        formulario.reset();

        bolsaEmEdicao = null;

        campos.id.disabled =
            false;

        campos.id.dataset
            .editadoManualmente =
            "";

        campos.simbolo.value =
            "🎓";

        campos.ordem.value =
            String(
                bolsas.length + 1
            );

        campos.tipo.value =
            "integral";

        campos.tipoTexto.value =
            "Bolsa integral";

        campos.nivel.value =
            "graduacao";

        campos.prazoOrdem.value =
            "99999999";

        campos.textoLink.value =
            "Acessar página oficial →";

        tituloFormulario.textContent =
            "Cadastrar bolsa";

        botaoSalvar.textContent =
            "Salvar bolsa";

        botaoCancelar.hidden =
            true;
    }


    function criarDadosBolsa() {
        const id =
            normalizarIdentificador(
                campos.id.value
            );

        const titulo =
            campos.titulo.value.trim();

        return {
            id,

            dados: {
                id,

                nome:
                    titulo,

                titulo,

                simbolo:
                    campos.simbolo.value
                        .trim() ||
                    "🎓",

                ordem:
                    Number(
                        campos.ordem.value
                    ),

                tipo:
                    campos.tipo.value,

                tipoTexto:
                    campos.tipoTexto.value
                        .trim(),

                nivel:
                    campos.nivel.value,

                instituicao:
                    campos.instituicao.value
                        .trim(),

                descricao:
                    campos.descricao.value
                        .trim(),

                informacoes:
                    separarLinhas(
                        campos.informacoes
                            .value
                    ),

                prazoTexto:
                    campos.prazoTexto.value
                        .trim(),

                prazoOrdem:
                    Number(
                        campos.prazoOrdem
                            .value
                    ),

                url:
                    campos.url.value
                        .trim(),

                textoLink:
                    campos.textoLink.value
                        .trim() ||
                    "Acessar página oficial →",

                atualizadoEm:
                    serverTimestamp()
            }
        };
    }


    function preencherFormulario(
        bolsa
    ) {
        bolsaEmEdicao =
            bolsa;

        campos.id.value =
            bolsa.id || "";

        campos.id.disabled =
            true;

        campos.titulo.value =
            bolsa.titulo ||
            bolsa.nome ||
            "";

        campos.simbolo.value =
            bolsa.simbolo ||
            "🎓";

        campos.ordem.value =
            String(
                bolsa.ordem || 1
            );

        campos.tipo.value =
            bolsa.tipo ||
            "integral";

        campos.tipoTexto.value =
            bolsa.tipoTexto ||
            obterTextoTipo(
                bolsa.tipo
            );

        campos.nivel.value =
            bolsa.nivel ||
            "graduacao";

        campos.instituicao.value =
            bolsa.instituicao ||
            "";

        campos.descricao.value =
            bolsa.descricao ||
            "";

        campos.informacoes.value =
            Array.isArray(
                bolsa.informacoes
            )
                ? bolsa.informacoes
                    .join("\n")
                : "";

        campos.prazoTexto.value =
            bolsa.prazoTexto ||
            "";

        campos.prazoOrdem.value =
            String(
                bolsa.prazoOrdem ??
                99999999
            );

        campos.url.value =
            bolsa.url ||
            "";

        campos.textoLink.value =
            bolsa.textoLink ||
            "Acessar página oficial →";

        tituloFormulario.textContent =
            "Editar bolsa";

        botaoSalvar.textContent =
            "Salvar alterações";

        botaoCancelar.hidden =
            false;

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


    function renderizarBolsas() {
        if (!lista) {
            return;
        }

        const termo =
            normalizarTexto(
                pesquisa?.value.trim()
            );

        const bolsasFiltradas =
            bolsas.filter(
                function (bolsa) {
                    const texto =
                        normalizarTexto(
                            [
                                bolsa.titulo,
                                bolsa.nome,
                                bolsa.instituicao,
                                bolsa.tipoTexto,
                                bolsa.descricao
                            ].join(" ")
                        );

                    return (
                        termo === "" ||
                        texto.includes(
                            termo
                        )
                    );
                }
            );

        if (contador) {
            contador.textContent =
                bolsasFiltradas
                    .length === 1

                    ? "1 bolsa encontrada"

                    : `${bolsasFiltradas.length} bolsas encontradas`;
        }

        lista.innerHTML =
            "";

        if (
            bolsasFiltradas.length ===
            0
        ) {
            lista.innerHTML = `
                <p class="lista-eventos-admin-vazia">
                    Nenhuma bolsa foi encontrada.
                </p>
            `;

            return;
        }

        bolsasFiltradas.forEach(
            function (bolsa) {
                const item =
                    document.createElement(
                        "article"
                    );

                item.className =
                    "item-evento-admin item-curso-admin item-bolsa-admin";

                item.innerHTML = `
                    <span
                        class="data-item-evento-admin simbolo-item-curso-admin simbolo-item-bolsa-admin"
                        aria-hidden="true"
                    >
                        ${escaparHtml(
                            bolsa.simbolo ||
                            "🎓"
                        )}
                    </span>

                    <div class="conteudo-item-evento-admin">

                        <span>
                            ${escaparHtml(
                                bolsa.tipoTexto ||
                                obterTextoTipo(
                                    bolsa.tipo
                                )
                            )}
                        </span>

                        <h3>
                            ${escaparHtml(
                                bolsa.titulo ||
                                bolsa.nome ||
                                "Bolsa sem nome"
                            )}
                        </h3>

                        <p>
                            ${escaparHtml(
                                bolsa.instituicao ||
                                "Instituição não informada"
                            )}

                            •

                            ${escaparHtml(
                                obterNomeNivel(
                                    bolsa.nivel
                                )
                            )}
                        </p>

                    </div>

                    <div class="acoes-item-evento-admin">

                        <button
                            type="button"
                            data-acao="editar"
                            data-id="${encodeURIComponent(
                                bolsa.id
                            )}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-excluir-evento-admin"
                            data-acao="excluir"
                            data-id="${encodeURIComponent(
                                bolsa.id
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
        if (pararObservacao) {
            return;
        }

        pararObservacao =
            onSnapshot(
                collection(
                    db,
                    "bolsasEstudo"
                ),

                function (snapshot) {
                    bolsas =
                        snapshot.docs

                            .map(
                                function (
                                    documento
                                ) {
                                    return {
                                        ...documento
                                            .data(),

                                        id:
                                            documento.id
                                    };
                                }
                            )

                            .sort(
                                function (
                                    bolsaA,
                                    bolsaB
                                ) {
                                    const diferenca =
                                        Number(
                                            bolsaA.ordem ||
                                            9999
                                        ) -
                                        Number(
                                            bolsaB.ordem ||
                                            9999
                                        );

                                    if (
                                        diferenca !== 0
                                    ) {
                                        return diferenca;
                                    }

                                    return String(
                                        bolsaA.titulo ||
                                        bolsaA.nome ||
                                        ""
                                    ).localeCompare(
                                        String(
                                            bolsaB.titulo ||
                                            bolsaB.nome ||
                                            ""
                                        ),
                                        "pt-BR"
                                    );
                                }
                            );

                    renderizarBolsas();

                    if (
                        !bolsaEmEdicao
                    ) {
                        campos.ordem.value =
                            String(
                                bolsas.length +
                                1
                            );
                    }
                },

                function (erro) {
                    console.error(
                        "Erro ao carregar bolsas no ADMIN:",
                        erro
                    );

                    mostrarMensagem(
                        "Não foi possível carregar as bolsas.",
                        "erro"
                    );
                }
            );
    }


    async function salvarBolsa(
        evento
    ) {
        evento.preventDefault();

        if (
            !formulario
                .reportValidity()
        ) {
            return;
        }

        const {
            id,
            dados
        } =
            criarDadosBolsa();

        if (!id) {
            mostrarMensagem(
                "Digite um identificador válido para a bolsa.",
                "erro"
            );

            campos.id.focus();

            return;
        }

        if (
            !Number.isFinite(
                dados.ordem
            ) ||
            dados.ordem < 1
        ) {
            mostrarMensagem(
                "Informe uma ordem de relevância válida.",
                "erro"
            );

            campos.ordem.focus();

            return;
        }

        if (
            !Number.isFinite(
                dados.prazoOrdem
            ) ||
            dados.prazoOrdem < 0
        ) {
            mostrarMensagem(
                "Informe um valor válido para ordenar o prazo.",
                "erro"
            );

            campos.prazoOrdem.focus();

            return;
        }

        if (
            dados.informacoes
                .length === 0
        ) {
            mostrarMensagem(
                "Adicione pelo menos uma informação para o card.",
                "erro"
            );

            campos.informacoes.focus();

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
                    "bolsasEstudo",
                    id
                );

            if (
                !bolsaEmEdicao
            ) {
                const documentoExistente =
                    await getDoc(
                        referencia
                    );

                if (
                    documentoExistente
                        .exists()
                ) {
                    mostrarMensagem(
                        "Já existe uma bolsa com esse identificador.",
                        "erro"
                    );

                    return;
                }

                dados.criadoEm =
                    serverTimestamp();
            }

            const estavaEditando =
                Boolean(
                    bolsaEmEdicao
                );

            await setDoc(
                referencia,
                dados,
                {
                    merge: true
                }
            );

            limparFormulario();

            mostrarMensagem(
                estavaEditando
                    ? "Bolsa atualizada com sucesso."
                    : "Bolsa cadastrada com sucesso."
            );

        } catch (erro) {
            console.error(
                "Erro ao salvar bolsa:",
                erro
            );

            mostrarMensagem(
                "Não foi possível salvar a bolsa.",
                "erro"
            );

        } finally {
            botaoSalvar.disabled =
                false;

            botaoSalvar.textContent =
                bolsaEmEdicao
                    ? "Salvar alterações"
                    : "Salvar bolsa";
        }
    }


    async function excluirBolsa(
        id
    ) {
        const bolsa =
            bolsas.find(
                (item) =>
                    item.id === id
            );

        const nome =
            bolsa?.titulo ||
            bolsa?.nome ||
            id;

        const confirmou =
            window.confirm(
                `Tem certeza que deseja excluir a bolsa “${nome}”?`
            );

        if (!confirmou) {
            return;
        }

        try {
            await deleteDoc(
                doc(
                    db,
                    "bolsasEstudo",
                    id
                )
            );

            if (
                bolsaEmEdicao?.id ===
                id
            ) {
                limparFormulario();
            }

            mostrarMensagem(
                "Bolsa excluída com sucesso."
            );

        } catch (erro) {
            console.error(
                "Erro ao excluir bolsa:",
                erro
            );

            mostrarMensagem(
                "Não foi possível excluir a bolsa.",
                "erro"
            );
        }
    }


    botaoAbrir.addEventListener(
        "click",

        function () {
            if (hubConteudos) {
                hubConteudos.hidden =
                    true;
            }

            gerenciador.hidden =
                false;

            iniciarObservacao();

            gerenciador.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );
        }
    );


    botaoFechar
        ?.addEventListener(
            "click",

            function () {
                gerenciador.hidden =
                    true;

                limparFormulario();

                if (hubConteudos) {
                    hubConteudos.hidden =
                        false;

                    hubConteudos
                        .scrollIntoView(
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
                        top: 0,
                        behavior:
                            "smooth"
                    }
                );
            }
        );


    botaoNovo
        ?.addEventListener(
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

                campos.titulo.focus();
            }
        );


    campos.titulo
        ?.addEventListener(
            "input",

            function () {
                if (
                    !bolsaEmEdicao &&
                    !campos.id.dataset
                        .editadoManualmente
                ) {
                    campos.id.value =
                        normalizarIdentificador(
                            campos.titulo
                                .value
                        );
                }
            }
        );


    campos.id
        ?.addEventListener(
            "input",

            function () {
                campos.id.dataset
                    .editadoManualmente =
                    campos.id.value
                        ? "true"
                        : "";
            }
        );


    campos.tipo
        ?.addEventListener(
            "change",

            function () {
                campos.tipoTexto.value =
                    obterTextoTipo(
                        campos.tipo.value
                    );
            }
        );


    formulario.addEventListener(
        "submit",
        salvarBolsa
    );


    botaoCancelar
        ?.addEventListener(
            "click",
            limparFormulario
        );


    pesquisa
        ?.addEventListener(
            "input",
            renderizarBolsas
        );


    lista?.addEventListener(
        "click",

        function (evento) {
            const botao =
                evento.target.closest(
                    "button[data-acao]"
                );

            if (!botao) {
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
                const bolsa =
                    bolsas.find(
                        (item) =>
                            item.id === id
                    );

                if (bolsa) {
                    preencherFormulario(
                        bolsa
                    );
                }
            }

            if (
                botao.dataset.acao ===
                "excluir"
            ) {
                excluirBolsa(id);
            }
        }
    );


    limparFormulario();
}