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


const botaoAbrir =
    document.getElementById(
        "btn-gerenciar-profissoes"
    );

const gerenciador =
    document.getElementById(
        "gerenciador-profissoes-admin"
    );

const formulario =
    document.getElementById(
        "form-profissao-admin"
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
        function (id) {
            return document.getElementById(id);
        };


    const botaoFechar =
        obterElemento(
            "btn-fechar-gerenciador-profissoes"
        );

    const botaoNovo =
        obterElemento(
            "btn-nova-profissao-admin"
        );

    const botaoCancelar =
        obterElemento(
            "btn-cancelar-edicao-profissao"
        );

    const botaoSalvar =
        obterElemento(
            "btn-salvar-profissao-admin"
        );

    const tituloFormulario =
        obterElemento(
            "titulo-form-profissao-admin"
        );

    const mensagem =
        obterElemento(
            "mensagem-profissoes-admin"
        );

    const contador =
        obterElemento(
            "contador-profissoes-admin"
        );

    const pesquisa =
        obterElemento(
            "pesquisa-profissoes-admin"
        );

    const lista =
        obterElemento(
            "lista-profissoes-admin"
        );

    const painelFormulario =
        gerenciador.querySelector(
            ".painel-form-profissao-admin"
        );


    const campos = {
        id:
            obterElemento(
                "profissao-admin-id"
            ),

        nome:
            obterElemento(
                "profissao-admin-nome"
            ),

        simbolo:
            obterElemento(
                "profissao-admin-simbolo"
            ),

        ordem:
            obterElemento(
                "profissao-admin-ordem"
            ),

        area:
            obterElemento(
                "profissao-admin-area"
            ),

        areaTexto:
            obterElemento(
                "profissao-admin-area-texto"
            ),

        salario:
            obterElemento(
                "profissao-admin-salario"
            ),

        faixaSalario:
            obterElemento(
                "profissao-admin-faixa-salario"
            ),

        salarioTexto:
            obterElemento(
                "profissao-admin-salario-texto"
            ),

        formacao:
            obterElemento(
                "profissao-admin-formacao"
            ),

        duracao:
            obterElemento(
                "profissao-admin-duracao"
            ),

        descricao:
            obterElemento(
                "profissao-admin-descricao"
            ),

        habilidades:
            obterElemento(
                "profissao-admin-habilidades"
            ),

        url:
            obterElemento(
                "profissao-admin-url"
            ),

        textoLink:
            obterElemento(
                "profissao-admin-texto-link"
            )
    };


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


    let profissoes = [];

    let profissaoEmEdicao = null;

    let pararObservacao = null;

    let temporizadorMensagem = null;


    function normalizarTexto(valor) {
        return String(
            valor || ""
        )
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );
    }


    function normalizarIdentificador(valor) {
        return normalizarTexto(valor)
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );
    }


    function escaparHtml(valor) {
        return String(
            valor ?? ""
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function separarLinhas(valor) {
        return String(
            valor || ""
        )
            .split(/\r?\n/)
            .map(
                function (linha) {
                    return linha.trim();
                }
            )
            .filter(Boolean);
    }


    function obterNomeArea(area) {
        return (
            nomesAreas[area] ||
            area ||
            "Área não informada"
        );
    }


    function mostrarMensagem(
        texto,
        tipo = "sucesso"
    ) {
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
                    mensagem.hidden = true;
                },
                5000
            );
    }


    function limparFormulario() {
        formulario.reset();

        profissaoEmEdicao = null;

        campos.id.disabled = false;

        campos.id.dataset.editadoManualmente =
            "";

        campos.simbolo.value =
            "💼";

        campos.ordem.value =
            String(
                profissoes.length + 1
            );

        campos.area.value =
            "tecnologia";

        campos.areaTexto.value =
            "Tecnologia";

        campos.faixaSalario.value =
            "3000-6000";

        campos.textoLink.value =
            "Saiba mais →";

        tituloFormulario.textContent =
            "Cadastrar profissão";

        botaoSalvar.textContent =
            "Salvar profissão";

        botaoCancelar.hidden = true;
    }


    function criarDadosProfissao() {
        const id =
            normalizarIdentificador(
                campos.id.value
            );

        return {
            id: id,

            dados: {
                id:
                    id,

                nome:
                    campos.nome.value.trim(),

                simbolo:
                    campos.simbolo.value.trim() ||
                    "💼",

                ordem:
                    Number(
                        campos.ordem.value
                    ),

                area:
                    campos.area.value,

                areaTexto:
                    campos.areaTexto.value.trim(),

                salario:
                    Number(
                        campos.salario.value
                    ),

                faixaSalario:
                    campos.faixaSalario.value,

                salarioTexto:
                    campos.salarioTexto.value.trim(),

                formacao:
                    campos.formacao.value.trim(),

                duracao:
                    campos.duracao.value.trim(),

                descricao:
                    campos.descricao.value.trim(),

                habilidades:
                    separarLinhas(
                        campos.habilidades.value
                    ),

                url:
                    campos.url.value.trim(),

                textoLink:
                    campos.textoLink.value.trim() ||
                    "Saiba mais →",

                atualizadoEm:
                    serverTimestamp()
            }
        };
    }


    function preencherFormulario(
        profissao
    ) {
        profissaoEmEdicao =
            profissao;

        campos.id.value =
            profissao.id || "";

        campos.id.disabled =
            true;

        campos.nome.value =
            profissao.nome || "";

        campos.simbolo.value =
            profissao.simbolo ||
            "💼";

        campos.ordem.value =
            String(
                profissao.ordem || 1
            );

        campos.area.value =
            profissao.area ||
            "tecnologia";

        campos.areaTexto.value =
            profissao.areaTexto ||
            obterNomeArea(
                profissao.area
            );

        campos.salario.value =
            String(
                profissao.salario ?? 0
            );

        campos.faixaSalario.value =
            profissao.faixaSalario ||
            "3000-6000";

        campos.salarioTexto.value =
            profissao.salarioTexto || "";

        campos.formacao.value =
            profissao.formacao || "";

        campos.duracao.value =
            profissao.duracao || "";

        campos.descricao.value =
            profissao.descricao || "";

        campos.habilidades.value =
            Array.isArray(
                profissao.habilidades
            )
                ? profissao.habilidades.join(
                    "\n"
                )
                : String(
                    profissao.habilidades || ""
                );

        campos.url.value =
            profissao.url || "";

        campos.textoLink.value =
            profissao.textoLink ||
            "Saiba mais →";

        tituloFormulario.textContent =
            "Editar profissão";

        botaoSalvar.textContent =
            "Salvar alterações";

        botaoCancelar.hidden =
            false;

        painelFormulario?.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );
    }


    function renderizarProfissoes() {
        const termo =
            normalizarTexto(
                pesquisa?.value.trim()
            );

        const resultado =
            profissoes.filter(
                function (profissao) {
                    const habilidades =
                        Array.isArray(
                            profissao.habilidades
                        )
                            ? profissao.habilidades
                            : [];

                    const conteudo =
                        normalizarTexto(
                            [
                                profissao.nome,
                                profissao.areaTexto,
                                profissao.formacao,
                                profissao.descricao,
                                ...habilidades
                            ].join(" ")
                        );

                    return (
                        termo === "" ||
                        conteudo.includes(
                            termo
                        )
                    );
                }
            );


        contador.textContent =
            resultado.length === 1
                ? "1 profissão encontrada"
                : `${resultado.length} profissões encontradas`;

        lista.innerHTML = "";


        if (resultado.length === 0) {
            lista.innerHTML = `
                <p class="lista-eventos-admin-vazia">
                    Nenhuma profissão foi encontrada.
                </p>
            `;

            return;
        }


        resultado.forEach(
            function (profissao) {
                const item =
                    document.createElement(
                        "article"
                    );

                item.className =
                    "item-evento-admin item-curso-admin item-bolsa-admin item-profissao-admin";

                item.innerHTML = `
                    <span
                        class="data-item-evento-admin simbolo-item-curso-admin simbolo-item-bolsa-admin simbolo-item-profissao-admin"
                        aria-hidden="true"
                    >
                        ${escaparHtml(
                            profissao.simbolo ||
                            "💼"
                        )}
                    </span>

                    <div class="conteudo-item-evento-admin">

                        <span>
                            ${escaparHtml(
                                profissao.areaTexto ||
                                obterNomeArea(
                                    profissao.area
                                )
                            )}
                        </span>

                        <h3>
                            ${escaparHtml(
                                profissao.nome ||
                                "Profissão sem nome"
                            )}
                        </h3>

                        <p>
                            ${escaparHtml(
                                profissao.salarioTexto ||
                                "Salário não informado"
                            )}
                            •
                            ${escaparHtml(
                                profissao.formacao ||
                                "Formação não informada"
                            )}
                        </p>

                    </div>

                    <div class="acoes-item-evento-admin">

                        <button
                            type="button"
                            data-acao="editar"
                            data-id="${encodeURIComponent(
                                profissao.id
                            )}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-excluir-evento-admin"
                            data-acao="excluir"
                            data-id="${encodeURIComponent(
                                profissao.id
                            )}"
                        >
                            Excluir
                        </button>

                    </div>
                `;

                lista.appendChild(item);
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
                    "profissoes"
                ),

                function (snapshot) {
                    profissoes =
                        snapshot.docs
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
                                    profissaoA,
                                    profissaoB
                                ) {
                                    const diferenca =
                                        Number(
                                            profissaoA.ordem ||
                                            999999
                                        ) -
                                        Number(
                                            profissaoB.ordem ||
                                            999999
                                        );

                                    if (
                                        diferenca !== 0
                                    ) {
                                        return diferenca;
                                    }

                                    return String(
                                        profissaoA.nome ||
                                        ""
                                    ).localeCompare(
                                        String(
                                            profissaoB.nome ||
                                            ""
                                        ),
                                        "pt-BR"
                                    );
                                }
                            );

                    console.info(
                        "Profissões carregadas no ADMIN:",
                        profissoes.length
                    );

                    renderizarProfissoes();

                    if (!profissaoEmEdicao) {
                        campos.ordem.value =
                            String(
                                profissoes.length +
                                1
                            );
                    }
                },

                function (erro) {
                    console.error(
                        "Erro ao carregar profissões no ADMIN:",
                        erro
                    );

                    mostrarMensagem(
                        "Não foi possível carregar as profissões.",
                        "erro"
                    );
                }
            );
    }


    async function salvarProfissao(
        evento
    ) {
        evento.preventDefault();

        if (!formulario.reportValidity()) {
            return;
        }

        const {
            id,
            dados
        } = criarDadosProfissao();


        if (!id) {
            mostrarMensagem(
                "Digite um identificador válido para a profissão.",
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
                dados.salario
            ) ||
            dados.salario < 0
        ) {
            mostrarMensagem(
                "Informe um salário válido para a ordenação.",
                "erro"
            );

            campos.salario.focus();
            return;
        }


        if (
            dados.habilidades.length === 0
        ) {
            mostrarMensagem(
                "Adicione pelo menos uma habilidade.",
                "erro"
            );

            campos.habilidades.focus();
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
                    "profissoes",
                    id
                );


            if (!profissaoEmEdicao) {
                const documentoExistente =
                    await getDoc(
                        referencia
                    );

                if (
                    documentoExistente.exists()
                ) {
                    mostrarMensagem(
                        "Já existe uma profissão com esse identificador.",
                        "erro"
                    );

                    return;
                }

                dados.criadoEm =
                    serverTimestamp();
            }


            const estavaEditando =
                Boolean(
                    profissaoEmEdicao
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
                    ? "Profissão atualizada com sucesso."
                    : "Profissão cadastrada com sucesso."
            );
        } catch (erro) {
            console.error(
                "Erro ao salvar profissão:",
                erro
            );

            mostrarMensagem(
                "Não foi possível salvar a profissão.",
                "erro"
            );
        } finally {
            botaoSalvar.disabled =
                false;

            botaoSalvar.textContent =
                profissaoEmEdicao
                    ? "Salvar alterações"
                    : "Salvar profissão";
        }
    }


    async function excluirProfissao(
        id
    ) {
        const profissao =
            profissoes.find(
                function (item) {
                    return item.id === id;
                }
            );

        const nome =
            profissao?.nome || id;

        const confirmou =
            window.confirm(
                `Tem certeza que deseja excluir a profissão “${nome}”?`
            );

        if (!confirmou) {
            return;
        }


        try {
            await deleteDoc(
                doc(
                    db,
                    "profissoes",
                    id
                )
            );

            if (
                profissaoEmEdicao?.id === id
            ) {
                limparFormulario();
            }

            mostrarMensagem(
                "Profissão excluída com sucesso."
            );
        } catch (erro) {
            console.error(
                "Erro ao excluir profissão:",
                erro
            );

            mostrarMensagem(
                "Não foi possível excluir a profissão.",
                "erro"
            );
        }
    }


    botaoAbrir.addEventListener(
        "click",

        function () {
            hubConteudos.hidden =
                true;

            gerenciador.hidden =
                false;

            iniciarObservacao();

            gerenciador.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );
        }
    );


    botaoFechar.addEventListener(
        "click",

        function () {
            gerenciador.hidden =
                true;

            limparFormulario();

            hubConteudos.hidden =
                false;

            hubConteudos.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );
        }
    );


    botaoNovo.addEventListener(
        "click",

        function () {
            limparFormulario();

            painelFormulario?.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );

            campos.nome.focus();
        }
    );


    campos.nome.addEventListener(
        "input",

        function () {
            if (
                !profissaoEmEdicao &&
                !campos.id.dataset
                    .editadoManualmente
            ) {
                campos.id.value =
                    normalizarIdentificador(
                        campos.nome.value
                    );
            }
        }
    );


    campos.id.addEventListener(
        "input",

        function () {
            campos.id.dataset
                .editadoManualmente =
                campos.id.value
                    ? "true"
                    : "";
        }
    );


    campos.area.addEventListener(
        "change",

        function () {
            campos.areaTexto.value =
                obterNomeArea(
                    campos.area.value
                );
        }
    );


    formulario.addEventListener(
        "submit",
        salvarProfissao
    );


    botaoCancelar.addEventListener(
        "click",
        limparFormulario
    );


    pesquisa.addEventListener(
        "input",
        renderizarProfissoes
    );


    lista.addEventListener(
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
                const profissao =
                    profissoes.find(
                        function (item) {
                            return (
                                item.id === id
                            );
                        }
                    );

                if (profissao) {
                    preencherFormulario(
                        profissao
                    );
                }
            }

            if (
                botao.dataset.acao ===
                "excluir"
            ) {
                excluirProfissao(id);
            }
        }
    );


    limparFormulario();
}