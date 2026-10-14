"use strict";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    db
} from "./firebase-config.js";


const pagina =
    document.querySelector(
        ".pagina-mapa-oportunidades"
    );


if (pagina) {
    const pesquisa =
        document.getElementById(
            "pesquisa-regiao"
        );

    const gradeRegioes =
        document.getElementById(
            "grade-regioes-rio"
        );

    const instrucao =
        document.getElementById(
            "instrucao-mapa"
        );

    const nomeRegiao =
        document.getElementById(
            "nome-estado"
        );

    const descricaoRegiao =
        document.getElementById(
            "descricao-estado"
        );

    const totalUniversidades =
        document.getElementById(
            "total-universidades"
        );

    const totalCursos =
        document.getElementById(
            "total-cursos"
        );

    const totalBolsas =
        document.getElementById(
            "total-bolsas"
        );

    const totalInstituicoes =
        document.getElementById(
            "total-instituicoes"
        );

    const listaAreas =
        document.getElementById(
            "lista-areas"
        );

    const botaoExplorar =
        document.getElementById(
            "btn-explorar-estado"
        );

    const painelRegiao =
        document.querySelector(
            ".painel-estado"
        );


    const modal =
        document.getElementById(
            "modal-oportunidades"
        );

    const conteudoModal =
        document.querySelector(
            ".modal-oportunidades-conteudo"
        );

    const botaoFecharModal =
        document.getElementById(
            "fechar-modal-oportunidades"
        );

    const fundoModal =
        document.querySelector(
            "[data-fechar-modal-oportunidades]"
        );

    const tituloModal =
        document.getElementById(
            "titulo-modal-oportunidades"
        );

    const descricaoModal =
        document.getElementById(
            "descricao-modal-oportunidades"
        );

    const quantidadeModal =
        document.getElementById(
            "quantidade-oportunidades-modal"
        );

    const listaModal =
        document.getElementById(
            "lista-oportunidades-modal"
        );

    const filtrosModal =
        Array.from(
            document.querySelectorAll(
                ".filtro-oportunidades"
            )
        );


    let regioes = [];

    let regiaoSelecionadaId = "";

    let elementoFocadoAntesDoModal =
        null;

    let temporizadorFocoModal =
        null;


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
        return texto(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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


    function obterRegiao(id) {
        return (
            regioes.find(
                function (regiao) {
                    return (
                        texto(regiao.id) ===
                        texto(id)
                    );
                }
            ) ||
            null
        );
    }


    function atualizarRegiaoAtiva() {
        gradeRegioes
            .querySelectorAll(
                ".card-regiao-rio"
            )
            .forEach(
                function (card) {
                    const estaAtiva =
                        card.dataset.regiao ===
                        regiaoSelecionadaId;

                    card.classList.toggle(
                        "regiao-ativa",
                        estaAtiva
                    );

                    card.setAttribute(
                        "aria-pressed",
                        String(estaAtiva)
                    );
                }
            );
    }


    function limparPainel() {
        regiaoSelecionadaId = "";

        nomeRegiao.textContent =
            "Nenhuma região selecionada";

        descricaoRegiao.textContent =
            "Escolha uma região para visualizar suas oportunidades.";

        totalUniversidades.textContent =
            "—";

        totalCursos.textContent =
            "—";

        totalBolsas.textContent =
            "—";

        totalInstituicoes.textContent =
            "—";

        listaAreas.innerHTML =
            "<li>Nenhuma informação disponível.</li>";

        botaoExplorar.disabled =
            true;

        atualizarRegiaoAtiva();
    }


    function mostrarRegiao(regiao) {
        if (!regiao) {
            limparPainel();
            return;
        }

        regiaoSelecionadaId =
            texto(regiao.id);

        nomeRegiao.textContent =
            texto(regiao.nome);

        descricaoRegiao.textContent =
            texto(regiao.descricao);

        totalUniversidades.textContent =
            String(
                regiao.universidades ??
                0
            );

        totalCursos.textContent =
            String(
                regiao.cursos ??
                0
            );

        totalBolsas.textContent =
            String(
                regiao.bolsas ??
                0
            );

        totalInstituicoes.textContent =
            String(
                regiao.instituicoes ??
                0
            );

        listaAreas.innerHTML = "";


        const areas =
            Array.isArray(
                regiao.areas
            )
                ? regiao.areas
                : [];


        if (areas.length === 0) {
            listaAreas.innerHTML =
                "<li>Nenhuma informação disponível.</li>";
        } else {
            areas.forEach(
                function (area) {
                    const item =
                        document.createElement(
                            "li"
                        );

                    item.textContent =
                        texto(area);

                    listaAreas.appendChild(
                        item
                    );
                }
            );
        }


        instrucao.textContent =
            `${texto(regiao.nome)} selecionada.`;

        botaoExplorar.disabled =
            false;

        atualizarRegiaoAtiva();


        painelRegiao.classList.remove(
            "atualizando"
        );

        void painelRegiao.offsetWidth;

        painelRegiao.classList.add(
            "atualizando"
        );
    }


    function renderizarRegioes() {
        gradeRegioes.innerHTML = "";


        if (regioes.length === 0) {
            gradeRegioes.innerHTML = `
                <p class="estado-vazio-mapa">
                    Nenhuma região foi cadastrada.
                </p>
            `;

            limparPainel();
            return;
        }


        regioes.forEach(
            function (regiao) {
                const card =
                    document.createElement(
                        "button"
                    );

                card.type =
                    "button";

                card.className =
                    "card-regiao-rio";

                card.dataset.regiao =
                    texto(regiao.id);

                card.setAttribute(
                    "aria-pressed",
                    String(
                        texto(regiao.id) ===
                        regiaoSelecionadaId
                    )
                );


                if (
                    texto(regiao.id) ===
                    "baixada-fluminense"
                ) {
                    card.classList.add(
                        "card-regiao-baixada"
                    );
                }


                card.innerHTML = `
                    <span class="icone-regiao-rio">
                        ${escaparHtml(
                            regiao.icone ||
                            "📍"
                        )}
                    </span>

                    <div>

                        <strong>
                            ${escaparHtml(
                                regiao.nome
                            )}
                        </strong>

                        <small>
                            ${escaparHtml(
                                regiao.resumo
                            )}
                        </small>

                    </div>
                `;

                gradeRegioes.appendChild(
                    card
                );
            }
        );


        atualizarRegiaoAtiva();
    }


    function pesquisarRegiao() {
        const termo =
            normalizar(
                pesquisa.value
            );


        if (!termo) {
            limparPainel();

            instrucao.textContent =
                "Clique em uma região para visualizar as oportunidades.";

            return;
        }


        if (
            termo === "rio" ||
            termo === "rj" ||
            termo === "rio de janeiro"
        ) {
            limparPainel();

            nomeRegiao.textContent =
                "Pesquise uma região ou bairro";

            descricaoRegiao.textContent =
                "Exemplos: Zona Norte, Centro, Barra, Ilha do Governador ou Baixada Fluminense.";

            return;
        }


        const regiao =
            regioes.find(
                function (item) {
                    const termos = [
                        item.nome,

                        ...(
                            Array.isArray(
                                item.termosPesquisa
                            )
                                ? item.termosPesquisa
                                : []
                        )
                    ];

                    return termos.some(
                        function (valor) {
                            const valorNormalizado =
                                normalizar(valor);

                            return (
                                valorNormalizado.includes(
                                    termo
                                ) ||
                                termo.includes(
                                    valorNormalizado
                                )
                            );
                        }
                    );
                }
            );


        if (regiao) {
            mostrarRegiao(regiao);
            return;
        }


        limparPainel();

        nomeRegiao.textContent =
            "Região não encontrada";

        descricaoRegiao.textContent =
            "Tente pesquisar por uma região, bairro ou município atendido.";
    }


    function criarCardOportunidade(
        oportunidade,
        indice
    ) {
        const numero =
            String(
                indice + 1
            ).padStart(
                2,
                "0"
            );

        const idDetalhes =
            `detalhes-oportunidade-${regiaoSelecionadaId}-${indice}`;

        const site =
            obterUrlSegura(
                oportunidade.site
            );

        const inscricao =
            obterUrlSegura(
                oportunidade.inscricao
            );


        const linkSite =
            site
                ? `
                    <a
                        href="${escaparHtml(site)}"
                        class="link-oportunidade-principal"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Conhecer instituição ↗
                    </a>
                `
                : "";


        const linkInscricao =
            inscricao
                ? `
                    <a
                        href="${escaparHtml(inscricao)}"
                        class="link-oportunidade-secundario"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver ingresso e editais ↗
                    </a>
                `
                : "";


        return `
            <article class="card-oportunidade-modal">

                <button
                    type="button"
                    class="card-oportunidade-cabecalho"
                    aria-expanded="false"
                    aria-controls="${idDetalhes}"
                >

                    <div class="card-oportunidade-identidade">

                        <span class="card-oportunidade-posicao">
                            ${numero}
                        </span>

                        <div class="card-oportunidade-textos">

                            <span class="card-oportunidade-categoria">
                                ${escaparHtml(
                                    oportunidade.categoria
                                )}
                            </span>

                            <h3>
                                ${escaparHtml(
                                    oportunidade.nome
                                )}
                            </h3>

                            <p>
                                ${escaparHtml(
                                    oportunidade.localizacao
                                )}
                            </p>

                        </div>

                    </div>

                    <span
                        class="card-oportunidade-seta"
                        aria-hidden="true"
                    >
                        ↓
                    </span>

                </button>


                <div
                    class="card-oportunidade-detalhes"
                    id="${idDetalhes}"
                >

                    <div class="grade-informacoes-oportunidade">

                        <div class="informacao-oportunidade">

                            <strong>
                                📍 Onde encontrar
                            </strong>

                            <p>
                                ${escaparHtml(
                                    oportunidade.localizacao
                                )}
                            </p>

                        </div>


                        <div class="informacao-oportunidade">

                            <strong>
                                📝 Como entrar
                            </strong>

                            <p>
                                ${escaparHtml(
                                    oportunidade.ingresso
                                )}
                            </p>

                        </div>


                        <div class="informacao-oportunidade informacao-oportunidade-larga">

                            <strong>
                                🎓 Principais cursos
                            </strong>

                            <p>
                                ${escaparHtml(
                                    oportunidade.cursos
                                )}
                            </p>

                        </div>


                        <div class="informacao-oportunidade informacao-oportunidade-larga">

                            <strong>
                                💰 Bolsas, auxílios e gratuidade
                            </strong>

                            <p>
                                ${escaparHtml(
                                    oportunidade.apoio
                                )}
                            </p>

                        </div>

                    </div>


                    <div class="links-oportunidade-modal">

                        ${linkSite}

                        ${linkInscricao}

                    </div>

                </div>

            </article>
        `;
    }


    function renderizarOportunidades(
        filtro = "todas"
    ) {
        const regiao =
            obterRegiao(
                regiaoSelecionadaId
            );

        const oportunidades =
            Array.isArray(
                regiao?.oportunidades
            )
                ? [
                    ...regiao.oportunidades
                ].sort(
                    function (
                        oportunidadeA,
                        oportunidadeB
                    ) {
                        return (
                            Number(
                                oportunidadeA.ordem ||
                                999999
                            ) -
                            Number(
                                oportunidadeB.ordem ||
                                999999
                            )
                        );
                    }
                )
                : [];


        const filtradas =
            filtro === "todas"
                ? oportunidades
                : oportunidades.filter(
                    function (
                        oportunidade
                    ) {
                        return (
                            Array.isArray(
                                oportunidade.tipos
                            ) &&
                            oportunidade.tipos.includes(
                                filtro
                            )
                        );
                    }
                );


        quantidadeModal.textContent =
            filtradas.length === 1
                ? "1 oportunidade encontrada"
                : `${filtradas.length} oportunidades encontradas`;


        if (filtradas.length === 0) {
            listaModal.innerHTML = `
                <div class="mensagem-sem-oportunidades">

                    <strong>
                        Nenhuma oportunidade encontrada
                    </strong>

                    <span>
                        Ainda estamos adicionando informações
                        verificadas para esta região.
                    </span>

                </div>
            `;

            return;
        }


        listaModal.innerHTML =
            filtradas
                .map(
                    criarCardOportunidade
                )
                .join("");
    }


    function abrirModal() {
        const regiao =
            obterRegiao(
                regiaoSelecionadaId
            );


        if (!regiao) {
            instrucao.textContent =
                "Selecione uma região primeiro.";

            return;
        }


        elementoFocadoAntesDoModal =
            document.activeElement;

        modal.dataset.regiao =
            regiaoSelecionadaId;

        tituloModal.textContent =
            texto(regiao.nome);

        descricaoModal.textContent =
            texto(regiao.descricao);


        filtrosModal.forEach(
            function (filtro) {
                const ativo =
                    filtro.dataset
                        .filtroOportunidades ===
                    "todas";

                filtro.classList.toggle(
                    "ativo",
                    ativo
                );

                filtro.setAttribute(
                    "aria-pressed",
                    String(ativo)
                );
            }
        );


        renderizarOportunidades(
            "todas"
        );


        modal.classList.remove(
            "aberto"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-oportunidades-aberto"
        );


        requestAnimationFrame(
            function () {
                requestAnimationFrame(
                    function () {
                        modal.classList.add(
                            "aberto"
                        );
                    }
                );
            }
        );


        window.clearTimeout(
            temporizadorFocoModal
        );

        temporizadorFocoModal =
            window.setTimeout(
                function () {
                    if (
                        modal.classList.contains(
                            "aberto"
                        )
                    ) {
                        conteudoModal.focus();
                    }
                },
                450
            );
    }


    function fecharModal() {
        window.clearTimeout(
            temporizadorFocoModal
        );

        modal.classList.remove(
            "aberto"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-oportunidades-aberto"
        );


        const elementoAnterior =
            elementoFocadoAntesDoModal;

        elementoFocadoAntesDoModal =
            null;


        requestAnimationFrame(
            function () {
                if (
                    elementoAnterior &&
                    document.contains(
                        elementoAnterior
                    )
                ) {
                    elementoAnterior.focus();
                }
            }
        );
    }


    gradeRegioes.addEventListener(
        "click",

        function (evento) {
            const card =
                evento.target.closest(
                    ".card-regiao-rio"
                );

            if (
                !card ||
                !gradeRegioes.contains(
                    card
                )
            ) {
                return;
            }

            mostrarRegiao(
                obterRegiao(
                    card.dataset.regiao
                )
            );
        }
    );


    pesquisa.addEventListener(
        "input",
        pesquisarRegiao
    );


    botaoExplorar.addEventListener(
        "click",
        abrirModal
    );


    botaoFecharModal.addEventListener(
        "click",
        fecharModal
    );


    fundoModal.addEventListener(
        "click",
        fecharModal
    );


    filtrosModal.forEach(
        function (botaoFiltro) {
            botaoFiltro.addEventListener(
                "click",

                function () {
                    const filtro =
                        botaoFiltro.dataset
                            .filtroOportunidades;

                    filtrosModal.forEach(
                        function (item) {
                            const ativo =
                                item ===
                                botaoFiltro;

                            item.classList.toggle(
                                "ativo",
                                ativo
                            );

                            item.setAttribute(
                                "aria-pressed",
                                String(ativo)
                            );
                        }
                    );

                    renderizarOportunidades(
                        filtro
                    );

                    listaModal.scrollTo(
                        {
                            top: 0,
                            behavior: "smooth"
                        }
                    );
                }
            );
        }
    );


    listaModal.addEventListener(
        "click",

        function (evento) {
            const cabecalho =
                evento.target.closest(
                    ".card-oportunidade-cabecalho"
                );

            if (!cabecalho) {
                return;
            }

            const cardClicado =
                cabecalho.closest(
                    ".card-oportunidade-modal"
                );

            const estavaAberto =
                cardClicado.classList.contains(
                    "aberto"
                );


            listaModal
                .querySelectorAll(
                    ".card-oportunidade-modal.aberto"
                )
                .forEach(
                    function (card) {
                        card.classList.remove(
                            "aberto"
                        );

                        card.querySelector(
                            ".card-oportunidade-cabecalho"
                        )?.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                );


            if (!estavaAberto) {
                cardClicado.classList.add(
                    "aberto"
                );

                cabecalho.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        }
    );


    document.addEventListener(
        "keydown",

        function (evento) {
            if (
                !modal.classList.contains(
                    "aberto"
                )
            ) {
                return;
            }


            if (evento.key === "Escape") {
                fecharModal();
                return;
            }


            if (evento.key !== "Tab") {
                return;
            }


            const elementosFocaveis =
                Array.from(
                    modal.querySelectorAll(
                        `
                        a[href],
                        button:not([disabled]),
                        [tabindex]:not([tabindex="-1"])
                        `
                    )
                ).filter(
                    function (elemento) {
                        const detalhes =
                            elemento.closest(
                                ".card-oportunidade-detalhes"
                            );

                        const card =
                            elemento.closest(
                                ".card-oportunidade-modal"
                            );

                        if (
                            detalhes &&
                            card &&
                            !card.classList.contains(
                                "aberto"
                            )
                        ) {
                            return false;
                        }

                        return (
                            elemento.getClientRects()
                                .length > 0
                        );
                    }
                );


            if (
                elementosFocaveis.length === 0
            ) {
                evento.preventDefault();

                conteudoModal.focus();
                return;
            }


            const primeiro =
                elementosFocaveis[0];

            const ultimo =
                elementosFocaveis[
                    elementosFocaveis.length -
                    1
                ];


            if (
                evento.shiftKey &&
                document.activeElement ===
                primeiro
            ) {
                evento.preventDefault();
                ultimo.focus();
            } else if (
                !evento.shiftKey &&
                document.activeElement ===
                ultimo
            ) {
                evento.preventDefault();
                primeiro.focus();
            }
        }
    );


    limparPainel();


    onSnapshot(
        collection(
            db,
            "regioesOportunidades"
        ),

        function (snapshot) {
            regioes =
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
                            regiaoA,
                            regiaoB
                        ) {
                            return (
                                Number(
                                    regiaoA.ordem ||
                                    999999
                                ) -
                                Number(
                                    regiaoB.ordem ||
                                    999999
                                )
                            );
                        }
                    );


            renderizarRegioes();


            const selecionada =
                obterRegiao(
                    regiaoSelecionadaId
                );

            if (selecionada) {
                mostrarRegiao(
                    selecionada
                );
            } else {
                limparPainel();
            }


            const totalOportunidades =
                regioes.reduce(
                    function (
                        total,
                        regiao
                    ) {
                        return (
                            total +
                            (
                                Array.isArray(
                                    regiao.oportunidades
                                )
                                    ? regiao
                                        .oportunidades
                                        .length
                                    : 0
                            )
                        );
                    },
                    0
                );


            console.info(
                "Mapa de Oportunidades sincronizado com Firestore:",
                regioes.length,
                "região(ões) e",
                totalOportunidades,
                "oportunidade(s)."
            );
        },

        function (erro) {
            console.error(
                "Erro ao carregar o Mapa de Oportunidades:",
                erro
            );

            gradeRegioes.innerHTML = `
                <p class="estado-erro-mapa">
                    Não foi possível carregar as regiões agora.
                </p>
            `;

            limparPainel();
        }
    );
}