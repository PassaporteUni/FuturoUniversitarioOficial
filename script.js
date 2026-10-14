"use strict";

/* ==================================================
   FUNÇÃO GERAL DE NORMALIZAÇÃO

   Remove acentos e transforma o texto em minúsculo.
   Exemplo: "Mecânica" vira "mecanica".
================================================== */

function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/* ==================================================
   ROLAGEM SUAVE - PÁGINA INICIAL
================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const botaoExplorar =
        document.getElementById("btn-explorar");

    const secaoExplorar =
        document.getElementById("explorar");

    if (!botaoExplorar || !secaoExplorar) {
        return;
    }

    let animacaoRolagem = null;

    botaoExplorar.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            if (animacaoRolagem) {
                cancelAnimationFrame(
                    animacaoRolagem
                );
            }

            const inicio = window.scrollY;

            const destino = Math.max(
                0,
                secaoExplorar.getBoundingClientRect().top +
                window.scrollY -
                85
            );

            const distancia = destino - inicio;
            const duracao = 1100;

            let tempoInicial = null;

            const html =
                document.documentElement;

            const comportamentoAnterior =
                html.style.scrollBehavior;

            html.style.scrollBehavior = "auto";

            function animar(tempoAtual) {
                if (tempoInicial === null) {
                    tempoInicial = tempoAtual;
                }

                const progresso = Math.min(
                    (tempoAtual - tempoInicial) /
                    duracao,
                    1
                );

                const suavizacao =
                    0.5 -
                    Math.cos(
                        progresso * Math.PI
                    ) / 2;

                window.scrollTo({
                    top:
                        inicio +
                        distancia *
                        suavizacao,

                    behavior: "auto"
                });

                if (progresso < 1) {
                    animacaoRolagem =
                        requestAnimationFrame(
                            animar
                        );
                } else {
                    html.style.scrollBehavior =
                        comportamentoAnterior;

                    animacaoRolagem = null;
                }
            }

            animacaoRolagem =
                requestAnimationFrame(
                    animar
                );
        }
    );
});
/* ==================================================
   PESQUISA GERAL DA PÁGINA DESCOBRIR
================================================== */

const paginaDescobrir = document.querySelector(
    ".pagina-descobrir"
);

if (paginaDescobrir) {
    const campoPesquisaDescobrir =
        document.getElementById(
            "pesquisa-descobrir"
        );

    const botaoPesquisaDescobrir =
        document.getElementById(
            "btn-pesquisar-descobrir"
        );

    const mensagemPesquisaDescobrir =
        document.getElementById(
            "mensagem-pesquisa-descobrir"
        );

    const destinosPesquisa = [
        {
            termos: [
                "universidade",
                "universidades",
                "faculdade",
                "faculdades",
                "graduacao",
                "graduação",
                "instituicao",
                "instituição",
                "instituicoes",
                "instituições",
                "ensino superior",

                "ufrj",
                "universidade federal do rio de janeiro",

                "uerj",
                "universidade do estado do rio de janeiro",

                "uff",
                "universidade federal fluminense",

                "unirio",
                "universidade federal do estado do rio de janeiro",

                "puc rio",
                "puc-rio",
                "pontificia universidade catolica do rio de janeiro",
                "pontifícia universidade católica do rio de janeiro"
            ],

            pagina: "universidades.html"
        },

        {
            termos: [
                "curso tecnico",
                "curso técnico",
                "cursos tecnicos",
                "cursos técnicos",
                "curso",
                "cursos",
                "tecnico",
                "técnico",
                "tecnicos",
                "técnicos",
                "formacao tecnica",
                "formação técnica",
                "profissionalizante"
            ],

            pagina: "cursos-tecnicos.html"
        },

        {
            termos: [
                "bolsa",
                "bolsas",
                "bolsa de estudo",
                "bolsas de estudo",
                "auxilio",
                "auxílio",
                "financiamento",
                "desconto",
                "gratuidade"
            ],

            pagina: "bolsas.html"
        },

        {
            termos: [
                "profissao",
                "profissão",
                "profissoes",
                "profissões",
                "carreira",
                "carreiras",
                "guia profissional",
                "mercado de trabalho",
                "salario",
                "salário"
            ],

            pagina: "guia-profissional.html"
        },

        {
            termos: [
                "mapa",
                "mapa de oportunidades",
                "localizacao",
                "localização",
                "perto de mim",
                "oportunidades proximas",
                "oportunidades próximas",
                "instituicoes proximas",
                "instituições próximas"
            ],

            pagina: "mapa-oportunidades.html"
        },

        {
            termos: [
                "teste vocacional",
                "vocacional",
                "teste",
                "descobrir carreira",
                "qual profissao",
                "qual profissão",
                "escolher profissao",
                "escolher profissão"
            ],

            pagina: "teste-vocacional.html"
        }
    ];

    function mostrarMensagemDescobrir(
        mensagem
    ) {
        if (!mensagemPesquisaDescobrir) {
            return;
        }

        mensagemPesquisaDescobrir.textContent =
            mensagem;

        mensagemPesquisaDescobrir.hidden =
            false;
    }

    function esconderMensagemDescobrir() {
        if (mensagemPesquisaDescobrir) {
            mensagemPesquisaDescobrir.hidden =
                true;
        }
    }

    function pesquisarNaPaginaDescobrir() {
        const pesquisa = normalizarTexto(
            campoPesquisaDescobrir?.value.trim()
        );

        if (pesquisa === "") {
            mostrarMensagemDescobrir(
                "Digite o que você deseja encontrar."
            );

            campoPesquisaDescobrir?.focus();
            return;
        }

        const destinoEncontrado =
            destinosPesquisa.find(
                function (destino) {
                    return destino.termos.some(
                        function (termo) {
                            const termoNormalizado =
                                normalizarTexto(
                                    termo
                                );

                            return (
                                pesquisa.includes(
                                    termoNormalizado
                                ) ||
                                termoNormalizado.includes(
                                    pesquisa
                                )
                            );
                        }
                    );
                }
            );

        if (destinoEncontrado) {
            esconderMensagemDescobrir();

            window.location.href =
                destinoEncontrado.pagina;

            return;
        }

        mostrarMensagemDescobrir(
            "Não encontramos essa opção. Tente pesquisar por universidade, curso técnico, bolsa, profissão, mapa ou teste vocacional."
        );
    }

    botaoPesquisaDescobrir?.addEventListener(
        "click",
        pesquisarNaPaginaDescobrir
    );

    campoPesquisaDescobrir?.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                event.preventDefault();

                pesquisarNaPaginaDescobrir();
            }
        }
    );

    campoPesquisaDescobrir?.addEventListener(
        "input",
        esconderMensagemDescobrir
    );
}

/* ==================================================
   PÁGINA DE UNIVERSIDADES
================================================== */

const paginaUniversidades =
    document.querySelector(
        ".pagina-universidades"
    );

if (paginaUniversidades) {

    /* ==================================================
       ELEMENTOS DA PÁGINA
    ================================================== */

    const campoPesquisaUniversidade =
        document.getElementById(
            "pesquisa-universidade"
        );

    const filtroLocalizacao =
        document.getElementById(
            "filtro-localizacao"
        );

    const filtroTipo =
        document.getElementById(
            "filtro-tipo"
        );

    const filtroArea =
        document.getElementById(
            "filtro-area"
        );

    const botaoFiltrosUniversidade =
        document.getElementById(
            "btn-aplicar-filtros"
        );

    const botaoLimparFiltros =
        document.getElementById(
            "btn-limpar-filtros"
        );

    const ordenarUniversidades =
        document.getElementById(
            "ordenar-universidades"
        );

    const contadorUniversidades =
        document.getElementById(
            "contador-resultados"
        );

    const mensagemSemUniversidades =
        document.getElementById(
            "mensagem-sem-resultados"
        );

    const gradeUniversidades =
        document.getElementById(
            "grade-universidades"
        );

    /* ==================================================
       VERIFICAÇÃO DA BASE
    ================================================== */

    let universidadesFavoritas = [];

        let universidadesAtuais =
        (
            typeof universidadesData !==
            "undefined" &&
            Array.isArray(
                universidadesData
            )
        )
            ? universidadesData
            : [];


    function aplicarDadosFirestoreUniversidades(
        universidades
    ) {
        if (
            !Array.isArray(
                universidades
            )
        ) {
            return;
        }

        universidadesAtuais =
            universidades;

        aplicarFiltrosUniversidades();
    }


    window.addEventListener(
        "universidades:dados-firestore",

        function (evento) {
            aplicarDadosFirestoreUniversidades(
                evento.detail
            );
        }
    );


    if (
        Array.isArray(
            window.universidadesFirestoreDados
        )
    ) {
        aplicarDadosFirestoreUniversidades(
            window.universidadesFirestoreDados
        );
    }

    const promessaFavoritosFirestore =
        import(
            new URL(
                "favoritos-firestore.js",
                document.currentScript.src
            ).href
        );

    if (
        typeof universidadesData === "undefined" ||
        !Array.isArray(universidadesData)
    ) {
        console.error(
            "A base universidadesData não foi encontrada."
        );

        contadorUniversidades.textContent =
            "Não foi possível carregar as instituições.";

        gradeUniversidades.innerHTML = `
            <p class="mensagem-sem-resultados">
                O banco de universidades não foi carregado.
                Verifique o arquivo universidades-data.js.
            </p>
        `;
    } else {

        /* ==================================================
           FAVORITOS
        ================================================== */

    }
    function universidadeEstaFavoritada(id) {
        return universidadesFavoritas.includes(
            String(id)
        );
    }


    async function alternarFavoritoUniversidade(
        universidade,
        botao
    ) {
        botao.disabled = true;

        try {
            const {
                alternarFavorito
            } = await promessaFavoritosFirestore;

            await alternarFavorito({
                tipo: "universidade",

                itemId:
                    String(universidade.id),

                titulo:
                    universidade.nome,

                subtitulo:
                    `${universidade.sigla} • ${universidade.uf}`,

                descricao:
                    universidade.descricao,

                imagem:
                    universidade.logo,

                url:
                    universidade.site,

                paginaOrigem:
                    "universidades.html"
            });

        } catch (erro) {

            if (
                erro.code ===
                "favoritos/usuario-nao-autenticado"
            ) {
                const urlLogin =
                    new URL(
                        "login.html",
                        window.location.href
                    );

                urlLogin.searchParams.set(
                    "voltar",
                    window.location.href
                );

                window.location.assign(
                    urlLogin.href
                );

                return;
            }

            console.error(
                "Erro ao alterar universidade favorita:",
                erro
            );

        } finally {

            if (botao.isConnected) {
                botao.disabled = false;
            }

        }
    }


    async function inicializarFavoritosUniversidades() {
        try {
            const {
                observarFavoritos
            } = await promessaFavoritosFirestore;

            observarFavoritos(
                "universidade",

                function (favoritos) {
                    universidadesFavoritas =
                        favoritos.map(
                            function (favorito) {
                                return String(
                                    favorito.itemId
                                );
                            }
                        );

                    aplicarFiltrosUniversidades();
                }
            );

        } catch (erro) {
            console.error(
                "Erro ao iniciar os favoritos:",
                erro
            );
        }
    }

    /* ==================================================
       FUNÇÕES AUXILIARES
    ================================================== */

    function normalizarTexto(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();
    }

    function formatarTextoTipo(texto) {
        const textos = {
            publica: "Pública",
            privada: "Privada",
            federal: "Federal",
            estadual: "Estadual",
            comunitaria: "Comunitária"
        };

        return textos[texto] || texto;
    }

    function formatarNomeArea(area) {
        const nomes = {
            tecnologia: "Tecnologia",
            engenharia: "Engenharia",
            saude: "Saúde",
            humanas: "Humanas",
            administracao: "Administração",
            design: "Design"
        };

        return nomes[area] || area;
    }

    function obterSimboloUniversidade(
        universidade
    ) {
        const siglaLimpa =
            universidade.sigla
                .replace("/", "")
                .replace("-", "");

        return siglaLimpa.substring(0, 3);
    }

    function universidadePertenceLocalizacao(
        universidade,
        localizacao
    ) {
        if (!localizacao) {
            return true;
        }

        const cidadesNormalizadas =
            universidade.cidades.map(
                function (cidade) {
                    return normalizarTexto(cidade);
                }
            );

        const cidadesBaixada = [
            "duque de caxias",
            "nova iguacu",
            "nilopolis",
            "mesquita",
            "belford roxo",
            "sao joao de meriti",
            "queimados",
            "japeri",
            "paracambi"
        ];

        const cidadesInterior = [
            "macae",
            "petropolis",
            "teresopolis",
            "nova friburgo",
            "resende",
            "volta redonda",
            "campos dos goytacazes",
            "santo antonio de padua",
            "seropedica",
            "tres rios",
            "angra dos reis",
            "itaguai",
            "valenca",
            "pinheiral",
            "rio das ostras"
        ];

        if (localizacao === "capital") {
            return cidadesNormalizadas.includes(
                "rio de janeiro"
            );
        }

        if (
            localizacao ===
            "baixada-fluminense"
        ) {
            return cidadesNormalizadas.some(
                function (cidade) {
                    return cidadesBaixada.includes(
                        cidade
                    );
                }
            );
        }

        if (localizacao === "niteroi") {
            return cidadesNormalizadas.includes(
                "niteroi"
            );
        }

        if (localizacao === "interior") {
            return cidadesNormalizadas.some(
                function (cidade) {
                    return cidadesInterior.includes(
                        cidade
                    );
                }
            );
        }

        return true;
    }

    function universidadePertenceTipo(
        universidade,
        tipoSelecionado
    ) {
        if (!tipoSelecionado) {
            return true;
        }

        if (
            tipoSelecionado ===
            "tecnologica"
        ) {
            return [
                "cefet-rj",
                "ifrj"
            ].includes(universidade.id);
        }

        return (
            universidade.tipo ===
            tipoSelecionado ||
            universidade.categoria ===
            tipoSelecionado
        );
    }

    function universidadePossuiArea(
        universidade,
        areaSelecionada
    ) {
        if (!areaSelecionada) {
            return true;
        }

        return universidade.areas.includes(
            areaSelecionada
        );
    }

    function universidadeCorrespondePesquisa(
        universidade,
        termoPesquisa
    ) {
        if (!termoPesquisa) {
            return true;
        }

        const cursos =
            universidade.cursos
                .map(function (curso) {
                    return curso.nome;
                })
                .join(" ");

        const cidades =
            universidade.cidades.join(" ");

        const areas =
            universidade.areas
                .map(formatarNomeArea)
                .join(" ");

        const textoCompleto = normalizarTexto(`
                ${universidade.nome}
                ${universidade.sigla}
                ${universidade.tipo}
                ${universidade.categoria}
                ${universidade.descricao}
                ${cursos}
                ${cidades}
                ${areas}
            `);

        return textoCompleto.includes(
            termoPesquisa
        );
    }

    /* ==================================================
       CONTADOR
    ================================================== */

    function atualizarContadorUniversidades(
        quantidade
    ) {
        contadorUniversidades.textContent =
            quantidade === 1
                ? "1 instituição encontrada"
                : `${quantidade} instituições encontradas`;

        mensagemSemUniversidades.hidden =
            quantidade !== 0;
    }

    /* ==================================================
       CRIAÇÃO DOS CARDS
    ================================================== */

    function criarCardUniversidade(
        universidade
    ) {
        const card =
            document.createElement(
                "article"
            );

        card.className =
            "card-universidade";

        card.dataset.id =
            universidade.id;

        card.dataset.nome =
            universidade.nome;

        card.dataset.tipo =
            universidade.tipo;

        const estaFavoritada =
            universidadeEstaFavoritada(
                universidade.id
            );

        const cursosEmDestaque =
            universidade.cursos
                .slice(0, 4);

        const outrasOpcoes =
            universidade.cursos.length -
            cursosEmDestaque.length;

        const cidadesExibidas =
            universidade.cidades
                .slice(0, 3)
                .join(", ");

        const outrasCidades =
            universidade.cidades.length - 3;

        const textoCidades =
            outrasCidades > 0
                ? `${cidadesExibidas} e mais ${outrasCidades}`
                : cidadesExibidas;

        const tagsAreas =
            universidade.areas
                .slice(0, 3)
                .map(function (area) {
                    return `
                            <span>
                                ${formatarNomeArea(area)}
                            </span>
                        `;
                })
                .join("");

        const listaCursos =
            cursosEmDestaque
                .map(function (curso) {
                    return `
                            <li>
                                ${curso.nome}
                            </li>
                        `;
                })
                .join("");

        card.innerHTML = `
                <div class="cabecalho-card-universidade">

                <div class="simbolo-instituicao">
                    <img
                        src="${universidade.logo}"
                        alt="Logo da ${universidade.nome}"
                        class="logo-instituicao"
                    >
                </div>

                    <button
                        class="btn-favorito ${estaFavoritada
                ? "favoritado"
                : ""
            }"
                        type="button"
                        data-id="${universidade.id}"
                        aria-label="${estaFavoritada
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }"
                        title="${estaFavoritada
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }"
                    >
                        ${estaFavoritada
                ? "♥"
                : "♡"
            }
                    </button>

                </div>

                <span class="tipo-instituicao">
                    ${formatarTextoTipo(universidade.tipo)}
                    •
                    ${universidade.rotuloCategoria
                ? universidade.rotuloCategoria
                : formatarTextoTipo(universidade.categoria)
            }
                </span>

                <h3>
                    ${universidade.nome}
                </h3>

                <p class="sigla-instituicao">
                    ${universidade.sigla}
                </p>

                <p class="local-instituicao">
                    📍 ${textoCidades} — ${universidade.uf}
                </p>

                <p>
                    ${universidade.descricao}
                </p>

                <div class="tags-universidade">
                    ${tagsAreas}
                </div>

                <div class="cursos-destaque-universidade">

                    <strong>
                        Alguns cursos:
                    </strong>

                    <ul>
                        ${listaCursos}
                    </ul>

                </div>

                <div class="acoes-card-universidade">

                    <a
                        href="${universidade.paginaCursos}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link-instituicao"
                    >
                        →
                    </a>

                    <a
                        href="${universidade.site}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link-site-oficial"
                    >
                        Como ingressar
                    </a>

                </div>
            `;

        const botaoFavorito =
            card.querySelector(
                ".btn-favorito"
            );

        botaoFavorito.addEventListener(
            "click",

            async function (evento) {
                evento.stopImmediatePropagation();

                await alternarFavoritoUniversidade(
                    universidade,
                    botaoFavorito
                );
            }
        );

        return card;
    }

    function renderizarUniversidades(
        universidades
    ) {
        gradeUniversidades.innerHTML = "";

        universidades.forEach(
            function (universidade) {
                const card =
                    criarCardUniversidade(
                        universidade
                    );

                gradeUniversidades.appendChild(
                    card
                );
            }
        );

        atualizarContadorUniversidades(
            universidades.length
        );
    }

    /* ==================================================
       ORDENAÇÃO
    ================================================== */
    function ordenarListaUniversidades(
        universidades
    ) {
        const listaOrdenada = [
            ...universidades
        ];

        const tipoOrdenacao =
            ordenarUniversidades.value;

        if (tipoOrdenacao === "nome") {
            listaOrdenada.sort(
                function (a, b) {
                    return a.nome.localeCompare(
                        b.nome,
                        "pt-BR"
                    );
                }
            );
        }

        if (
            tipoOrdenacao ===
            "publicas-primeiro"
        ) {
            listaOrdenada.sort(
                function (a, b) {
                    if (
                        a.tipo === b.tipo
                    ) {
                        return a.nome.localeCompare(
                            b.nome,
                            "pt-BR"
                        );
                    }

                    return a.tipo === "publica"
                        ? -1
                        : 1;
                }
            );
        }

        if (
            tipoOrdenacao ===
            "mais-cursos"
        ) {
            listaOrdenada.sort(
                function (a, b) {
                    return (
                        b.cursos.length -
                        a.cursos.length
                    );
                }
            );
        }

        if (
            tipoOrdenacao ===
            "relevancia"
        ) {
            listaOrdenada.sort(
                function (a, b) {
                    const favoritoA =
                        universidadeEstaFavoritada(
                            a.id
                        )
                            ? 1
                            : 0;

                    const favoritoB =
                        universidadeEstaFavoritada(
                            b.id
                        )
                            ? 1
                            : 0;

                    if (
                        favoritoA !== favoritoB
                    ) {
                        return (
                            favoritoB -
                            favoritoA
                        );
                    }

                    return (
                        b.cursos.length -
                        a.cursos.length
                    );
                }
            );
        }

        return listaOrdenada;
    }

    /* ==================================================
       FILTROS
    ================================================== */

    function aplicarFiltrosUniversidades() {
        const termoPesquisa =
            normalizarTexto(
                campoPesquisaUniversidade.value
            );

        const localizacaoSelecionada =
            filtroLocalizacao.value;

        const tipoSelecionado =
            filtroTipo.value;

        const areaSelecionada =
            filtroArea.value;

        const universidadesFiltradas =
            universidadesAtuais.filter(
                function (universidade) {
                    const correspondePesquisa =
                        universidadeCorrespondePesquisa(
                            universidade,
                            termoPesquisa
                        );

                    const correspondeLocalizacao =
                        universidadePertenceLocalizacao(
                            universidade,
                            localizacaoSelecionada
                        );

                    const correspondeTipo =
                        universidadePertenceTipo(
                            universidade,
                            tipoSelecionado
                        );

                    const correspondeArea =
                        universidadePossuiArea(
                            universidade,
                            areaSelecionada
                        );

                    return (
                        correspondePesquisa &&
                        correspondeLocalizacao &&
                        correspondeTipo &&
                        correspondeArea
                    );
                }
            );

        const universidadesOrdenadas =
            ordenarListaUniversidades(
                universidadesFiltradas
            );

        renderizarUniversidades(
            universidadesOrdenadas
        );
    }

    function limparFiltrosUniversidades() {
        campoPesquisaUniversidade.value = "";
        filtroLocalizacao.value = "";
        filtroTipo.value = "";
        filtroArea.value = "";
        ordenarUniversidades.value =
            "relevancia";

        aplicarFiltrosUniversidades();

        campoPesquisaUniversidade.focus();
    }

    /* ==================================================
       EVENTOS
    ================================================== */

    botaoFiltrosUniversidade.addEventListener(
        "click",
        aplicarFiltrosUniversidades
    );

    botaoLimparFiltros.addEventListener(
        "click",
        limparFiltrosUniversidades
    );

    campoPesquisaUniversidade.addEventListener(
        "input",
        aplicarFiltrosUniversidades
    );

    campoPesquisaUniversidade.addEventListener(
        "keydown",
        function (evento) {
            if (evento.key === "Enter") {
                aplicarFiltrosUniversidades();
            }
        }
    );

    filtroLocalizacao.addEventListener(
        "change",
        aplicarFiltrosUniversidades
    );

    filtroTipo.addEventListener(
        "change",
        aplicarFiltrosUniversidades
    );

    filtroArea.addEventListener(
        "change",
        aplicarFiltrosUniversidades
    );

    ordenarUniversidades.addEventListener(
        "change",
        aplicarFiltrosUniversidades
    );

    /* ==================================================
       INICIALIZAÇÃO
    ================================================== */

    aplicarFiltrosUniversidades();
    inicializarFavoritosUniversidades();
}


/* ==================================================
   TESTE VOCACIONAL
================================================== */

const paginaTesteVocacional = document.querySelector(
    ".pagina-teste-vocacional"
);

if (paginaTesteVocacional) {
    /* ==================================================
   ELEMENTOS DA PÁGINA
================================================== */

    const telaInicialTeste = document.getElementById(
        "tela-inicial-teste"
    );

    const telaPerguntasTeste = document.getElementById(
        "tela-perguntas-teste"
    );

    const telaPreferenciasTeste =
        document.getElementById(
            "tela-preferencias-teste"
        );

    const formPreferenciasTeste =
        document.getElementById(
            "form-preferencias-teste"
        );

    const preferenciaLocalizacao =
        document.getElementById(
            "preferencia-localizacao"
        );

    const btnVoltarPreferencias =
        document.getElementById(
            "btn-voltar-preferencias"
        );

    const telaCarregamentoResultado = document.getElementById(
        "tela-carregamento-resultado"
    );

    const telaResultadoTeste = document.getElementById(
        "tela-resultado-teste"
    );

    const btnComecarTeste = document.getElementById(
        "btn-comecar-teste"
    );

    const btnVoltarPergunta = document.getElementById(
        "btn-voltar-pergunta"
    );

    const btnAvancarPergunta = document.getElementById(
        "btn-avancar-pergunta"
    );

    const btnRefazerTeste = document.getElementById(
        "btn-refazer-teste"
    );

    const numeroPergunta = document.getElementById(
        "numero-pergunta"
    );

    const tituloPergunta = document.getElementById(
        "titulo-pergunta"
    );

    const descricaoPergunta = document.getElementById(
        "descricao-pergunta"
    );

    const alternativasTeste = document.getElementById(
        "alternativas-teste"
    );

    const porcentagemProgresso = document.getElementById(
        "porcentagem-progresso"
    );

    const preenchimentoProgresso = document.getElementById(
        "preenchimento-progresso"
    );

    const iconeAreaPrincipal = document.getElementById(
        "icone-area-principal"
    );

    const nomeAreaPrincipal = document.getElementById(
        "nome-area-principal"
    );

    const porcentagemAreaPrincipal = document.getElementById(
        "porcentagem-area-principal"
    );

    const descricaoAreaPrincipal = document.getElementById(
        "descricao-area-principal"
    );

    const rankingAreas = document.getElementById(
        "ranking-areas"
    );

    const listaProfissoesRecomendadas = document.getElementById(
        "lista-profissoes-recomendadas"
    );

    const listaCursosRecomendados = document.getElementById(
        "lista-cursos-recomendados"
    );

    const listaPontosFortes = document.getElementById(
        "lista-pontos-fortes"
    );

    const textoRecomendacoesUniversidades =
        document.getElementById(
            "texto-recomendacoes-universidades"
        );

    const listaUniversidadesRecomendadas =
        document.getElementById(
            "lista-universidades-recomendadas"
        );

    /* ==================================================
       DADOS DAS ÁREAS
    ================================================== */

    const areasTeste = {
        tecnologia: {
            nome: "Tecnologia",
            icone: "💻",

            descricao:
                "Seu perfil demonstra interesse por inovação, lógica, " +
                "soluções digitais e resolução de problemas. Você pode " +
                "se identificar com ambientes dinâmicos, aprendizado " +
                "contínuo e criação de novas ferramentas.",

            profissoes: [
                "Desenvolvedor de Software",
                "Analista de Sistemas",
                "Cientista de Dados",
                "Especialista em Segurança Digital"
            ],

            cursos: [
                "Ciência da Computação",
                "Sistemas de Informação",
                "Análise e Desenvolvimento de Sistemas",
                "Engenharia de Software"
            ],

            pontosFortes: [
                "Raciocínio lógico",
                "Curiosidade tecnológica",
                "Facilidade para resolver problemas",
                "Interesse por inovação"
            ]
        },

        engenharia: {
            nome: "Engenharia",
            icone: "⚙️",

            descricao:
                "Seu perfil combina planejamento, raciocínio lógico e " +
                "interesse em entender como as coisas funcionam. Você " +
                "pode gostar de construir, testar e aperfeiçoar projetos " +
                "que geram soluções práticas.",

            profissoes: [
                "Engenheiro Civil",
                "Engenheiro Mecânico",
                "Engenheiro de Automação",
                "Engenheiro Eletricista"
            ],

            cursos: [
                "Engenharia Civil",
                "Engenharia Mecânica",
                "Engenharia Elétrica",
                "Engenharia de Controle e Automação"
            ],

            pontosFortes: [
                "Pensamento analítico",
                "Planejamento",
                "Precisão",
                "Resolução de problemas práticos"
            ]
        },

        saude: {
            nome: "Saúde",
            icone: "🩺",

            descricao:
                "Seu perfil apresenta sensibilidade, responsabilidade e " +
                "interesse pelo bem-estar das pessoas. Você pode se sentir " +
                "realizado ajudando, orientando e contribuindo diretamente " +
                "para melhorar a qualidade de vida de outras pessoas.",

            profissoes: [
                "Médico",
                "Enfermeiro",
                "Fisioterapeuta",
                "Nutricionista"
            ],

            cursos: [
                "Medicina",
                "Enfermagem",
                "Fisioterapia",
                "Nutrição"
            ],

            pontosFortes: [
                "Empatia",
                "Responsabilidade",
                "Atenção aos detalhes",
                "Interesse pelo bem-estar humano"
            ]
        },

        humanas: {
            nome: "Humanas",
            icone: "📚",

            descricao:
                "Seu perfil demonstra interesse por pessoas, ideias, " +
                "sociedade e comunicação. Você pode gostar de compreender " +
                "comportamentos, defender argumentos, ensinar e analisar " +
                "questões sociais e culturais.",

            profissoes: [
                "Advogado",
                "Psicólogo",
                "Professor",
                "Jornalista"
            ],

            cursos: [
                "Direito",
                "Psicologia",
                "História",
                "Jornalismo"
            ],

            pontosFortes: [
                "Comunicação",
                "Pensamento crítico",
                "Interpretação",
                "Compreensão das pessoas"
            ]
        },

        administracao: {
            nome: "Administração",
            icone: "📊",

            descricao:
                "Seu perfil apresenta organização, iniciativa e interesse " +
                "por planejamento. Você pode se identificar com liderança, " +
                "gestão de projetos, tomada de decisões e criação de " +
                "estratégias para alcançar objetivos.",

            profissoes: [
                "Administrador",
                "Gestor de Projetos",
                "Analista Financeiro",
                "Especialista em Marketing"
            ],

            cursos: [
                "Administração",
                "Gestão de Recursos Humanos",
                "Marketing",
                "Ciências Contábeis"
            ],

            pontosFortes: [
                "Organização",
                "Liderança",
                "Visão estratégica",
                "Tomada de decisões"
            ]
        },

        design: {
            nome: "Design",
            icone: "🎨",

            descricao:
                "Seu perfil demonstra criatividade, percepção visual e " +
                "interesse em transformar ideias em experiências. Você " +
                "pode gostar de comunicar mensagens por meio de imagens, " +
                "formas, interfaces e projetos autorais.",

            profissoes: [
                "Designer Gráfico",
                "Designer de Interfaces",
                "Diretor de Arte",
                "Designer de Produto"
            ],

            cursos: [
                "Design Gráfico",
                "Design Digital",
                "Publicidade e Propaganda",
                "Design de Produto"
            ],

            pontosFortes: [
                "Criatividade",
                "Percepção visual",
                "Originalidade",
                "Comunicação por imagens"
            ]
        }
    };

    /* ==================================================
       PERGUNTAS PROVISÓRIAS

       Quando as perguntas definitivas estiverem prontas,
       substitua somente este array.
    ================================================== */

    const perguntasTeste = [
        {
            pergunta:
                "Em um projeto em grupo, qual função você assumiria naturalmente?",

            descricao:
                "Escolha a opção que mais combina com o seu comportamento.",

            alternativas: [
                {
                    texto:
                        "Desenvolver a parte digital ou pesquisar ferramentas.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Planejar a estrutura e encontrar uma solução prática.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Escutar os participantes e ajudar quem estiver com dificuldade.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Pesquisar o tema e organizar a explicação do trabalho.",

                    pontos: {
                        humanas: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Dividir as tarefas e acompanhar os prazos.",

                    pontos: {
                        administracao: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Criar a apresentação, as imagens e a identidade visual.",

                    pontos: {
                        design: 3,
                        tecnologia: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Qual dessas atividades parece mais interessante para você?",

            descricao:
                "Pense no que você faria mesmo sem receber uma nota por isso.",

            alternativas: [
                {
                    texto:
                        "Criar um aplicativo, site ou programa.",

                    pontos: {
                        tecnologia: 3,
                        design: 1
                    }
                },

                {
                    texto:
                        "Montar, consertar ou descobrir como uma máquina funciona.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Aprender sobre o corpo humano e formas de cuidar das pessoas.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Ler, escrever, debater ou compreender a sociedade.",

                    pontos: {
                        humanas: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Criar uma estratégia para organizar ou melhorar um negócio.",

                    pontos: {
                        administracao: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Produzir ilustrações, vídeos, interfaces ou peças visuais.",

                    pontos: {
                        design: 3,
                        humanas: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Que tipo de problema você prefere resolver?",

            descricao:
                "Escolha o tipo de desafio que mais desperta sua curiosidade.",

            alternativas: [
                {
                    texto:
                        "Um erro em um sistema ou uma tarefa que pode ser automatizada.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Uma estrutura ou equipamento que precisa funcionar melhor.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Uma situação que esteja afetando a saúde ou o bem-estar de alguém.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Um conflito entre pessoas ou uma questão social difícil.",

                    pontos: {
                        humanas: 3,
                        saude: 1
                    }
                },

                {
                    texto:
                        "Uma equipe desorganizada ou um projeto fora do prazo.",

                    pontos: {
                        administracao: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Uma mensagem ou produto que não consegue chamar atenção.",

                    pontos: {
                        design: 3,
                        administracao: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Qual ambiente de trabalho parece mais atraente?",

            descricao:
                "Imagine em qual ambiente você se sentiria mais motivado.",

            alternativas: [
                {
                    texto:
                        "Um espaço tecnológico com computadores e projetos digitais.",

                    pontos: {
                        tecnologia: 3,
                        design: 1
                    }
                },

                {
                    texto:
                        "Um laboratório, oficina, indústria ou obra.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Um hospital, clínica ou ambiente de atendimento.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Uma escola, tribunal, redação ou espaço de pesquisa.",

                    pontos: {
                        humanas: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Uma empresa com reuniões, metas e decisões importantes.",

                    pontos: {
                        administracao: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Um estúdio criativo ou agência de comunicação.",

                    pontos: {
                        design: 3,
                        administracao: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Qual habilidade você mais gostaria de desenvolver?",

            descricao:
                "Escolha a capacidade que seria mais útil para seus objetivos.",

            alternativas: [
                {
                    texto:
                        "Programar e dominar ferramentas digitais.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Projetar e construir soluções eficientes.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Cuidar, orientar e agir em situações delicadas.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Argumentar, escrever e compreender diferentes pontos de vista.",

                    pontos: {
                        humanas: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Liderar equipes, negociar e organizar projetos.",

                    pontos: {
                        administracao: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Desenhar, editar e comunicar ideias visualmente.",

                    pontos: {
                        design: 3,
                        tecnologia: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Quando você precisa aprender algo novo, o que mais ajuda?",

            descricao:
                "Escolha a forma de aprendizagem mais próxima da sua.",

            alternativas: [
                {
                    texto:
                        "Testar ferramentas e descobrir como elas funcionam.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Entender as regras e aplicar em exercícios práticos.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Relacionar o conteúdo com situações reais envolvendo pessoas.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Ler, conversar e refletir sobre diferentes interpretações.",

                    pontos: {
                        humanas: 3,
                        saude: 1
                    }
                },

                {
                    texto:
                        "Criar um plano, estabelecer etapas e acompanhar o progresso.",

                    pontos: {
                        administracao: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Usar imagens, referências visuais e exemplos criativos.",

                    pontos: {
                        design: 3,
                        humanas: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Qual resultado faria você sentir mais orgulho?",

            descricao:
                "Pense no impacto que você gostaria de causar com seu trabalho.",

            alternativas: [
                {
                    texto:
                        "Criar uma tecnologia usada por muitas pessoas.",

                    pontos: {
                        tecnologia: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Ver um projeto ou estrutura funcionando perfeitamente.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Ajudar alguém a recuperar sua saúde ou qualidade de vida.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Defender uma ideia, ensinar ou transformar uma realidade social.",

                    pontos: {
                        humanas: 3,
                        saude: 1
                    }
                },

                {
                    texto:
                        "Fazer uma equipe ou empresa alcançar um grande objetivo.",

                    pontos: {
                        administracao: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Criar algo original que seja lembrado pela sua aparência.",

                    pontos: {
                        design: 3,
                        tecnologia: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Como você costuma tomar decisões importantes?",

            descricao:
                "Escolha a alternativa mais próxima do seu jeito de decidir.",

            alternativas: [
                {
                    texto:
                        "Comparo informações e procuro a solução mais lógica.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 2
                    }
                },

                {
                    texto:
                        "Analiso riscos, funcionamento e resultados possíveis.",

                    pontos: {
                        engenharia: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Penso em como a decisão pode afetar o bem-estar das pessoas.",

                    pontos: {
                        saude: 3,
                        humanas: 2
                    }
                },

                {
                    texto:
                        "Considero diferentes opiniões e contextos.",

                    pontos: {
                        humanas: 3,
                        saude: 1
                    }
                },

                {
                    texto:
                        "Avalio objetivos, recursos disponíveis e consequências.",

                    pontos: {
                        administracao: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Confio na criatividade e busco uma solução diferente.",

                    pontos: {
                        design: 3,
                        tecnologia: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Qual matéria escolar mais se aproxima dos seus interesses?",

            descricao:
                "Não precisa ser a matéria em que você tira a maior nota.",

            alternativas: [
                {
                    texto:
                        "Matemática, informática ou lógica.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 2
                    }
                },

                {
                    texto:
                        "Física, matemática ou disciplinas técnicas.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Biologia, química ou educação física.",

                    pontos: {
                        saude: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "História, geografia, filosofia ou língua portuguesa.",

                    pontos: {
                        humanas: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Matemática financeira, empreendedorismo ou projetos.",

                    pontos: {
                        administracao: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Artes, comunicação visual ou produção de conteúdo.",

                    pontos: {
                        design: 3,
                        humanas: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Qual frase mais combina com você?",

            descricao:
                "Escolha aquela que melhor representa sua forma de pensar.",

            alternativas: [
                {
                    texto:
                        "Sempre existe uma forma mais inteligente de automatizar uma tarefa.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Gosto de entender cada peça antes de montar o todo.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Sinto satisfação quando consigo ajudar alguém de verdade.",

                    pontos: {
                        saude: 3,
                        humanas: 2
                    }
                },

                {
                    texto:
                        "Gosto de entender por que as pessoas e sociedades agem de determinada forma.",

                    pontos: {
                        humanas: 3,
                        saude: 1
                    }
                },

                {
                    texto:
                        "Tenho facilidade para pensar em objetivos e organizar caminhos.",

                    pontos: {
                        administracao: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Sempre imagino como algo poderia ficar mais bonito e interessante.",

                    pontos: {
                        design: 3,
                        tecnologia: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Que tipo de conteúdo mais prende sua atenção?",

            descricao:
                "Pense nos vídeos, textos ou assuntos que você procura por vontade própria.",

            alternativas: [
                {
                    texto:
                        "Tecnologia, programação, inteligência artificial ou jogos.",

                    pontos: {
                        tecnologia: 3,
                        design: 1
                    }
                },

                {
                    texto:
                        "Máquinas, construções, veículos ou experiências científicas.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Saúde, alimentação, corpo humano ou qualidade de vida.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "História, comportamento, política, cultura ou debates.",

                    pontos: {
                        humanas: 3,
                        administracao: 1
                    }
                },

                {
                    texto:
                        "Empreendedorismo, finanças, empresas ou produtividade.",

                    pontos: {
                        administracao: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Arte, fotografia, edição, moda ou comunicação visual.",

                    pontos: {
                        design: 3,
                        humanas: 1
                    }
                }
            ]
        },

        {
            pergunta:
                "Como seria um dia profissional ideal para você?",

            descricao:
                "Escolha a rotina que parece mais satisfatória.",

            alternativas: [
                {
                    texto:
                        "Resolver desafios digitais e desenvolver novas funcionalidades.",

                    pontos: {
                        tecnologia: 3,
                        engenharia: 1
                    }
                },

                {
                    texto:
                        "Calcular, projetar, testar e acompanhar uma solução prática.",

                    pontos: {
                        engenharia: 3,
                        tecnologia: 1
                    }
                },

                {
                    texto:
                        "Atender pessoas e contribuir diretamente para o bem-estar delas.",

                    pontos: {
                        saude: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Pesquisar, conversar, escrever e interpretar situações.",

                    pontos: {
                        humanas: 3,
                        saude: 1
                    }
                },

                {
                    texto:
                        "Participar de reuniões, tomar decisões e coordenar tarefas.",

                    pontos: {
                        administracao: 3,
                        humanas: 1
                    }
                },

                {
                    texto:
                        "Criar conceitos, imagens, interfaces ou experiências visuais.",

                    pontos: {
                        design: 3,
                        tecnologia: 1
                    }
                }
            ]
        }
    ];

    /* ==================================================
       ESTADO DO TESTE
    ================================================== */

    let perguntaAtual = 0;

    let respostasSelecionadas = new Array(
        perguntasTeste.length
    ).fill(null);

    let preferenciasUsuario = {
        localizacao: "qualquer",
        tipoInstituicao: "qualquer",
        modalidade: "qualquer",
        buscaBolsa: false,
        aceitaOutraRegiao: true
    };

    /* ==================================================
       CONTROLE DAS TELAS
    ================================================== */

    function mostrarTela(telaSelecionada) {
        const telas = [
            telaInicialTeste,
            telaPerguntasTeste,
            telaPreferenciasTeste,
            telaCarregamentoResultado,
            telaResultadoTeste
        ];

        telas.forEach(function (tela) {
            tela.hidden = tela !== telaSelecionada;
        });

        telaSelecionada.classList.remove("ativa");

        void telaSelecionada.offsetWidth;

        telaSelecionada.classList.add("ativa");
    }

    function rolarAteTeste() {
        const containerTeste = document.querySelector(
            ".container-teste-vocacional"
        );

        if (containerTeste) {
            containerTeste.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    /* ==================================================
       EXIBIÇÃO DAS PERGUNTAS
    ================================================== */

    function exibirPergunta() {
        const pergunta = perguntasTeste[perguntaAtual];

        const numeroExibido = perguntaAtual + 1;

        const progresso = Math.round(
            (numeroExibido / perguntasTeste.length) * 100
        );

        numeroPergunta.textContent =
            `Pergunta ${numeroExibido} de ${perguntasTeste.length}`;

        tituloPergunta.textContent = pergunta.pergunta;

        descricaoPergunta.textContent =
            pergunta.descricao ||
            "Escolha a alternativa que mais representa você.";

        porcentagemProgresso.textContent =
            `${progresso}%`;

        preenchimentoProgresso.style.width =
            `${progresso}%`;

        alternativasTeste.innerHTML = "";

        pergunta.alternativas.forEach(function (
            alternativa,
            indiceAlternativa
        ) {
            const botaoAlternativa = document.createElement(
                "button"
            );

            botaoAlternativa.type = "button";

            botaoAlternativa.className =
                "alternativa-teste";

            botaoAlternativa.setAttribute(
                "role",
                "radio"
            );

            botaoAlternativa.setAttribute(
                "aria-checked",
                "false"
            );

            botaoAlternativa.innerHTML = `
                <span class="marcador-alternativa">
                    ✓
                </span>

                <span class="texto-alternativa">
                    ${alternativa.texto}
                </span>
            `;

            if (
                respostasSelecionadas[perguntaAtual] ===
                indiceAlternativa
            ) {
                botaoAlternativa.classList.add(
                    "selecionada"
                );

                botaoAlternativa.setAttribute(
                    "aria-checked",
                    "true"
                );
            }

            botaoAlternativa.addEventListener(
                "click",
                function () {
                    selecionarAlternativa(
                        indiceAlternativa
                    );
                }
            );

            alternativasTeste.appendChild(
                botaoAlternativa
            );
        });

        btnVoltarPergunta.style.visibility =
            perguntaAtual === 0
                ? "hidden"
                : "visible";

        btnAvancarPergunta.disabled =
            respostasSelecionadas[perguntaAtual] === null;

        btnAvancarPergunta.textContent =
            perguntaAtual === perguntasTeste.length - 1
                ? "Ver meu resultado →"
                : "Próxima pergunta →";
    }

    function selecionarAlternativa(indiceAlternativa) {
        respostasSelecionadas[perguntaAtual] =
            indiceAlternativa;

        const botoesAlternativas =
            alternativasTeste.querySelectorAll(
                ".alternativa-teste"
            );

        botoesAlternativas.forEach(function (
            botao,
            indiceBotao
        ) {
            const selecionada =
                indiceBotao === indiceAlternativa;

            botao.classList.toggle(
                "selecionada",
                selecionada
            );

            botao.setAttribute(
                "aria-checked",
                selecionada
                    ? "true"
                    : "false"
            );
        });

        btnAvancarPergunta.disabled = false;
    }

    /* ==================================================
       CÁLCULO DO RESULTADO
    ================================================== */

    function calcularPontuacoes() {
        const pontuacoes = {};

        Object.keys(areasTeste).forEach(function (area) {
            pontuacoes[area] = 0;
        });

        respostasSelecionadas.forEach(function (
            resposta,
            indicePergunta
        ) {
            if (resposta === null) {
                return;
            }

            const alternativaSelecionada =
                perguntasTeste[indicePergunta]
                    .alternativas[resposta];

            Object.entries(
                alternativaSelecionada.pontos
            ).forEach(function ([area, pontos]) {
                if (pontuacoes[area] !== undefined) {
                    pontuacoes[area] += pontos;
                }
            });
        });

        return pontuacoes;
    }

    function calcularPontuacaoMaximaPorArea() {
        const maximos = {};

        Object.keys(areasTeste).forEach(function (area) {
            maximos[area] = 0;
        });

        perguntasTeste.forEach(function (pergunta) {
            Object.keys(areasTeste).forEach(function (area) {
                const maiorPontuacaoDaPergunta = Math.max(
                    0,
                    ...pergunta.alternativas.map(
                        function (alternativa) {
                            return alternativa.pontos[area] || 0;
                        }
                    )
                );

                maximos[area] +=
                    maiorPontuacaoDaPergunta;
            });
        });

        return maximos;
    }

    function gerarRanking() {
        const pontuacoes =
            calcularPontuacoes();

        const pontuacoesMaximas =
            calcularPontuacaoMaximaPorArea();

        const ranking = Object.keys(areasTeste).map(
            function (area) {
                const pontuacaoAtual =
                    pontuacoes[area];

                const pontuacaoMaxima =
                    pontuacoesMaximas[area];

                const porcentagem =
                    pontuacaoMaxima > 0
                        ? Math.round(
                            (
                                pontuacaoAtual /
                                pontuacaoMaxima
                            ) * 100
                        )
                        : 0;

                return {
                    chave: area,
                    pontos: pontuacaoAtual,
                    porcentagem: porcentagem,
                    ...areasTeste[area]
                };
            }
        );

        ranking.sort(function (areaA, areaB) {
            if (
                areaB.porcentagem !==
                areaA.porcentagem
            ) {
                return (
                    areaB.porcentagem -
                    areaA.porcentagem
                );
            }

            return areaB.pontos - areaA.pontos;
        });

        return ranking;
    }

    /* ==================================================
       RESULTADO NA TELA
    ================================================== */

    function preencherLista(elementoLista, itens) {
        elementoLista.innerHTML = "";

        itens.forEach(function (item) {
            const itemLista = document.createElement(
                "li"
            );

            itemLista.textContent = item;

            elementoLista.appendChild(itemLista);
        });
    }

    function exibirResultado() {
        const ranking = gerarRanking();

        const areaPrincipal = ranking[0];

        iconeAreaPrincipal.textContent =
            areaPrincipal.icone;

        nomeAreaPrincipal.textContent =
            areaPrincipal.nome;

        porcentagemAreaPrincipal.textContent =
            `${areaPrincipal.porcentagem}% de compatibilidade`;

        descricaoAreaPrincipal.textContent =
            areaPrincipal.descricao;

        preencherLista(
            listaProfissoesRecomendadas,
            areaPrincipal.profissoes
        );

        preencherLista(
            listaCursosRecomendados,
            areaPrincipal.cursos
        );

        preencherLista(
            listaPontosFortes,
            areaPrincipal.pontosFortes
        );

        rankingAreas.innerHTML = "";

        ranking.forEach(function (area, indice) {
            const itemRanking = document.createElement(
                "div"
            );

            itemRanking.className =
                "item-ranking-area";

            itemRanking.innerHTML = `
                <span class="nome-ranking-area">
                    ${indice + 1}º ${area.icone} ${area.nome}
                </span>

                <div class="barra-ranking-area">

                    <div
                        class="preenchimento-ranking-area"
                        data-porcentagem="${area.porcentagem}"
                    >
                    </div>

                </div>

                <span class="valor-ranking-area">
                    ${area.porcentagem}%
                </span>
            `;

            rankingAreas.appendChild(itemRanking);
        });

        mostrarTela(telaResultadoTeste);

        rolarAteTeste();

        window.requestAnimationFrame(function () {
            const barras =
                rankingAreas.querySelectorAll(
                    ".preenchimento-ranking-area"
                );

            barras.forEach(function (barra) {
                barra.style.width =
                    `${barra.dataset.porcentagem}%`;
            });
        });
    }

    function finalizarTeste() {
        mostrarTela(telaCarregamentoResultado);

        rolarAteTeste();

        window.setTimeout(function () {
            exibirResultado();
        }, 1800);
    }

    /* ==================================================
       REINICIAR TESTE
    ================================================== */

    function reiniciarTeste() {
        perguntaAtual = 0;

        respostasSelecionadas = new Array(
            perguntasTeste.length
        ).fill(null);

        exibirPergunta();

        mostrarTela(telaInicialTeste);

        rolarAteTeste();
    }

    /* ==================================================
       EVENTOS
    ================================================== */

    btnComecarTeste.addEventListener(
        "click",
        function () {
            perguntaAtual = 0;

            exibirPergunta();

            mostrarTela(telaPerguntasTeste);

            rolarAteTeste();
        }
    );

    btnAvancarPergunta.addEventListener(
        "click",
        function () {
            if (
                respostasSelecionadas[perguntaAtual] ===
                null
            ) {
                return;
            }

            if (
                perguntaAtual <
                perguntasTeste.length - 1
            ) {
                perguntaAtual++;

                exibirPergunta();

                rolarAteTeste();
            } else {
                mostrarTela(
                    telaPreferenciasTeste
                );

                rolarAteTeste();
            }
        }
    );

    btnVoltarPergunta.addEventListener(
        "click",
        function () {
            if (perguntaAtual > 0) {
                perguntaAtual--;

                exibirPergunta();

                rolarAteTeste();
            }
        }
    );

    formPreferenciasTeste.addEventListener(
        "submit",
        function (evento) {
            evento.preventDefault();

            const tipoInstituicaoSelecionado =
                formPreferenciasTeste.querySelector(
                    'input[name="tipo-instituicao"]:checked'
                );

            const modalidadeSelecionada =
                formPreferenciasTeste.querySelector(
                    'input[name="modalidade"]:checked'
                );

            const buscaBolsaSelecionada =
                formPreferenciasTeste.querySelector(
                    'input[name="busca-bolsa"]:checked'
                );

            const aceitaOutraRegiaoSelecionada =
                formPreferenciasTeste.querySelector(
                    'input[name="aceita-outra-regiao"]:checked'
                );

            if (
                !preferenciaLocalizacao.value ||
                !tipoInstituicaoSelecionado ||
                !modalidadeSelecionada ||
                !buscaBolsaSelecionada ||
                !aceitaOutraRegiaoSelecionada
            ) {
                return;
            }

            preferenciasUsuario = {
                localizacao:
                    preferenciaLocalizacao.value,

                tipoInstituicao:
                    tipoInstituicaoSelecionado.value,

                modalidade:
                    modalidadeSelecionada.value,

                buscaBolsa:
                    buscaBolsaSelecionada.value === "sim",

                aceitaOutraRegiao:
                    aceitaOutraRegiaoSelecionada.value === "sim"
            };

            finalizarTeste();
        }
    );

    btnVoltarPreferencias.addEventListener(
        "click",
        function () {
            perguntaAtual =
                perguntasTeste.length - 1;

            exibirPergunta();

            mostrarTela(
                telaPerguntasTeste
            );

            rolarAteTeste();
        }
    );

    btnRefazerTeste.addEventListener(
        "click",
        reiniciarTeste
    );

    /* ==================================================
       NAVEGAÇÃO PELO TECLADO
    ================================================== */

    document.addEventListener(
        "keydown",
        function (evento) {
            if (telaPerguntasTeste.hidden) {
                return;
            }

            const numeroPressionado =
                Number(evento.key);

            if (
                numeroPressionado >= 1 &&
                numeroPressionado <=
                perguntasTeste[perguntaAtual]
                    .alternativas.length
            ) {
                selecionarAlternativa(
                    numeroPressionado - 1
                );
            }

            if (
                evento.key === "Enter" &&
                !btnAvancarPergunta.disabled
            ) {
                btnAvancarPergunta.click();
            }

            if (
                evento.key === "ArrowLeft" &&
                perguntaAtual > 0
            ) {
                btnVoltarPergunta.click();
            }
        }
    );
}

/* ==================================================
   MENU AUTOMÁTICO — PÁGINA ATUAL
================================================== */

function destacarPaginaAtualNoMenu() {
    const linksMenu = document.querySelectorAll(
        "header nav a"
    );

    if (linksMenu.length === 0) {
        return;
    }

    const caminhoAtual =
        window.location.pathname
            .toLowerCase()
            .replace(/\/+$/, "");

    linksMenu.forEach(function (link) {
        link.classList.remove(
            "pagina-ativa"
        );

        const href =
            link.getAttribute("href");

        if (
            !href ||
            href === "#" ||
            href.startsWith("http") ||
            href.startsWith("mailto:")
        ) {
            return;
        }

        const urlLink =
            new URL(
                href,
                window.location.href
            );

        const caminhoLink =
            urlLink.pathname
                .toLowerCase()
                .replace(/\/+$/, "");

        const nomeArquivoAtual =
            caminhoAtual.split("/").pop();

        const nomeArquivoLink =
            caminhoLink.split("/").pop();

        let linkCorrespondePagina =
            caminhoAtual === caminhoLink;

        /*
           Páginas internas que pertencem à aba Descobrir
        */

        const paginasDescobrir = [
            "descobrir.html",
            "universidades.html",
            "cursos-tecnicos.html",
            "bolsas.html",
            "guia-profissional.html",
            "teste-vocacional.html"
        ];

        if (
            paginasDescobrir.includes(
                nomeArquivoAtual
            ) &&
            nomeArquivoLink ===
            "descobrir.html"
        ) {
            linkCorrespondePagina = true;
        }

        /*
           A página do mapa pertence à aba Oportunidades
        */

        if (
            nomeArquivoAtual ===
            "mapa-oportunidades.html" &&
            nomeArquivoLink ===
            "mapa-oportunidades.html"
        ) {
            linkCorrespondePagina = true;
        }

        /*
           Página inicial
        */

        if (
            (
                nomeArquivoAtual === "" ||
                nomeArquivoAtual ===
                "index.html"
            ) &&
            nomeArquivoLink ===
            "index.html"
        ) {
            linkCorrespondePagina = true;
        }

        if (linkCorrespondePagina) {
            link.classList.add(
                "pagina-ativa"
            );
        }
    });
}

document.addEventListener(
    "DOMContentLoaded",
    destacarPaginaAtualNoMenu
);

/* ==================================================
   PREFERÊNCIAS DO TESTE VOCACIONAL
================================================== */

const preferenciasUsuario = {
    modalidade: null
};

function configurarPreferenciaModalidade() {
    const opcoesModalidade = document.querySelectorAll(
        'input[name="modalidade"]'
    );

    if (opcoesModalidade.length === 0) {
        return;
    }

    opcoesModalidade.forEach(function (opcao) {
        opcao.addEventListener("change", function () {
            if (opcao.checked) {
                preferenciasUsuario.modalidade = opcao.value;
            }
        });
    });

    const opcaoMarcada = document.querySelector(
        'input[name="modalidade"]:checked'
    );

    if (opcaoMarcada) {
        preferenciasUsuario.modalidade = opcaoMarcada.value;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    configurarPreferenciaModalidade
);

/* ==================================================
   CALENDÁRIO ACADÊMICO
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const gradeCalendario = document.getElementById(
        "grade-calendario"
    );

    /*
        Impede que o código seja executado nas outras páginas.
    */

    if (!gradeCalendario) {
        return;
    }

    /* ==================================================
       ELEMENTOS DA PÁGINA
    ================================================== */

    const tituloMesCalendario = document.getElementById(
        "titulo-mes-calendario"
    );

    const botaoMesAnterior = document.getElementById(
        "mes-anterior"
    );

    const botaoProximoMes = document.getElementById(
        "proximo-mes"
    );

    const botoesFiltro = document.querySelectorAll(
        ".filtro-calendario"
    );

    const listaProximosEventos = document.getElementById(
        "lista-proximos-eventos"
    );

    const botaoVerTodos = document.getElementById(
        "btn-ver-todos-eventos"
    );

    const quantidadeEventosMes = document.getElementById(
        "quantidade-eventos-mes"
    );

    const quantidadePrazos = document.getElementById(
        "quantidade-prazos"
    );

    /* ==================================================
       ELEMENTOS DO MODAL
    ================================================== */

    const modalEvento = document.getElementById(
        "modal-evento-calendario"
    );

    const fundoModal = modalEvento?.querySelector(
        ".fundo-modal-calendario"
    );

    const botaoFecharModal = document.getElementById(
        "btn-fechar-modal-calendario"
    );

    const categoriaModal = document.getElementById(
        "categoria-modal-evento"
    );

    const tituloModal = document.getElementById(
        "titulo-modal-evento"
    );

    const descricaoModal = document.getElementById(
        "descricao-modal-evento"
    );

    const dataModal = document.getElementById(
        "data-modal-evento"
    );

    const instituicaoModal = document.getElementById(
        "instituicao-modal-evento"
    );

    const statusModal = document.getElementById(
        "status-modal-evento"
    );

    /* ==================================================
       CONFIGURAÇÕES
    ================================================== */

    const nomesMeses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const nomesCategorias = {
        vestibular: "Vestibular",
        enem: "ENEM",
        bolsa: "Bolsa",
        "curso-tecnico": "Curso técnico",
        evento: "Evento"
    };

    /*
        Abre automaticamente no mês e ano atuais.
    */

    const dataAtualCalendario = new Date();

    let mesAtual =
        dataAtualCalendario.getMonth();

    let anoAtual =
        dataAtualCalendario.getFullYear();

    let categoriaSelecionada = "todos";

    /* ==================================================
       EVENTOS DO CALENDÁRIO
    ================================================== */

    /*
        Informações gerais de cada processo seletivo.
        Vários eventos podem apontar para o mesmo processo
        através da propriedade "processoId".
    */

    const detalhesProcessos = {

        /* =========================
           CEDERJ 2026.2
        ========================= */

        "cederj-2026-2": {
            inscricoes:
                "06/04 a 24/05/2026 (prazo prorrogado)",

            provas:
                "14/06/2026",

            edital:
                "Edital de Seleção publicado em 27/03/2026",

            linkOficial:
                "https://cecierj.edu.br/consorcio-cederj/vestibular/2026-2/",

            textoLink:
                "Acessar processo oficial"
        },

        /* =========================
           ENEM 2026
        ========================= */

        "enem-2026": {
            inscricoes:
                "25/05 a 12/06/2026",

            provas:
                "08 e 15/11/2026",

            edital:
                "Edital e cronograma oficial do ENEM 2026",

            linkOficial:
                "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/orientacoes/cronograma",

            textoLink:
                "Acessar página oficial do ENEM"
        },

        /* =========================
           PROUNI 2026.2
        ========================= */

        "prouni-2026-2": {
            inscricoes:
                "07/07 a 12/07/2026 (prazo prorrogado)",

            provas:
                "Não possui prova própria • seleção utiliza notas do ENEM",

            edital:
                "Edital nº 51/2026 • publicado em 01/07/2026",

            linkOficial:
                "https://acessounico.mec.gov.br/prouni",

            textoLink:
                "Acessar ProUni oficial"
        },

        /* =========================
           FIES 2026.2
        ========================= */

        "fies-2026-2": {
            inscricoes:
                "14/07 a 17/07/2026",

            provas:
                "Não possui prova própria • seleção utiliza critérios do Fies e notas do ENEM",

            edital:
                "Editais e normas do Fies 2026 disponíveis no portal do MEC",

            linkOficial:
                "https://acessounico.mec.gov.br/fies",

            textoLink:
                "Acessar Fies oficial"
        },

        /* =========================
           UERJ 2027
        ========================= */

        "uerj-2027": {
            inscricoes:
                "17/07 a 07/08/2026 • 2º Exame de Qualificação",

            provas:
                "2º Exame de Qualificação: 06/09/2026",

            edital:
                "Edital do 2º Exame de Qualificação • Vestibular Estadual 2027",

            linkOficial:
                "https://www.vestibular.uerj.br/",

            textoLink:
                "Acessar Vestibular UERJ"
        },

        /* =========================
           PUC-RIO 2027
        ========================= */

        "puc-rio-2027": {
            inscricoes:
                "27/07 a 07/09/2026",

            provas:
                "11 e 15/10/2026",

            edital:
                "Manual do Candidato e calendário oficial do Vestibular 2027",

            linkOficial:
                "https://www.puc-rio.br/vestibular/202612/",

            textoLink:
                "Acessar Vestibular PUC-Rio"
        },

        /* =========================
           FGV 2027.1
        ========================= */

        "fgv-2027-1": {
            inscricoes:
                "27/07 a 16/09/2026 • até 18h no último dia",

            provas:
                "18/10/2026 • prova geral",

            edital:
                "Edital do Processo Seletivo FGV 2027.1 disponível na página oficial",

            linkOficial:
                "https://vestibular.fgv.br/formas-de-ingresso/vestibular-fgv",

            textoLink:
                "Acessar Vestibular FGV"
        },

        /* =========================
           UNICAMP 2027
        ========================= */

        "unicamp-2027": {
            inscricoes:
                "03/08 a 31/08/2026",

            provas:
                "1ª fase: 18/10 • 2ª fase: 29 e 30/11/2026",

            edital:
                "Edital e Manual do Ingresso 2027 disponíveis na COMVEST",

            linkOficial:
                "https://www.comvest.unicamp.br/",

            textoLink:
                "Acessar COMVEST"
        },

        /* =========================
           FUVEST / USP 2027
        ========================= */

        "fuvest-2027": {
            inscricoes:
                "17/08 a 09/10/2026",

            provas:
                "1ª fase: 01/11 • 2ª fase: 06 e 07/12/2026",

            edital:
                "Resolução CoG nº 9008 • publicada em 31/07/2026 • retificada em 27/08/2026",

            linkOficial:
                "https://www.fuvest.br/vestibular-da-usp/",

            textoLink:
                "Acessar FUVEST 2027"
        },

        /* =========================
           IFFLUMINENSE 2027
        ========================= */

        "iff-2027": {
            inscricoes:
                "Inscrições abertas • prazo final em 08/10/2026",

            provas:
                "Graduação: 29/11 • Cursos técnicos: 06/12/2026",

            edital:
                "Editais do ingresso 2027 disponíveis no Portal de Seleções do IFF",

            linkOficial:
                "https://selecoes.iff.edu.br/",

            textoLink:
                "Acessar seleções do IFF"
        },

        /* =========================
           UNESP 2027
        ========================= */

        "unesp-2027": {
            inscricoes:
                "04/09 a 20/10/2026",

            provas:
                "1ª fase: 22/11/2026",

            edital:
                "Manual do Candidato e documentos do Vestibular UNESP 2027",

            linkOficial:
                "https://www.vunesp.com.br/VNSP2514",

            textoLink:
                "Acessar Vestibular UNESP"
        },

        /* =========================
           ITA 2027
        ========================= */

        "ita-2027": {
            inscricoes:
                "02/06 a 12/07/2026",

            provas:
                "1ª fase: 27/09 • 2ª fase: 20 a 23/10/2026",

            edital:
                "Edital e informações oficiais do Concurso de Admissão 2027",

            linkOficial:
                "https://www.vestibular.ita.br/",

            textoLink:
                "Acessar Vestibular ITA"
        },

        /* =========================
           ESPM 2027.1
        ========================= */

        "espm-2027-1": {
            inscricoes:
                "Abertas • prazo final em 24/11/2026",

            provas:
                "Rio de Janeiro: 28 ou 29/11/2026",

            edital:
                "Edital do Vestibular ESPM 2027.1 disponível na página oficial",

            linkOficial:
                "https://www.espm.br/cursos-de-graduacao/processos-seletivos/vestibular/",

            textoLink:
                "Acessar Vestibular ESPM"
        }
    };

    /* ==================================================
       EVENTOS
    ================================================== */

    const eventosFixos = [

        /* =========================
           CEDERJ 2026.2
        ========================= */

        {
            id: "cederj-inicio-inscricoes-2026-2",
            titulo: "Abertura das inscrições CEDERJ 2026.2",
            descricao:
                "Início das inscrições para o Vestibular CEDERJ 2026.2.",
            data: "2026-04-06",
            categoria: "vestibular",
            instituicao: "Fundação CECIERJ • CEDERJ",
            processoId: "cederj-2026-2"
        },

        {
            id: "cederj-fim-inscricoes-2026-2",
            titulo: "Fim das inscrições CEDERJ 2026.2",
            descricao:
                "Último dia do prazo prorrogado para inscrições no Vestibular CEDERJ 2026.2.",
            data: "2026-05-24",
            categoria: "vestibular",
            instituicao: "Fundação CECIERJ • CEDERJ",
            processoId: "cederj-2026-2"
        },

        {
            id: "cederj-prova-2026-2",
            titulo: "Prova do Vestibular CEDERJ 2026.2",
            descricao:
                "Aplicação da prova para ingresso no segundo semestre de 2026.",
            data: "2026-06-14",
            categoria: "vestibular",
            instituicao: "Fundação CECIERJ • CEDERJ",
            processoId: "cederj-2026-2"
        },

        {
            id: "cederj-resultado-2026-2",
            titulo: "Resultado final CEDERJ 2026.2",
            descricao:
                "Divulgação do resultado final do Vestibular CEDERJ 2026.2.",
            data: "2026-07-06",
            categoria: "vestibular",
            instituicao: "Fundação CECIERJ • CEDERJ",
            processoId: "cederj-2026-2"
        },

        /* =========================
           ENEM 2026
        ========================= */

        {
            id: "enem-abertura-inscricoes-2026",
            titulo: "Abertura das inscrições do ENEM 2026",
            descricao:
                "Início do período oficial de inscrições para o ENEM 2026.",
            data: "2026-05-25",
            categoria: "enem",
            instituicao: "INEP",
            processoId: "enem-2026"
        },

        {
            id: "enem-fim-inscricoes-2026",
            titulo: "Fim das inscrições do ENEM 2026",
            descricao:
                "Último dia para realizar a inscrição no ENEM 2026.",
            data: "2026-06-12",
            categoria: "enem",
            instituicao: "INEP",
            processoId: "enem-2026"
        },

        {
            id: "enem-pagamento-2026",
            titulo: "Prazo de pagamento do ENEM 2026",
            descricao:
                "Último dia para pagamento da taxa de inscrição do ENEM 2026.",
            data: "2026-06-22",
            categoria: "enem",
            instituicao: "INEP",
            processoId: "enem-2026"
        },

        {
            id: "enem-prova-dia1-2026",
            titulo: "1º dia de provas do ENEM 2026",
            descricao:
                "Primeiro domingo de aplicação das provas do ENEM 2026.",
            data: "2026-11-08",
            categoria: "enem",
            instituicao: "INEP",
            processoId: "enem-2026"
        },

        {
            id: "enem-prova-dia2-2026",
            titulo: "2º dia de provas do ENEM 2026",
            descricao:
                "Segundo domingo de aplicação das provas do ENEM 2026.",
            data: "2026-11-15",
            categoria: "enem",
            instituicao: "INEP",
            processoId: "enem-2026"
        },

        /* =========================
           PROUNI 2026.2
        ========================= */

        {
            id: "prouni-abertura-2026-2",
            titulo: "Abertura das inscrições do ProUni 2026.2",
            descricao:
                "Início das inscrições para bolsas do ProUni referentes ao segundo semestre de 2026.",
            data: "2026-07-07",
            categoria: "bolsa",
            instituicao: "MEC • ProUni",
            processoId: "prouni-2026-2"
        },

        {
            id: "prouni-fim-inscricoes-2026-2",
            titulo: "Fim das inscrições do ProUni 2026.2",
            descricao:
                "Último dia do prazo prorrogado para inscrições do ProUni 2026.2.",
            data: "2026-07-12",
            categoria: "bolsa",
            instituicao: "MEC • ProUni",
            processoId: "prouni-2026-2"
        },

        {
            id: "prouni-primeira-chamada-2026-2",
            titulo: "1ª chamada do ProUni 2026.2",
            descricao:
                "Divulgação do resultado da primeira chamada do ProUni.",
            data: "2026-07-15",
            categoria: "bolsa",
            instituicao: "MEC • ProUni",
            processoId: "prouni-2026-2"
        },

        {
            id: "prouni-segunda-chamada-2026-2",
            titulo: "2ª chamada do ProUni 2026.2",
            descricao:
                "Divulgação do resultado da segunda chamada do ProUni.",
            data: "2026-08-05",
            categoria: "bolsa",
            instituicao: "MEC • ProUni",
            processoId: "prouni-2026-2"
        },

        {
            id: "prouni-resultado-lista-espera-2026-2",
            titulo: "Resultado da lista de espera do ProUni",
            descricao:
                "Divulgação do resultado da lista de espera do ProUni 2026.2.",
            data: "2026-09-01",
            categoria: "bolsa",
            instituicao: "MEC • ProUni",
            processoId: "prouni-2026-2"
        },

        /* =========================
           FIES 2026.2
        ========================= */

        {
            id: "fies-abertura-2026-2",
            titulo: "Abertura das inscrições do Fies 2026.2",
            descricao:
                "Início das inscrições do Fies para o segundo semestre de 2026.",
            data: "2026-07-14",
            categoria: "bolsa",
            instituicao: "MEC • Fies",
            processoId: "fies-2026-2"
        },

        {
            id: "fies-fim-inscricoes-2026-2",
            titulo: "Fim das inscrições do Fies 2026.2",
            descricao:
                "Último dia para realizar a inscrição no Fies 2026.2.",
            data: "2026-07-17",
            categoria: "bolsa",
            instituicao: "MEC • Fies",
            processoId: "fies-2026-2"
        },

        {
            id: "fies-resultado-2026-2",
            titulo: "Resultado do Fies 2026.2",
            descricao:
                "Divulgação do resultado da chamada única do Fies 2026.2.",
            data: "2026-07-30",
            categoria: "bolsa",
            instituicao: "MEC • Fies",
            processoId: "fies-2026-2"
        },

        /* =========================
           UERJ 2027
        ========================= */

        {
            id: "uerj-eq2-abertura-2027",
            titulo: "Inscrições para o 2º Exame da UERJ",
            descricao:
                "Abertura das inscrições para o 2º Exame de Qualificação do Vestibular Estadual UERJ 2027.",
            data: "2026-07-17",
            categoria: "vestibular",
            instituicao: "UERJ",
            processoId: "uerj-2027"
        },

        {
            id: "uerj-eq2-fim-inscricoes-2027",
            titulo: "Fim das inscrições do 2º Exame da UERJ",
            descricao:
                "Último dia para inscrição no 2º Exame de Qualificação da UERJ.",
            data: "2026-08-07",
            categoria: "vestibular",
            instituicao: "UERJ",
            processoId: "uerj-2027"
        },

        {
            id: "uerj-eq2-prova-2027",
            titulo: "2º Exame de Qualificação da UERJ",
            descricao:
                "Aplicação da prova objetiva do Vestibular Estadual UERJ 2027.",
            data: "2026-09-06",
            categoria: "vestibular",
            instituicao: "UERJ",
            processoId: "uerj-2027"
        },

        /* =========================
           PUC-RIO 2027
        ========================= */

        {
            id: "puc-rio-abertura-2027",
            titulo: "Abertura das inscrições PUC-Rio 2027",
            descricao:
                "Início das inscrições para o Vestibular PUC-Rio 2027.",
            data: "2026-07-27",
            categoria: "vestibular",
            instituicao: "PUC-Rio",
            processoId: "puc-rio-2027"
        },

        {
            id: "puc-rio-fim-inscricoes-2027",
            titulo: "Fim das inscrições PUC-Rio 2027",
            descricao:
                "Último dia para participar do Vestibular PUC-Rio 2027.",
            data: "2026-09-07",

            periodoInicio: "2026-07-27",
            periodoFim: "2026-09-07",

            categoria: "vestibular",
            instituicao: "PUC-Rio",
            processoId: "puc-rio-2027"
        },

        {
            id: "puc-rio-prova1-2027",
            titulo: "1º dia de provas da PUC-Rio 2027",
            descricao:
                "Primeiro dia de aplicação das provas do Vestibular PUC-Rio 2027.",
            data: "2026-10-11",
            categoria: "vestibular",
            instituicao: "PUC-Rio",
            processoId: "puc-rio-2027"
        },

        {
            id: "puc-rio-prova2-2027",
            titulo: "2º dia de provas da PUC-Rio 2027",
            descricao:
                "Segundo dia de aplicação das provas do Vestibular PUC-Rio 2027.",
            data: "2026-10-15",
            categoria: "vestibular",
            instituicao: "PUC-Rio",
            processoId: "puc-rio-2027"
        },

        /* =========================
           FGV 2027.1
        ========================= */

        {
            id: "fgv-fim-inscricoes-2027-1",
            titulo: "Fim das inscrições FGV 2027.1",
            descricao:
                "Último dia das inscrições do Vestibular FGV 2027.1, até as 18h.",
            data: "2026-09-16",

            periodoInicio: "2026-07-27",
            periodoFim: "2026-09-16",

            categoria: "vestibular",
            instituicao: "FGV",
            processoId: "fgv-2027-1"
        },

        {
            id: "fgv-prova-2027-1",
            titulo: "Prova do Vestibular FGV 2027.1",
            descricao:
                "Aplicação da prova geral do Vestibular FGV para ingresso em 2027.1.",
            data: "2026-10-18",
            categoria: "vestibular",
            instituicao: "FGV",
            processoId: "fgv-2027-1"
        },

        /* =========================
           UNICAMP 2027
        ========================= */

        {
            id: "unicamp-fim-inscricoes-2027",
            titulo: "Fim das inscrições UNICAMP 2027",
            descricao:
                "Último dia para inscrição no Vestibular UNICAMP 2027.",
            data: "2026-08-31",

            periodoInicio: "2026-08-03",
            periodoFim: "2026-08-31",

            categoria: "vestibular",
            instituicao: "UNICAMP • COMVEST",
            processoId: "unicamp-2027"
        },

        {
            id: "unicamp-primeira-fase-2027",
            titulo: "1ª fase do Vestibular UNICAMP 2027",
            descricao:
                "Aplicação da primeira fase do Vestibular UNICAMP 2027.",
            data: "2026-10-18",
            categoria: "vestibular",
            instituicao: "UNICAMP • COMVEST",
            processoId: "unicamp-2027"
        },

        {
            id: "unicamp-segunda-fase-dia1-2027",
            titulo: "2ª fase UNICAMP 2027 — 1º dia",
            descricao:
                "Primeiro dia da segunda fase do Vestibular UNICAMP 2027.",
            data: "2026-11-29",
            categoria: "vestibular",
            instituicao: "UNICAMP • COMVEST",
            processoId: "unicamp-2027"
        },

        {
            id: "unicamp-segunda-fase-dia2-2027",
            titulo: "2ª fase UNICAMP 2027 — 2º dia",
            descricao:
                "Segundo dia da segunda fase do Vestibular UNICAMP 2027.",
            data: "2026-11-30",
            categoria: "vestibular",
            instituicao: "UNICAMP • COMVEST",
            processoId: "unicamp-2027"
        },

        /* =========================
           FUVEST / USP 2027
        ========================= */

        {
            id: "fuvest-fim-inscricoes-2027",
            titulo: "Fim das inscrições FUVEST 2027",
            descricao:
                "Último dia para inscrição no Vestibular da USP pela FUVEST.",
            data: "2026-10-09",

            periodoInicio: "2026-08-17",
            periodoFim: "2026-10-09",

            categoria: "vestibular",
            instituicao: "FUVEST • USP",
            processoId: "fuvest-2027"
        },

        {
            id: "fuvest-primeira-fase-2027",
            titulo: "1ª fase da FUVEST 2027",
            descricao:
                "Aplicação da primeira fase do Vestibular FUVEST 2027.",
            data: "2026-11-01",
            categoria: "vestibular",
            instituicao: "FUVEST • USP",
            processoId: "fuvest-2027"
        },

        {
            id: "fuvest-segunda-fase-dia1-2027",
            titulo: "2ª fase FUVEST 2027 — 1º dia",
            descricao:
                "Primeiro dia da segunda fase do Vestibular FUVEST 2027.",
            data: "2026-12-06",
            categoria: "vestibular",
            instituicao: "FUVEST • USP",
            processoId: "fuvest-2027"
        },

        {
            id: "fuvest-segunda-fase-dia2-2027",
            titulo: "2ª fase FUVEST 2027 — 2º dia",
            descricao:
                "Segundo dia da segunda fase do Vestibular FUVEST 2027.",
            data: "2026-12-07",
            categoria: "vestibular",
            instituicao: "FUVEST • USP",
            processoId: "fuvest-2027"
        },

        /* =========================
           IFFLUMINENSE 2027
        ========================= */

        {
            id: "iff-fim-inscricoes-2027",
            titulo: "Fim das inscrições do IFF 2027",
            descricao:
                "Último dia para inscrição nos processos de ingresso do IFFluminense.",
            data: "2026-10-08",

            abertoAte: "2026-10-08",

            categoria: "vestibular",
            instituicao: "IFFluminense",
            processoId: "iff-2027"
        },

        {
            id: "iff-prova-graduacao-2027",
            titulo: "Vestibular de graduação do IFF 2027",
            descricao:
                "Aplicação da prova para ingresso nos cursos superiores do IFFluminense.",
            data: "2026-11-29",
            categoria: "vestibular",
            instituicao: "IFFluminense",
            processoId: "iff-2027"
        },

        {
            id: "iff-prova-tecnicos-2027",
            titulo: "Processo seletivo técnico do IFF 2027",
            descricao:
                "Aplicação das provas para ingresso nos cursos técnicos do IFFluminense.",
            data: "2026-12-06",
            categoria: "curso-tecnico",
            instituicao: "IFFluminense",
            processoId: "iff-2027"
        },

        /* =========================
           UNESP 2027
        ========================= */

        {
            id: "unesp-isencao-2027",
            titulo: "Prazo de isenção/redução da UNESP 2027",
            descricao:
                "Último dia para solicitar isenção ou redução de 50% da taxa do Vestibular UNESP 2027.",
            data: "2026-08-30",

            periodoInicio: "2026-08-24",
            periodoFim: "2026-08-30",

            categoria: "vestibular",
            instituicao: "UNESP • VUNESP",
            processoId: "unesp-2027"
        },

        {
            id: "unesp-abertura-inscricoes-2027",
            titulo: "Abertura das inscrições UNESP 2027",
            descricao:
                "Início das inscrições para o Vestibular UNESP 2027.",
            data: "2026-09-04",
            categoria: "vestibular",
            instituicao: "UNESP • VUNESP",
            processoId: "unesp-2027"
        },

        {
            id: "unesp-fim-inscricoes-2027",
            titulo: "Fim das inscrições UNESP 2027",
            descricao:
                "Último dia para inscrição no Vestibular UNESP 2027.",
            data: "2026-10-20",

            periodoInicio: "2026-09-04",
            periodoFim: "2026-10-20",

            categoria: "vestibular",
            instituicao: "UNESP • VUNESP",
            processoId: "unesp-2027"
        },

        {
            id: "unesp-primeira-fase-2027",
            titulo: "1ª fase do Vestibular UNESP 2027",
            descricao:
                "Aplicação da primeira fase do Vestibular UNESP 2027.",
            data: "2026-11-22",
            categoria: "vestibular",
            instituicao: "UNESP • VUNESP",
            processoId: "unesp-2027"
        },

        /* =========================
           ITA 2027
        ========================= */

        {
            id: "ita-primeira-fase-2027",
            titulo: "1ª fase do Vestibular ITA 2027",
            descricao:
                "Aplicação da primeira fase do Concurso de Admissão ao ITA.",
            data: "2026-09-27",
            categoria: "vestibular",
            instituicao: "ITA",
            processoId: "ita-2027"
        },

        {
            id: "ita-segunda-fase-matematica-2027",
            titulo: "ITA 2027 — prova de Matemática",
            descricao:
                "Primeiro dia da segunda fase do Vestibular ITA 2027.",
            data: "2026-10-20",
            categoria: "vestibular",
            instituicao: "ITA",
            processoId: "ita-2027"
        },

        {
            id: "ita-segunda-fase-quimica-2027",
            titulo: "ITA 2027 — prova de Química",
            descricao:
                "Segundo dia da segunda fase do Vestibular ITA 2027.",
            data: "2026-10-21",
            categoria: "vestibular",
            instituicao: "ITA",
            processoId: "ita-2027"
        },

        {
            id: "ita-segunda-fase-fisica-2027",
            titulo: "ITA 2027 — prova de Física",
            descricao:
                "Terceiro dia da segunda fase do Vestibular ITA 2027.",
            data: "2026-10-22",
            categoria: "vestibular",
            instituicao: "ITA",
            processoId: "ita-2027"
        },

        {
            id: "ita-segunda-fase-portugues-2027",
            titulo: "ITA 2027 — prova de Português",
            descricao:
                "Último dia da segunda fase do Vestibular ITA 2027.",
            data: "2026-10-23",
            categoria: "vestibular",
            instituicao: "ITA",
            processoId: "ita-2027"
        },

        /* =========================
           ESPM 2027.1
        ========================= */

        {
            id: "espm-fim-inscricoes-2027",
            titulo: "Fim das inscrições ESPM 2027.1",
            descricao:
                "Último dia para inscrição no Vestibular Tradicional ESPM 2027.1.",
            data: "2026-11-24",

            abertoAte: "2026-11-24",

            categoria: "vestibular",
            instituicao: "ESPM",
            processoId: "espm-2027-1"
        },

        {
            id: "espm-prova-rio-dia1-2027",
            titulo: "Vestibular ESPM Rio — prova",
            descricao:
                "Primeira data disponível no Rio de Janeiro para a prova presencial.",
            data: "2026-11-28",
            categoria: "vestibular",
            instituicao: "ESPM Rio",
            processoId: "espm-2027-1"
        },

        {
            id: "espm-prova-rio-dia2-2027",
            titulo: "Vestibular ESPM Rio — prova",
            descricao:
                "Segunda data disponível no Rio de Janeiro para a prova presencial.",
            data: "2026-11-29",
            categoria: "vestibular",
            instituicao: "ESPM Rio",
            processoId: "espm-2027-1"
        }

    ];

    
    /* ==================================================
   EVENTOS CADASTRADOS PELO ADMINISTRADOR
================================================== */

let eventosFirestore = [];

let processosFirestore = {};

let firestoreCalendarioCarregado = false;


/*
    Antes da primeira resposta do Firestore,
    os dados antigos funcionam como fallback.

    Depois que o Firestore responder, ele passa
    a ser a fonte oficial do calendário.
*/

function obterTodosEventos() {

    if (firestoreCalendarioCarregado) {
        return eventosFirestore;
    }

    return eventosFixos;
}


function obterDetalhesProcesso(
    processoId
) {

    if (!processoId) {
        return null;
    }


    if (firestoreCalendarioCarregado) {

        return (
            processosFirestore[
                processoId
            ] ||
            null
        );
    }


    return (
        detalhesProcessos[
            processoId
        ] ||
        null
    );
}


/* ==================================================
   RECEBER DADOS DO FIRESTORE
================================================== */

function aplicarDadosFirestoreCalendario(
    dados
) {

    if (!dados) {
        return;
    }


    eventosFirestore =
        Array.isArray(dados.eventos)
            ? dados.eventos
            : [];


    processosFirestore =
        dados.processos &&
        typeof dados.processos === "object"
            ? dados.processos
            : {};


    firestoreCalendarioCarregado =
        true;


    gerarCalendario();

    mostrarProximosEventos();
}


window.addEventListener(
    "calendario:dados-firestore",

    function (evento) {

        aplicarDadosFirestoreCalendario(
            evento.detail
        );
    }
);


/*
    Se o Firestore tiver carregado antes
    da criação do listener.
*/

if (window.calendarioFirestoreDados) {

    aplicarDadosFirestoreCalendario(
        window.calendarioFirestoreDados
    );
}
    /* ==================================================
       FUNÇÕES DE DATA
    ================================================== */

    function criarDataLocal(dataTexto) {
        const partes = dataTexto.split("-");

        return new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );
    }

    function formatarDataCompleta(dataTexto) {
        const data = criarDataLocal(dataTexto);

        return data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    function formatarMesAbreviado(dataTexto) {
        const data = criarDataLocal(dataTexto);

        return data
            .toLocaleDateString("pt-BR", {
                month: "short"
            })
            .replace(".", "")
            .toUpperCase();
    }

    function obterDia(dataTexto) {
        return criarDataLocal(dataTexto)
            .getDate()
            .toString()
            .padStart(2, "0");
    }

    /* ==================================================
       STATUS AUTOMÁTICO DOS EVENTOS
    ================================================== */

    function obterHojeSemHorario() {
        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        return hoje;
    }

    function calcularStatusEvento(evento) {
        const hoje =
            obterHojeSemHorario();

        /*
            Eventos que representam um período,
            como inscrições.
        */

        if (
            evento.periodoInicio &&
            evento.periodoFim
        ) {
            const inicio =
                criarDataLocal(
                    evento.periodoInicio
                );

            const fim =
                criarDataLocal(
                    evento.periodoFim
                );

            if (hoje < inicio) {
                return "Em breve";
            }

            if (hoje > fim) {
                return "Encerrado";
            }

            return "Em andamento";
        }

        /*
            Eventos de data única,
            como provas e resultados.
        */

        const dataEvento =
            criarDataLocal(
                evento.data
            );

        if (dataEvento < hoje) {
            return "Encerrado";
        }

        if (
            dataEvento.getTime() ===
            hoje.getTime()
        ) {
            return "Hoje";
        }

        return "Em breve";
    }

    function obterClasseStatusEvento(status) {
        if (status === "Em andamento") {
            return "status-andamento";
        }

        if (status === "Hoje") {
            return "status-hoje";
        }

        if (status === "Encerrado") {
            return "status-encerrado";
        }

        return "status-em-breve";
    }

    /* ==================================================
       FILTRO DOS EVENTOS
    ================================================== */

    function eventoPassaNoFiltro(evento) {
        return (
            categoriaSelecionada === "todos" ||
            evento.categoria === categoriaSelecionada
        );
    }

    function obterEventosDoMes() {
        return obterTodosEventos().filter(function (evento) {
            const dataEvento = criarDataLocal(evento.data);

            return (
                dataEvento.getMonth() === mesAtual &&
                dataEvento.getFullYear() === anoAtual &&
                eventoPassaNoFiltro(evento)
            );
        });
    }

    function obterEventosDoDia(dia) {
        return obterTodosEventos().filter(function (evento) {
            const dataEvento = criarDataLocal(evento.data);

            return (
                dataEvento.getDate() === dia &&
                dataEvento.getMonth() === mesAtual &&
                dataEvento.getFullYear() === anoAtual &&
                eventoPassaNoFiltro(evento)
            );
        });
    }

    /* ==================================================
       GERAR O CALENDÁRIO
    ================================================== */

    function gerarCalendario() {
        gradeCalendario.innerHTML = "";

        tituloMesCalendario.textContent =
            `${nomesMeses[mesAtual]} de ${anoAtual}`;

        const primeiroDiaMes = new Date(
            anoAtual,
            mesAtual,
            1
        ).getDay();

        const quantidadeDiasMes = new Date(
            anoAtual,
            mesAtual + 1,
            0
        ).getDate();

        const quantidadeDiasMesAnterior = new Date(
            anoAtual,
            mesAtual,
            0
        ).getDate();

        /*
            Dias do mês anterior.
        */

        for (
            let posicao = primeiroDiaMes - 1;
            posicao >= 0;
            posicao--
        ) {
            const numeroDia =
                quantidadeDiasMesAnterior - posicao;

            criarElementoDia(
                numeroDia,
                true,
                []
            );
        }

        /*
            Dias do mês atual.
        */

        for (
            let dia = 1;
            dia <= quantidadeDiasMes;
            dia++
        ) {
            const eventosDoDia = obterEventosDoDia(dia);

            criarElementoDia(
                dia,
                false,
                eventosDoDia
            );
        }

        /*
            Completa a última linha com os dias
            do próximo mês.
        */

        const quantidadeElementos =
            gradeCalendario.children.length;

        const quantidadeRestante =
            (7 - quantidadeElementos % 7) % 7;

        for (
            let dia = 1;
            dia <= quantidadeRestante;
            dia++
        ) {
            criarElementoDia(
                dia,
                true,
                []
            );
        }

        atualizarResumo();
    }

    function criarElementoDia(
        numeroDia,
        foraDoMes,
        eventosDoDia
    ) {
        const elementoDia =
            document.createElement("button");

        elementoDia.type = "button";
        elementoDia.className = "dia-calendario";

        if (foraDoMes) {
            elementoDia.classList.add("dia-fora-mes");
            elementoDia.disabled = true;
        }

        const hoje = new Date();

        if (
            !foraDoMes &&
            numeroDia === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {
            elementoDia.classList.add("dia-atual");
        }

        const numero =
            document.createElement("span");

        numero.className = "numero-dia-calendario";
        numero.textContent = numeroDia;

        elementoDia.appendChild(numero);

        if (eventosDoDia.length > 0) {
            const areaMarcadores =
                document.createElement("div");

            areaMarcadores.className =
                "marcadores-evento-dia";

            eventosDoDia
                .slice(0, 5)
                .forEach(function (evento) {
                    const marcador =
                        document.createElement("span");

                    marcador.className =
                        `marcador-evento-dia ${evento.categoria}`;

                    marcador.title =
                        evento.titulo;

                    areaMarcadores.appendChild(
                        marcador
                    );
                });

            elementoDia.appendChild(
                areaMarcadores
            );

            elementoDia.addEventListener(
                "click",
                function () {
                    document
                        .querySelectorAll(
                            ".dia-calendario"
                        )
                        .forEach(function (dia) {
                            dia.classList.remove(
                                "dia-selecionado"
                            );
                        });

                    elementoDia.classList.add(
                        "dia-selecionado"
                    );

                    mostrarEventosSelecionados(
                        eventosDoDia
                    );
                }
            );
        }

        gradeCalendario.appendChild(
            elementoDia
        );
    }

    /* ==================================================
       PRÓXIMOS EVENTOS
    ================================================== */

    function mostrarProximosEventos() {
        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const eventosOrdenados =
            obterTodosEventos()

                .filter(
                    eventoPassaNoFiltro
                )

                .filter(function (evento) {
                    const dataEvento =
                        criarDataLocal(
                            evento.data
                        );

                    return dataEvento >= hoje;
                })

                .sort(function (
                    eventoA,
                    eventoB
                ) {
                    return (
                        criarDataLocal(
                            eventoA.data
                        ) -
                        criarDataLocal(
                            eventoB.data
                        )
                    );
                });

        renderizarListaEventos(
            eventosOrdenados.slice(0, 6)
        );
    }

    function mostrarEventosSelecionados(eventos) {
        renderizarListaEventos(eventos);
    }

    function renderizarListaEventos(eventos) {
        listaProximosEventos.innerHTML = "";

        if (eventos.length === 0) {
            const mensagem =
                document.createElement("div");

            mensagem.className =
                "mensagem-sem-eventos";

            mensagem.innerHTML = `
                <strong>Nenhum evento encontrado</strong>
                <p>
                    Não existem eventos para esta seleção.
                </p>
            `;

            listaProximosEventos.appendChild(
                mensagem
            );

            return;
        }

        eventos.forEach(function (evento) {
            const artigo =
                document.createElement("article");

            artigo.className =
                "item-evento-calendario";

            artigo.dataset.categoria =
                evento.categoria;

            const nomeCategoria =
                nomesCategorias[evento.categoria] ||
                "Evento";

            const statusAtual =
                calcularStatusEvento(evento);

            const classeStatus =
                obterClasseStatusEvento(
                    statusAtual
                );

            artigo.innerHTML = `
                <div class="data-evento-calendario">
                    <strong>${obterDia(evento.data)}</strong>
                    <span>${formatarMesAbreviado(evento.data)}</span>
                </div>

                <div class="informacoes-evento-calendario">

                    <span class="categoria-evento categoria-${evento.categoria}">
                        ${nomeCategoria}
                    </span>

                    <h3>${evento.titulo}</h3>

                    <p>${evento.descricao}</p>

                    <button
                        type="button"
                        class="btn-detalhes-evento"
                        data-evento="${evento.id}"
                    >
                        Ver detalhes
                    </button>

                </div>

                <span class="status-evento ${classeStatus}">
                    ${statusAtual}
                </span>
            `;

            listaProximosEventos.appendChild(
                artigo
            );
        });

        configurarBotoesDetalhes();
    }

    /* ==================================================
       MODAL DE DETALHES
    ================================================== */

    function configurarBotoesDetalhes() {
        const botoesDetalhes =
            document.querySelectorAll(
                ".btn-detalhes-evento"
            );

        botoesDetalhes.forEach(
            function (botao) {
                botao.addEventListener(
                    "click",
                    function () {
                        const idEvento =
                            botao.dataset.evento;

                        const evento =
                            obterTodosEventos().find(
                                function (item) {
                                    return (
                                        item.id ===
                                        idEvento
                                    );
                                }
                            );

                        if (evento) {
                            abrirModalEvento(evento);
                        }
                    }
                );
            }
        );
    }

    /* ==================================================
       DETALHES OFICIAIS DO EVENTO
    ================================================== */

    function obterAreaDetalhesOficiais() {
        let area =
            document.getElementById(
                "detalhes-oficiais-evento"
            );

        if (!area) {
            area =
                document.createElement(
                    "section"
                );

            area.id =
                "detalhes-oficiais-evento";

            area.className =
                "detalhes-oficiais-evento";

            /*
                Coloca a seção logo abaixo
                da descrição existente.
            */

            descricaoModal.insertAdjacentElement(
                "afterend",
                area
            );
        }

        return area;
    }

    function criarItemDetalheOficial(
        rotulo,
        valor
    ) {
        if (!valor) {
            return "";
        }

        return `
                <div class="item-detalhe-oficial">
            <span>${rotulo}</span>
            <strong>${valor}</strong>
        </div>
    `;
    }

    function preencherDetalhesOficiais(
        evento
    ) {
        const area =
            obterAreaDetalhesOficiais();

        if (!evento.processoId) {
            area.hidden = true;
            area.innerHTML = "";
            return;
        }

        const processo =
            obterDetalhesProcesso(
                evento.processoId
            );

        if (!processo) {
            area.hidden = true;
            area.innerHTML = "";
            return;
        }

        area.hidden = false;

        area.innerHTML = `

        <div class="titulo-detalhes-oficiais">
            <span>
                Informações oficiais
            </span>
        </div>

        <div class="grade-detalhes-oficiais">

            ${criarItemDetalheOficial(
            "Período de inscrições",
            processo.inscricoes
        )}

            ${criarItemDetalheOficial(
            "Prova / seleção",
            processo.provas
        )}

            ${criarItemDetalheOficial(
            "Edital / documento",
            processo.edital
        )}

        </div>

        <a
            href="${processo.linkOficial}"
            target="_blank"
            rel="noopener noreferrer"
            class="link-oficial-evento"
        >
            ${processo.textoLink}
            →
        </a>

    `;
    }

    /* ==================================================
       ABRIR MODAL
    ================================================== */

    function abrirModalEvento(evento) {
        categoriaModal.textContent =
            nomesCategorias[
            evento.categoria
            ] || "Evento";

        tituloModal.textContent =
            evento.titulo;

        descricaoModal.textContent =
            evento.descricao;

        dataModal.textContent =
            formatarDataCompleta(
                evento.data
            );

        instituicaoModal.textContent =
            evento.instituicao;

        statusModal.textContent =
            calcularStatusEvento(
                evento
            );

        /*
            Preenche período, prova,
            edital e link oficial.
        */

        preencherDetalhesOficiais(
            evento
        );

        const processoEvento =
            obterDetalhesProcesso(
                evento.processoId
            );

        window.dispatchEvent(
            new CustomEvent(
                "calendario:evento-aberto",
                {
                    detail: {
                        id:
                            evento.id,

                        titulo:
                            evento.titulo,

                        descricao:
                            evento.descricao,

                        data:
                            evento.data,

                        categoria:
                            evento.categoria,

                        instituicao:
                            evento.instituicao,

                        processoId:
                            evento.processoId ||
                            "",

                        urlOficial:
                            processoEvento?.linkOficial ||
                            "",

                        paginaOrigem:
                            "calendario.html"
                    }
                }
            )
        );

        modalEvento.classList.add(
            "modal-aberto"
        );

        modalEvento.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";
    }

    function fecharModalEvento() {
        modalEvento.classList.remove(
            "modal-aberto"
        );

        modalEvento.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";
    }

    /* ==================================================
       RESUMO
    ================================================== */

    function atualizarResumo() {
        const todosEventosMes =
            obterTodosEventos().filter(
                function (evento) {
                    const dataEvento =
                        criarDataLocal(
                            evento.data
                        );

                    return (
                        dataEvento.getMonth() ===
                        mesAtual &&
                        dataEvento.getFullYear() ===
                        anoAtual
                    );
                }
            );

        quantidadeEventosMes.textContent =
            todosEventosMes.length;

        const hoje = new Date();

        const limitePrazo = new Date();

        limitePrazo.setDate(
            hoje.getDate() + 30
        );

        const prazosProximos =
            obterTodosEventos().filter(
                function (evento) {
                    const dataEvento =
                        criarDataLocal(
                            evento.data
                        );

                    return (
                        dataEvento >= hoje &&
                        dataEvento <= limitePrazo
                    );
                }
            );

        quantidadePrazos.textContent =
            prazosProximos.length;
    }

    /* ==================================================
       FILTROS
    ================================================== */

    function atualizarBotoesFiltro() {
        botoesFiltro.forEach(
            function (botao) {
                const categoria =
                    botao.dataset.categoria;

                botao.classList.toggle(
                    "filtro-ativo",
                    categoria ===
                    categoriaSelecionada
                );
            }
        );
    }

    botoesFiltro.forEach(
        function (botao) {
            botao.addEventListener(
                "click",
                function () {
                    categoriaSelecionada =
                        botao.dataset.categoria;

                    atualizarBotoesFiltro();
                    gerarCalendario();
                    mostrarProximosEventos();
                }
            );
        }
    );

    /* ==================================================
       TROCA DE MÊS
    ================================================== */

    botaoMesAnterior.addEventListener(
        "click",
        function () {
            mesAtual--;

            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }

            gerarCalendario();
        }
    );

    botaoProximoMes.addEventListener(
        "click",
        function () {
            mesAtual++;

            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }

            gerarCalendario();
        }
    );

    /* ==================================================
       OUTROS BOTÕES
    ================================================== */

    botaoVerTodos.addEventListener(
        "click",
        function () {
            categoriaSelecionada =
                "todos";

            atualizarBotoesFiltro();
            gerarCalendario();
            mostrarProximosEventos();
        }
    );

    botaoFecharModal.addEventListener(
        "click",
        fecharModalEvento
    );

    fundoModal.addEventListener(
        "click",
        fecharModalEvento
    );

    document.addEventListener(
        "keydown",
        function (evento) {
            if (
                evento.key === "Escape" &&
                modalEvento.classList.contains(
                    "modal-aberto"
                )
            ) {
                fecharModalEvento();
            }
        }
    );

    /* ==================================================
       INICIALIZAÇÃO
    ================================================== */

    gerarCalendario();
    mostrarProximosEventos();

    /* ==================================================
       COMUNIDADE — SCROLL REVEAL
    ================================================== */

    const elementosRevelarComunidade =
        document.querySelectorAll(
            ".revelar-comunidade"
        );

    if (elementosRevelarComunidade.length > 0) {
        const observadorComunidade =
            new IntersectionObserver(
                function (entradas) {
                    entradas.forEach(
                        function (entrada) {
                            if (entrada.isIntersecting) {
                                entrada.target.classList.add(
                                    "visivel"
                                );

                                observadorComunidade.unobserve(
                                    entrada.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.15
                }
            );

        elementosRevelarComunidade.forEach(
            function (elemento) {
                observadorComunidade.observe(
                    elemento
                );
            }
        );
    }
});



/* ==================================================
   CARROSSEL AUTOMÁTICO DE BANNERS
================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const carrossel =
        document.getElementById(
            "carrossel-banner"
        );

    if (!carrossel) {
        return;
    }

    const trilho =
        carrossel.querySelector(
            ".trilho-banner"
        );

    const slides =
        Array.from(
            carrossel.querySelectorAll(
                ".slide-banner"
            )
        );

    const botaoAnterior =
        document.getElementById(
            "banner-anterior"
        );

    const botaoProximo =
        document.getElementById(
            "banner-proximo"
        );

    const areaIndicadores =
        document.getElementById(
            "indicadores-banner"
        );

    if (slides.length === 0) {
        return;
    }

    let slideAtual = 0;
    let intervaloAutomatico = null;
    let toqueInicial = 0;

    const tempoEntreSlides = 2000;

    /* CRIAR BOLINHAS */

    slides.forEach(function (_, indice) {
        const indicador =
            document.createElement(
                "button"
            );

        indicador.type = "button";

        indicador.className =
            "indicador-banner";

        indicador.setAttribute(
            "aria-label",
            `Mostrar banner ${indice + 1}`
        );

        indicador.addEventListener(
            "click",
            function () {
                mostrarSlide(indice);
                reiniciarAutomatico();
            }
        );

        areaIndicadores.appendChild(
            indicador
        );
    });

    const indicadores =
        Array.from(
            areaIndicadores.querySelectorAll(
                ".indicador-banner"
            )
        );

    /* MOSTRAR UM BANNER */

    function mostrarSlide(indice) {
        slideAtual =
            (
                indice +
                slides.length
            ) %
            slides.length;

        trilho.style.transform =
            `translateX(-${slideAtual * 100}%)`;

        indicadores.forEach(
            function (indicador, indiceIndicador) {
                const estaAtivo =
                    indiceIndicador === slideAtual;

                indicador.classList.toggle(
                    "ativo",
                    estaAtivo
                );

                indicador.setAttribute(
                    "aria-current",
                    estaAtivo
                        ? "true"
                        : "false"
                );
            }
        );
    }

    function avancarSlide() {
        mostrarSlide(
            slideAtual + 1
        );
    }

    function voltarSlide() {
        mostrarSlide(
            slideAtual - 1
        );
    }

    /* TROCA AUTOMÁTICA */

    function pararAutomatico() {
        if (intervaloAutomatico) {
            clearInterval(
                intervaloAutomatico
            );

            intervaloAutomatico = null;
        }
    }

    function iniciarAutomatico() {
        pararAutomatico();

        if (slides.length <= 1) {
            return;
        }

        intervaloAutomatico =
            setInterval(
                avancarSlide,
                tempoEntreSlides
            );
    }

    function reiniciarAutomatico() {
        iniciarAutomatico();
    }

    /* SETAS */

    botaoAnterior.addEventListener(
        "click",
        function () {
            voltarSlide();
            reiniciarAutomatico();
        }
    );

    botaoProximo.addEventListener(
        "click",
        function () {
            avancarSlide();
            reiniciarAutomatico();
        }
    );

    /* PAUSAR AO PASSAR O MOUSE */

    carrossel.addEventListener(
        "mouseenter",
        pararAutomatico
    );

    carrossel.addEventListener(
        "mouseleave",
        iniciarAutomatico
    );

    carrossel.addEventListener(
        "focusin",
        pararAutomatico
    );

    carrossel.addEventListener(
        "focusout",
        iniciarAutomatico
    );

    /* NAVEGAÇÃO PELO TECLADO */

    carrossel.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "ArrowLeft") {
                voltarSlide();
                reiniciarAutomatico();
            }

            if (event.key === "ArrowRight") {
                avancarSlide();
                reiniciarAutomatico();
            }
        }
    );

    /* GESTO NO CELULAR */

    carrossel.addEventListener(
        "touchstart",
        function (event) {
            toqueInicial =
                event.touches[0].clientX;
        },
        {
            passive: true
        }
    );

    carrossel.addEventListener(
        "touchend",
        function (event) {
            const toqueFinal =
                event.changedTouches[0].clientX;

            const distancia =
                toqueFinal - toqueInicial;

            if (Math.abs(distancia) < 50) {
                return;
            }

            if (distancia > 0) {
                voltarSlide();
            } else {
                avancarSlide();
            }

            reiniciarAutomatico();
        },
        {
            passive: true
        }
    );

    /* PAUSAR QUANDO A ABA NÃO ESTIVER VISÍVEL */

    document.addEventListener(
        "visibilitychange",
        function () {
            if (document.hidden) {
                pararAutomatico();
            } else {
                iniciarAutomatico();
            }
        }
    );

    /* INICIALIZAÇÃO */

    if (slides.length === 1) {
        botaoAnterior.hidden = true;
        botaoProximo.hidden = true;
        areaIndicadores.hidden = true;
    }

    mostrarSlide(0);
    iniciarAutomatico();
});
document.addEventListener("DOMContentLoaded", function () {
    const slidesBanner = document.querySelectorAll(
        "#carrossel-banner .slide-banner"
    );

    slidesBanner.forEach(function (slide) {
        const imagem = slide.querySelector("img");

        if (!imagem) {
            return;
        }

        function aplicarImagemAoFundo() {
            slide.style.setProperty(
                "--fundo-banner",
                `url("${imagem.currentSrc || imagem.src}")`
            );
        }

        if (imagem.complete) {
            aplicarImagemAoFundo();
        } else {
            imagem.addEventListener(
                "load",
                aplicarImagemAoFundo,
                { once: true }
            );
        }
    });
});

/* ANIMAÇÃO NA TROCA DOS FILTROS DO MODAL */

document.addEventListener("DOMContentLoaded", function () {

    const listaAnimadaOportunidades =
        document.getElementById(
            "lista-oportunidades-modal"
        ) ||
        document.querySelector(
            ".modal-oportunidades-lista"
        );

    const botoesFiltroAnimados =
        document.querySelectorAll(
            ".modal-oportunidades-filtros [data-filtro-oportunidades]"
        );

    if (
        !listaAnimadaOportunidades ||
        botoesFiltroAnimados.length === 0
    ) {
        return;
    }

    botoesFiltroAnimados.forEach(
        function (botaoFiltro) {

            botaoFiltro.addEventListener(
                "click",
                function () {

                    listaAnimadaOportunidades
                        .classList
                        .remove("animar-troca-filtro");

                    void listaAnimadaOportunidades.offsetWidth;

                    listaAnimadaOportunidades
                        .classList
                        .add("animar-troca-filtro");
                }
            );
        }
    );

    listaAnimadaOportunidades.addEventListener(
        "animationend",
        function () {

            listaAnimadaOportunidades
                .classList
                .remove("animar-troca-filtro");
        }
    );
});

/* ==================================================
   INTERFACE GLOBAL DE AUTENTICAÇÃO
================================================== */

(function carregarInterfaceAutenticacao() {

    const scriptPrincipal =
        document.currentScript;

    if (
        !scriptPrincipal ||
        !scriptPrincipal.src
    ) {
        console.error(
            "Não foi possível localizar o script principal."
        );

        return;
    }

    const urlAuthUI =
        new URL(
            "auth-ui.js",
            scriptPrincipal.src
        );

    import(urlAuthUI.href).catch(
        function (erro) {
            console.error(
                "Não foi possível carregar a autenticação:",
                erro
            );
        }
    );

})();