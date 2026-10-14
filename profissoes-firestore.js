"use strict";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    db
} from "./firebase-config.js";

import {
    alternarFavorito,
    observarFavoritos
} from "./favoritos-firestore.js";


const pagina =
    document.querySelector(
        ".pagina-guia-profissional"
    );


if (pagina) {
    const pesquisa =
        document.getElementById(
            "pesquisa-profissao"
        );

    const filtroArea =
        document.getElementById(
            "filtro-area-profissao"
        );

    const filtroSalario =
        document.getElementById(
            "filtro-salario-profissao"
        );

    const botaoFiltros =
        document.getElementById(
            "btn-aplicar-filtros-profissao"
        );

    const ordenacao =
        document.getElementById(
            "ordenar-profissoes"
        );

    const contador =
        document.getElementById(
            "contador-profissoes"
        );

    const grade =
        document.getElementById(
            "grade-profissoes"
        );

    const mensagemVazia =
        document.getElementById(
            "mensagem-sem-profissoes"
        );
    const elementosModalProfissao = {
        modal:
            document.getElementById(
                "modal-profissao"
            ),

        simbolo:
            document.getElementById(
                "modal-profissao-simbolo"
            ),

        area:
            document.getElementById(
                "modal-profissao-area"
            ),

        titulo:
            document.getElementById(
                "modal-profissao-titulo"
            ),

        resumo:
            document.getElementById(
                "modal-profissao-resumo"
            ),

        salario:
            document.getElementById(
                "modal-profissao-salario"
            ),

        formacao:
            document.getElementById(
                "modal-profissao-formacao"
            ),

        duracao:
            document.getElementById(
                "modal-profissao-duracao"
            ),

        sobre:
            document.getElementById(
                "modal-profissao-sobre"
            ),

        atividades:
            document.getElementById(
                "modal-profissao-atividades"
            ),

        areas:
            document.getElementById(
                "modal-profissao-areas"
            ),

        mercado:
            document.getElementById(
                "modal-profissao-mercado"
            ),

        habilidades:
            document.getElementById(
                "modal-profissao-habilidades"
            ),

        link:
            document.getElementById(
                "modal-profissao-link"
            ),

        secaoAtividades:
            document.getElementById(
                "secao-modal-profissao-atividades"
            ),

        secaoAreas:
            document.getElementById(
                "secao-modal-profissao-areas"
            ),

        secaoMercado:
            document.getElementById(
                "secao-modal-profissao-mercado"
            ),

        secaoHabilidades:
            document.getElementById(
                "secao-modal-profissao-habilidades"
            )
    };


    let ultimoBotaoModalProfissao =
        null;

    let temporizadorModalProfissao =
        null;


    let profissoes = [];

    let profissoesCarregadas = false;

    let idsFavoritos =
        new Set();


    function texto(valor) {
        return String(
            valor ?? ""
        ).trim();
    }


    function normalizar(valor) {
        return texto(valor)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase();
    }


    function escaparHtml(valor) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#039;"
        };

        return texto(valor).replace(
            /[&<>"']/g,

            function (caractere) {
                return caracteres[
                    caractere
                ];
            }
        );
    }


    function obterHabilidades(
        profissao
    ) {
        const habilidades =
            Array.isArray(
                profissao.habilidades
            )
                ? profissao.habilidades
                : texto(
                    profissao.habilidades
                ).split("\n");

        return habilidades
            .map(texto)
            .filter(Boolean);
    }


    function obterUrlSegura(valor) {
        const endereco =
            texto(valor);

        if (!endereco) {
            return "";
        }

        try {
            const url =
                new URL(
                    endereco,
                    window.location.href
                );

            if (
                url.protocol === "http:" ||
                url.protocol === "https:"
            ) {
                return url.href;
            }
        } catch (erro) {
            return "";
        }

        return "";
    }
    function obterListaDetalhes(
        profissao,
        nomesDosCampos
    ) {
        for (const nomeDoCampo of nomesDosCampos) {
            const valor =
                profissao[nomeDoCampo];

            const itens =
                Array.isArray(valor)
                    ? valor
                    : texto(valor).split("\n");

            const lista =
                itens
                    .map(texto)
                    .filter(Boolean);

            if (lista.length > 0) {
                return lista;
            }
        }

        return [];
    }


    function obterPrimeiroTexto(
        profissao,
        nomesDosCampos
    ) {
        for (const nomeDoCampo of nomesDosCampos) {
            const valor =
                texto(
                    profissao[nomeDoCampo]
                );

            if (valor) {
                return valor;
            }
        }

        return "";
    }


    function preencherEtiquetas(
        elemento,
        itens
    ) {
        elemento.innerHTML = "";

        itens.forEach(function (item) {
            const etiqueta =
                document.createElement("span");

            etiqueta.textContent =
                item;

            elemento.appendChild(
                etiqueta
            );
        });
    }


    function preencherAtividades(
        elemento,
        itens
    ) {
        elemento.innerHTML = "";

        itens.forEach(function (item) {
            const atividade =
                document.createElement("span");

            atividade.textContent =
                item;

            elemento.appendChild(
                atividade
            );
        });
    }
    function abrirModalProfissao(
        profissao,
        botaoOrigem
    ) {
        const modal =
            elementosModalProfissao.modal;

        if (!modal) {
            return;
        }

        clearTimeout(
            temporizadorModalProfissao
        );

        ultimoBotaoModalProfissao =
            botaoOrigem;


        const nome =
            texto(profissao.nome) ||
            "Profissão";

        const area =
            texto(
                profissao.areaTexto ||
                profissao.area
            ) ||
            "Área não informada";

        const resumo =
            texto(profissao.descricao) ||
            "Informações sobre essa profissão.";

        const sobre =
            obterPrimeiroTexto(
                profissao,
                [
                    "sobreProfissao",
                    "sobre",
                    "descricaoDetalhada",
                    "detalhes",
                    "descricao"
                ]
            );

        const atividades =
            obterListaDetalhes(
                profissao,
                [
                    "atividadesDiaDia",
                    "atividades",
                    "rotina"
                ]
            );

        let areasAtuacao =
            obterListaDetalhes(
                profissao,
                [
                    "areasAtuacao",
                    "atuacao",
                    "areas"
                ]
            );

        if (
            areasAtuacao.length === 0 &&
            area !== "Área não informada"
        ) {
            areasAtuacao = [area];
        }

        const mercado =
            obterPrimeiroTexto(
                profissao,
                [
                    "mercadoTrabalho",
                    "mercado",
                    "perspectivaMercado"
                ]
            );

        const habilidades =
            obterHabilidades(
                profissao
            );

        const url =
            obterUrlSegura(
                profissao.url
            );


        elementosModalProfissao.simbolo.textContent =
            texto(profissao.simbolo) ||
            "💼";

        elementosModalProfissao.area.textContent =
            area;

        elementosModalProfissao.titulo.textContent =
            nome;

        elementosModalProfissao.resumo.textContent =
            resumo;

        elementosModalProfissao.salario.textContent =
            texto(
                profissao.salarioTexto
            ) ||
            "Não informado";

        elementosModalProfissao.formacao.textContent =
            texto(
                profissao.formacao
            ) ||
            "Não informada";

        elementosModalProfissao.duracao.textContent =
            texto(
                profissao.duracao
            ) ||
            "Não informada";

        elementosModalProfissao.sobre.textContent =
            sobre ||
            resumo;


        preencherAtividades(
            elementosModalProfissao.atividades,
            atividades
        );

        preencherEtiquetas(
            elementosModalProfissao.areas,
            areasAtuacao
        );

        preencherEtiquetas(
            elementosModalProfissao.habilidades,
            habilidades
        );

        elementosModalProfissao.mercado.textContent =
            mercado;


        elementosModalProfissao.secaoAtividades.hidden =
            atividades.length === 0;

        elementosModalProfissao.secaoAreas.hidden =
            areasAtuacao.length === 0;

        elementosModalProfissao.secaoMercado.hidden =
            !mercado;

        elementosModalProfissao.secaoHabilidades.hidden =
            habilidades.length === 0;


        if (url) {
            elementosModalProfissao.link.href =
                url;

            elementosModalProfissao.link.hidden =
                false;
        } else {
            elementosModalProfissao.link.removeAttribute(
                "href"
            );

            elementosModalProfissao.link.hidden =
                true;
        }


        modal.hidden = false;

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-profissao-aberto"
        );

        requestAnimationFrame(
            function () {
                modal.classList.add(
                    "ativo"
                );
            }
        );
    }


    function fecharModalProfissao() {
        const modal =
            elementosModalProfissao.modal;

        if (
            !modal ||
            modal.hidden
        ) {
            return;
        }

        clearTimeout(
            temporizadorModalProfissao
        );

        modal.classList.remove(
            "ativo"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-profissao-aberto"
        );

        temporizadorModalProfissao =
            setTimeout(
                function () {
                    modal.hidden = true;

                    if (
                        ultimoBotaoModalProfissao
                    ) {
                        ultimoBotaoModalProfissao.focus();
                    }

                    ultimoBotaoModalProfissao =
                        null;
                },
                360
            );
    }
    function criarCard(profissao) {
        const id =
            texto(profissao.id);

        const nome =
            texto(profissao.nome) ||
            "Profissão";

        const estaFavoritada =
            idsFavoritos.has(id);

        const habilidades =
            obterHabilidades(
                profissao
            );

        const url =
            obterUrlSegura(
                profissao.url
            );

        const textoLink =
            texto(
                profissao.textoLink
            ) ||
            "Saiba mais →";


        const habilidadesHtml =
            habilidades.map(
                function (habilidade) {
                    return `
                        <span>
                            ${escaparHtml(habilidade)}
                        </span>
                    `;
                }
            ).join("");


        const linkHtml = `
            <button
                class="link-profissao btn-saiba-mais-profissao"
                type="button"
                data-profissao-id="${escaparHtml(id)}"
                aria-label="Ver detalhes sobre ${escaparHtml(nome)}"
            >
                ${escaparHtml(textoLink)}
            </button>
        `;
        const card =
            document.createElement(
                "article"
            );

        card.className =
            "card-profissao";

        card.dataset.id = id;

        card.dataset.nome = nome;

        card.dataset.area =
            texto(
                profissao.area
            );

        card.dataset.salario =
            String(
                Number(
                    profissao.salario ||
                    0
                )
            );

        card.dataset.faixaSalario =
            texto(
                profissao.faixaSalario
            );


        card.innerHTML = `
            <div class="cabecalho-card-profissao">

                <div class="simbolo-profissao">
                    ${escaparHtml(
            profissao.simbolo ||
            "💼"
        )}
                </div>

                <button
                    class="btn-favorito-profissao${estaFavoritada ? " favoritado" : ""}"
                    type="button"
                    aria-pressed="${estaFavoritada}"
                    aria-label="${estaFavoritada
                ? `Remover ${escaparHtml(nome)} dos favoritos`
                : `Adicionar ${escaparHtml(nome)} aos favoritos`
            }"
                >
                    ${estaFavoritada ? "♥" : "♡"}
                </button>

            </div>

            <span class="area-profissao">
                ${escaparHtml(
                profissao.areaTexto ||
                profissao.area ||
                "Área não informada"
            )}
            </span>

            <h3>
                ${escaparHtml(nome)}
            </h3>

            <p>
                ${escaparHtml(
                profissao.descricao
            )}
            </p>

            <div class="informacoes-profissao">

                <div>
                    <span class="rotulo-profissao">
                        Salário médio
                    </span>

                    <strong>
                        ${escaparHtml(
                profissao.salarioTexto ||
                "Não informado"
            )}
                    </strong>
                </div>

                <div>
                    <span class="rotulo-profissao">
                        Formação
                    </span>

                    <strong>
                        ${escaparHtml(
                profissao.formacao ||
                "Não informada"
            )}
                    </strong>
                </div>

                <div>
                    <span class="rotulo-profissao">
                        Duração média
                    </span>

                    <strong>
                        ${escaparHtml(
                profissao.duracao ||
                "Não informada"
            )}
                    </strong>
                </div>

            </div>

            <div class="habilidades-profissao">
                ${habilidadesHtml}
            </div>

            ${linkHtml}
        `;

        return card;
    }


    function obterProfissoesVisiveis() {
        const termo =
            normalizar(
                pesquisa.value
            );

        const area =
            filtroArea.value;

        const faixa =
            filtroSalario.value;


        const resultado =
            profissoes.filter(
                function (profissao) {
                    const conteudo =
                        normalizar(
                            [
                                profissao.nome,
                                profissao.areaTexto,
                                profissao.descricao,
                                profissao.formacao,
                                ...obterHabilidades(
                                    profissao
                                )
                            ].join(" ")
                        );

                    return (
                        (
                            !termo ||
                            conteudo.includes(
                                termo
                            )
                        ) &&
                        (
                            !area ||
                            texto(
                                profissao.area
                            ) === area
                        ) &&
                        (
                            !faixa ||
                            texto(
                                profissao.faixaSalario
                            ) === faixa
                        )
                    );
                }
            );


        resultado.sort(
            function (
                profissaoA,
                profissaoB
            ) {
                if (
                    ordenacao.value ===
                    "nome"
                ) {
                    return texto(
                        profissaoA.nome
                    ).localeCompare(
                        texto(
                            profissaoB.nome
                        ),
                        "pt-BR"
                    );
                }

                if (
                    ordenacao.value ===
                    "salario"
                ) {
                    return (
                        Number(
                            profissaoB.salario ||
                            0
                        ) -
                        Number(
                            profissaoA.salario ||
                            0
                        )
                    );
                }

                return (
                    Number(
                        profissaoA.ordem ||
                        999999
                    ) -
                    Number(
                        profissaoB.ordem ||
                        999999
                    )
                );
            }
        );

        return resultado;
    }


    function renderizarProfissoes() {
        const resultado =
            obterProfissoesVisiveis();

        grade.innerHTML = "";


        resultado.forEach(
            function (profissao) {
                grade.appendChild(
                    criarCard(
                        profissao
                    )
                );
            }
        );


        contador.textContent =
            resultado.length === 1
                ? "1 profissão encontrada"
                : `${resultado.length} profissões encontradas`;


        mensagemVazia.hidden =
            resultado.length !== 0;
    }


    function obterDadosFavorito(
        profissao
    ) {
        return {
            tipo:
                "profissao",

            itemId:
                texto(
                    profissao.id
                ),

            titulo:
                texto(
                    profissao.nome
                ) ||
                "Profissão",

            subtitulo:
                [
                    profissao.areaTexto,
                    profissao.salarioTexto
                ]
                    .map(texto)
                    .filter(Boolean)
                    .join(" • "),

            descricao:
                texto(
                    profissao.descricao
                ),

            imagem:
                "",

            url:
                obterUrlSegura(
                    profissao.url
                ),

            paginaOrigem:
                "guia-profissional.html"
        };
    }


    function redirecionarParaLogin() {
        const url =
            new URL(
                "./login.html",
                window.location.href
            );

        url.searchParams.set(
            "voltar",
            window.location.href
        );

        window.location.href =
            url.href;
    }


    pesquisa.addEventListener(
        "input",
        renderizarProfissoes
    );


    pesquisa.addEventListener(
        "keydown",

        function (evento) {
            if (
                evento.key ===
                "Enter"
            ) {
                evento.preventDefault();

                renderizarProfissoes();
            }
        }
    );


    filtroArea.addEventListener(
        "change",
        renderizarProfissoes
    );


    filtroSalario.addEventListener(
        "change",
        renderizarProfissoes
    );


    ordenacao.addEventListener(
        "change",
        renderizarProfissoes
    );


    botaoFiltros.addEventListener(
        "click",
        renderizarProfissoes
    );


    grade.addEventListener(
        "click",

        async function (evento) {

            const botaoDetalhes =
                evento.target.closest(
                    ".btn-saiba-mais-profissao"
                );

            if (
                botaoDetalhes &&
                grade.contains(
                    botaoDetalhes
                )
            ) {
                evento.preventDefault();

                const profissaoSelecionada =
                    profissoes.find(
                        function (item) {
                            return (
                                texto(item.id) ===
                                botaoDetalhes.dataset.profissaoId
                            );
                        }
                    );

                if (profissaoSelecionada) {
                    abrirModalProfissao(
                        profissaoSelecionada,
                        botaoDetalhes
                    );
                }

                return;
            }
            const botao =
                evento.target.closest(
                    ".btn-favorito-profissao"
                );

            if (
                !botao ||
                !grade.contains(botao) ||
                botao.disabled
            ) {
                return;
            }

            evento.preventDefault();


            const card =
                botao.closest(
                    ".card-profissao"
                );

            const profissao =
                profissoes.find(
                    function (item) {
                        return (
                            texto(item.id) ===
                            card?.dataset.id
                        );
                    }
                );

            if (!profissao) {
                return;
            }


            botao.disabled = true;

            try {
                await alternarFavorito(
                    obterDadosFavorito(
                        profissao
                    )
                );
            } catch (erro) {
                const codigo =
                    texto(
                        erro?.code
                    ).toLowerCase();

                const mensagem =
                    texto(
                        erro?.message
                    ).toLowerCase();

                const precisaEntrar =
                    codigo.includes(
                        "nao-autenticado"
                    ) ||
                    codigo.includes(
                        "unauthenticated"
                    ) ||
                    mensagem.includes(
                        "entrar"
                    ) ||
                    mensagem.includes(
                        "autenticad"
                    );

                if (precisaEntrar) {
                    redirecionarParaLogin();
                    return;
                }

                console.error(
                    "Erro ao alterar profissão favorita:",
                    erro
                );

                alert(
                    "Não foi possível atualizar esse favorito."
                );
            } finally {
                botao.disabled = false;
            }
        }


    );

    document
        .querySelectorAll(
            "[data-fechar-modal-profissao]"
        )
        .forEach(
            function (elemento) {
                elemento.addEventListener(
                    "click",

                    function (evento) {
                        evento.preventDefault();
                        evento.stopPropagation();

                        fecharModalProfissao();
                    }
                );
            }
        );


    document.addEventListener(
        "keydown",

        function (evento) {
            const modal =
                elementosModalProfissao.modal;

            if (
                evento.key === "Escape" &&
                modal &&
                !modal.hidden
            ) {
                fecharModalProfissao();
            }
        }
    );
    observarFavoritos(
        "profissao",

        function (favoritos) {
            idsFavoritos =
                new Set(
                    favoritos.map(
                        function (favorito) {
                            return texto(
                                favorito.itemId
                            );
                        }
                    )
                );

            if (profissoesCarregadas) {
                renderizarProfissoes();
            }
        },

        function (erro) {
            console.error(
                "Erro ao carregar profissões favoritas:",
                erro
            );
        }
    );


    onSnapshot(
        collection(
            db,
            "profissoes"
        ),

        function (snapshot) {
            profissoes =
                snapshot.docs.map(
                    function (documento) {
                        return {
                            id:
                                documento.id,

                            ...documento.data()
                        };
                    }
                );

            profissoesCarregadas =
                true;

            renderizarProfissoes();

            console.info(
                "Profissões sincronizadas com Firestore:",
                profissoes.length
            );
        },

        function (erro) {
            profissoesCarregadas =
                true;

            console.error(
                "Erro ao carregar profissões:",
                erro
            );

            grade.innerHTML = `
                <p class="estado-erro-profissoes">
                    Não foi possível carregar as profissões agora.
                </p>
            `;

            contador.textContent =
                "Profissões indisponíveis";

            mensagemVazia.hidden =
                true;
        }
    );
}