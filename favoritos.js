"use strict";

import {
    auth
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    observarFavoritos,
    removerFavorito
} from "./favoritos-firestore.js";


const paginaFavoritos =
    document.querySelector(
        ".pagina-favoritos"
    );


if (paginaFavoritos) {

    const mensagem =
        document.getElementById(
            "mensagem-favoritos"
        );

    const resumo =
        document.getElementById(
            "resumo-favoritos"
        );

    const filtroTipo =
        document.getElementById(
            "filtro-tipo-favoritos"
        );

    const estadoCarregando =
        document.getElementById(
            "estado-carregando-favoritos"
        );

    const estadoVazio =
        document.getElementById(
            "estado-vazio-favoritos"
        );

    const grade =
        document.getElementById(
            "grade-favoritos"
        );

    const tituloEstadoVazio =
        estadoVazio.querySelector("h3");

    const textoEstadoVazio =
        estadoVazio.querySelector("p");

    const linkEstadoVazio =
        estadoVazio.querySelector(
            ".link-explorar-favoritos"
        );


    let todosFavoritos = [];
    let cancelarObservacao = null;
    let temporizadorMensagem = null;


    const rotulosTipo = {
        universidade: "Universidade",
        curso: "Curso técnico",
        bolsa: "Bolsa",
        profissao: "Profissão"
    };


    const destinosTipo = {
        todos: {
            titulo: "Nenhum favorito por aqui",

            texto:
                "Explore o site e use o coração para guardar aquilo que chamou sua atenção.",

            pagina: "descobrir.html",
            botao: "Começar a explorar"
        },

        universidade: {
            titulo: "Nenhuma universidade salva",

            texto:
                "Explore as instituições e use o coração para guardar suas preferidas.",

            pagina: "universidades.html",
            botao: "Explorar universidades"
        },

        curso: {
            titulo: "Nenhum curso salvo",

            texto:
                "Explore os cursos técnicos e salve aqueles que combinam com seus objetivos.",

            pagina: "cursos-tecnicos.html",
            botao: "Explorar cursos"
        },

        bolsa: {
            titulo: "Nenhuma bolsa salva",

            texto:
                "Explore as bolsas disponíveis e guarde as oportunidades interessantes.",

            pagina: "bolsas.html",
            botao: "Explorar bolsas"
        },

        profissao: {
            titulo: "Nenhuma profissão salva",

            texto:
                "Conheça diferentes áreas profissionais e salve aquelas que deseja explorar.",

            pagina: "guia-profissional.html",
            botao: "Explorar profissões"
        }
    };


    function obterUrlSegura(
        valor,
        exigirMesmoSite = false
    ) {
        if (!valor) {
            return null;
        }

        try {
            const url =
                new URL(
                    String(valor),
                    window.location.href
                );

            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                return null;
            }

            if (
                exigirMesmoSite &&
                url.origin !==
                window.location.origin
            ) {
                return null;
            }

            return url;

        } catch {
            return null;
        }
    }


    function mostrarMensagem(
        texto,
        tipo
    ) {
        window.clearTimeout(
            temporizadorMensagem
        );

        mensagem.textContent = texto;

        mensagem.className =
            `mensagem-favoritos ${tipo}`;

        mensagem.hidden = false;

        temporizadorMensagem =
            window.setTimeout(
                function () {
                    mensagem.hidden = true;
                },
                3500
            );
    }


    function redirecionarParaLogin() {
        const urlLogin =
            new URL(
                "login.html",
                window.location.href
            );

        urlLogin.searchParams.set(
            "voltar",
            window.location.href
        );

        window.location.replace(
            urlLogin.href
        );
    }


    function obterFallbackImagem(
        favorito
    ) {
        const subtitulo =
            String(
                favorito.subtitulo || ""
            );

        const possivelSigla =
            subtitulo
                .split("•")[0]
                .trim();

        if (
            possivelSigla &&
            possivelSigla.length <= 6
        ) {
            return possivelSigla
                .slice(0, 4)
                .toUpperCase();
        }

        const palavras =
            String(
                favorito.titulo || "Favorito"
            )
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (palavras.length === 1) {
            return palavras[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            palavras[0].charAt(0) +
            palavras[
                palavras.length - 1
            ].charAt(0)
        ).toUpperCase();
    }


    function criarImagemFavorito(
        favorito
    ) {
        const areaImagem =
            document.createElement("div");

        areaImagem.className =
            "imagem-favorito";

        const criarFallback =
            function () {
                const fallback =
                    document.createElement(
                        "span"
                    );

                fallback.className =
                    "fallback-imagem-favorito";

                fallback.textContent =
                    obterFallbackImagem(
                        favorito
                    );

                return fallback;
            };

        const urlImagem =
            obterUrlSegura(
                favorito.imagem
            );

        if (!urlImagem) {
            areaImagem.append(
                criarFallback()
            );

            return areaImagem;
        }

        const imagem =
            document.createElement("img");

        imagem.src = urlImagem.href;

        imagem.alt =
            favorito.titulo
                ? `Imagem de ${favorito.titulo}`
                : "Imagem do favorito";

        imagem.referrerPolicy =
            "no-referrer";

        imagem.addEventListener(
            "error",

            function () {
                areaImagem.replaceChildren(
                    criarFallback()
                );
            },

            {
                once: true
            }
        );

        areaImagem.append(imagem);

        return areaImagem;
    }


    function criarLinkFavorito(
        texto,
        url,
        classe,
        abrirNovaAba
    ) {
        const link =
            document.createElement("a");

        link.className =
            `link-card-favorito ${classe}`;

        link.href = url.href;
        link.textContent = texto;

        if (abrirNovaAba) {
            link.target = "_blank";

            link.rel =
                "noopener noreferrer";
        }

        return link;
    }


    function criarCardFavorito(
        favorito,
        indice
    ) {
        const card =
            document.createElement(
                "article"
            );

        card.className =
            "cartao-favorito";

        card.style.setProperty(
            "--indice-favorito",
            indice
        );

        card.dataset.tipo =
            favorito.tipo || "";

        card.dataset.itemId =
            favorito.itemId || "";


        const areaImagem =
            criarImagemFavorito(
                favorito
            );

        const conteudo =
            document.createElement("div");

        conteudo.className =
            "conteudo-favorito";


        const cabecalho =
            document.createElement("div");

        cabecalho.className =
            "cabecalho-card-favorito";


        const tipo =
            document.createElement("span");

        tipo.className =
            "tipo-favorito";

        tipo.textContent =
            rotulosTipo[favorito.tipo] ||
            "Favorito";


        const botaoRemover =
            document.createElement("button");

        botaoRemover.type = "button";

        botaoRemover.className =
            "btn-remover-favorito";

        botaoRemover.textContent = "♥";

        botaoRemover.setAttribute(
            "aria-label",
            `Remover ${favorito.titulo} dos favoritos`
        );

        botaoRemover.title =
            "Remover dos favoritos";


        cabecalho.append(
            tipo,
            botaoRemover
        );


        const titulo =
            document.createElement("h3");

        titulo.textContent =
            favorito.titulo ||
            "Favorito sem título";


        conteudo.append(
            cabecalho,
            titulo
        );


        if (favorito.subtitulo) {
            const subtitulo =
                document.createElement("p");

            subtitulo.className =
                "subtitulo-favorito";

            subtitulo.textContent =
                favorito.subtitulo;

            conteudo.append(
                subtitulo
            );
        }


        if (favorito.descricao) {
            const descricao =
                document.createElement("p");

            descricao.className =
                "descricao-favorito";

            descricao.textContent =
                favorito.descricao;

            conteudo.append(
                descricao
            );
        }


        const acoes =
            document.createElement("div");

        acoes.className =
            "acoes-favorito";


        const paginaOrigem =
            obterUrlSegura(
                favorito.paginaOrigem,
                true
            );

        if (paginaOrigem) {
            acoes.append(
                criarLinkFavorito(
                    "Ver no site",
                    paginaOrigem,
                    "secundario",
                    false
                )
            );
        }


        const urlPrincipal =
            obterUrlSegura(
                favorito.url
            );

        if (urlPrincipal) {
            const ehExterno =
                urlPrincipal.origin !==
                window.location.origin;

            acoes.append(
                criarLinkFavorito(
                    favorito.tipo ===
                    "universidade"
                        ? "Site oficial"
                        : "Abrir oportunidade",

                    urlPrincipal,
                    "principal",
                    ehExterno
                )
            );
        }


        botaoRemover.addEventListener(
            "click",

            async function () {
                botaoRemover.disabled = true;

                const tituloRemovido =
                    favorito.titulo ||
                    "O item";

                try {
                    await removerFavorito(
                        favorito.tipo,
                        favorito.itemId
                    );

                    mostrarMensagem(
                        `${tituloRemovido} foi removido dos favoritos.`,
                        "sucesso"
                    );

                } catch (erro) {
                    botaoRemover.disabled =
                        false;

                    if (
                        erro.code ===
                        "favoritos/usuario-nao-autenticado"
                    ) {
                        redirecionarParaLogin();
                        return;
                    }

                    console.error(
                        "Erro ao remover favorito:",
                        erro
                    );

                    mostrarMensagem(
                        "Não foi possível remover o favorito. Tente novamente.",
                        "erro"
                    );
                }
            }
        );


        card.append(
            areaImagem,
            conteudo
        );


        if (acoes.children.length > 0) {
            card.append(acoes);
        }

        return card;
    }


    function atualizarEstadoVazio(
        tipoSelecionado
    ) {
        const configuracao =
            destinosTipo[tipoSelecionado] ||
            destinosTipo.todos;

        tituloEstadoVazio.textContent =
            configuracao.titulo;

        textoEstadoVazio.textContent =
            configuracao.texto;

        linkEstadoVazio.href =
            configuracao.pagina;

        linkEstadoVazio.textContent =
            configuracao.botao;
    }


    function atualizarResumo(
        quantidadeExibida,
        quantidadeTotal,
        tipoSelecionado
    ) {
        if (quantidadeTotal === 0) {
            resumo.textContent =
                "Nenhum item salvo na sua conta.";

            return;
        }

        if (tipoSelecionado === "todos") {
            resumo.textContent =
                quantidadeTotal === 1
                    ? "1 item salvo na sua conta."
                    : `${quantidadeTotal} itens salvos na sua conta.`;

            return;
        }

        resumo.textContent =
            `${quantidadeExibida} de ${quantidadeTotal} itens salvos.`;
    }


    function renderizarFavoritos() {
        const tipoSelecionado =
            filtroTipo.value;

        const favoritosFiltrados =
            tipoSelecionado === "todos"
                ? todosFavoritos
                : todosFavoritos.filter(
                    function (favorito) {
                        return (
                            favorito.tipo ===
                            tipoSelecionado
                        );
                    }
                );

        estadoCarregando.hidden = true;

        atualizarResumo(
            favoritosFiltrados.length,
            todosFavoritos.length,
            tipoSelecionado
        );

        grade.replaceChildren();

        if (
            favoritosFiltrados.length === 0
        ) {
            grade.hidden = true;
            estadoVazio.hidden = false;

            atualizarEstadoVazio(
                tipoSelecionado
            );

            return;
        }

        estadoVazio.hidden = true;
        grade.hidden = false;

        favoritosFiltrados.forEach(
            function (
                favorito,
                indice
            ) {
                grade.append(
                    criarCardFavorito(
                        favorito,
                        indice
                    )
                );
            }
        );
    }


    function tratarErroCarregamento(
        erro
    ) {
        console.error(
            "Erro ao abrir favoritos:",
            erro
        );

        estadoCarregando.hidden = true;
        estadoVazio.hidden = true;
        grade.hidden = true;

        resumo.textContent =
            "Não foi possível carregar seus favoritos.";

        mostrarMensagem(
            "Não foi possível carregar seus favoritos. Atualize a página e tente novamente.",
            "erro"
        );
    }


    filtroTipo.addEventListener(
        "change",
        renderizarFavoritos
    );


    onAuthStateChanged(
        auth,

        function (usuario) {
            if (!usuario) {
                cancelarObservacao?.();
                redirecionarParaLogin();

                return;
            }

            if (cancelarObservacao) {
                return;
            }

            cancelarObservacao =
                observarFavoritos(
                    "",

                    function (favoritos) {
                        todosFavoritos =
                            favoritos;

                        renderizarFavoritos();
                    },

                    tratarErroCarregamento
                );
        },

        tratarErroCarregamento
    );


    window.addEventListener(
        "beforeunload",

        function () {
            cancelarObservacao?.();
        },

        {
            once: true
        }
    );
}