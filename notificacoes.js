"use strict";

import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    observarLembretes,
    removerLembrete
} from "./lembretes-firestore.js";


const paginaNotificacoes =
    document.querySelector(
        ".pagina-notificacoes"
    );


if (paginaNotificacoes) {
    const mensagem =
        document.getElementById(
            "mensagem-notificacoes"
        );

    const resumo =
        document.getElementById(
            "resumo-notificacoes"
        );

    const filtro =
        document.getElementById(
            "filtro-notificacoes"
        );

    const estadoCarregando =
        document.getElementById(
            "estado-carregando-notificacoes"
        );

    const estadoVazio =
        document.getElementById(
            "estado-vazio-notificacoes"
        );

    const grade =
        document.getElementById(
            "grade-notificacoes"
        );

    const tituloVazio =
        estadoVazio.querySelector("h3");

    const textoVazio =
        estadoVazio.querySelector("p");


    let lembretes = [];
    let pararObservacao = null;
    let temporizadorMensagem = null;


    const nomesCategorias = {
        vestibular: "Vestibular",
        enem: "ENEM",
        bolsa: "Bolsa",
        "curso-tecnico": "Curso técnico",
        evento: "Evento"
    };


    function criarDataLocal(valor) {
        const partes =
            String(valor || "")
                .split("-")
                .map(Number);

        if (
            partes.length !== 3 ||
            partes.some(Number.isNaN)
        ) {
            return null;
        }

        const data =
            new Date(
                partes[0],
                partes[1] - 1,
                partes[2]
            );

        if (
            data.getFullYear() !== partes[0] ||
            data.getMonth() !== partes[1] - 1 ||
            data.getDate() !== partes[2]
        ) {
            return null;
        }

        return data;
    }


    function diferencaEmDias(valor) {
        const data =
            criarDataLocal(valor);

        if (!data) {
            return null;
        }

        const hoje = new Date();

        const diaEvento =
            Date.UTC(
                data.getFullYear(),
                data.getMonth(),
                data.getDate()
            );

        const diaAtual =
            Date.UTC(
                hoje.getFullYear(),
                hoje.getMonth(),
                hoje.getDate()
            );

        return Math.round(
            (diaEvento - diaAtual) /
            86400000
        );
    }


    function obterSituacao(lembrete) {
        const diferenca =
            diferencaEmDias(
                lembrete.data
            );

        if (diferenca === null) {
            return {
                texto: "Data pendente",
                classe: "futuro",
                grupo: "proximos"
            };
        }

        if (diferenca < 0) {
            return {
                texto: "Evento encerrado",
                classe: "encerrado",
                grupo: "encerrados"
            };
        }

        if (diferenca === 0) {
            return {
                texto: "É hoje",
                classe: "hoje",
                grupo: "hoje"
            };
        }

        if (diferenca === 1) {
            return {
                texto: "É amanhã",
                classe: "proximo",
                grupo: "proximos"
            };
        }

        if (diferenca <= 7) {
            return {
                texto: `Faltam ${diferenca} dias`,
                classe: "proximo",
                grupo: "proximos"
            };
        }

        return {
            texto: `Em ${diferenca} dias`,
            classe: "futuro",
            grupo: "proximos"
        };
    }


    function obterPartesData(valor) {
        const data =
            criarDataLocal(valor);

        if (!data) {
            return {
                dia: "--",
                mes: "SEM DATA",
                ano: ""
            };
        }

        return {
            dia:
                String(data.getDate())
                    .padStart(2, "0"),

            mes:
                data.toLocaleDateString(
                    "pt-BR",
                    {
                        month: "short"
                    }
                )
                    .replace(".", "")
                    .toUpperCase(),

            ano:
                String(data.getFullYear())
        };
    }


    function obterUrlSegura(valor) {
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
                url.protocol === "http:" ||
                url.protocol === "https:"
            ) {
                return url;
            }

            return null;
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


    function irParaLogin() {
        const url =
            new URL(
                "login.html",
                window.location.href
            );

        url.searchParams.set(
            "voltar",
            window.location.href
        );

        window.location.replace(
            url.href
        );
    }


    function criarLink(
        texto,
        url,
        classe,
        novaAba = false
    ) {
        const link =
            document.createElement("a");

        link.className =
            `link-card-notificacao ${classe}`;

        link.href = url.href;
        link.textContent = texto;

        if (novaAba) {
            link.target = "_blank";
            link.rel =
                "noopener noreferrer";
        }

        return link;
    }


    function criarCard(
        lembrete,
        indice
    ) {
        const situacao =
            obterSituacao(lembrete);

        const partesData =
            obterPartesData(
                lembrete.data
            );

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "cartao-notificacao";

        card.style.setProperty(
            "--indice-notificacao",
            indice
        );

        if (
            situacao.grupo ===
            "encerrados"
        ) {
            card.classList.add(
                "notificacao-encerrada"
            );
        }


        const areaData =
            document.createElement("div");

        areaData.className =
            "data-notificacao";


        const dia =
            document.createElement(
                "strong"
            );

        dia.className =
            "dia-notificacao";

        dia.textContent =
            partesData.dia;


        const mes =
            document.createElement("span");

        mes.className =
            "mes-notificacao";

        mes.textContent =
            partesData.mes;


        const ano =
            document.createElement("span");

        ano.className =
            "ano-notificacao";

        ano.textContent =
            partesData.ano;


        areaData.append(
            dia,
            mes,
            ano
        );


        const conteudo =
            document.createElement("div");

        conteudo.className =
            "conteudo-notificacao";


        const cabecalho =
            document.createElement("div");

        cabecalho.className =
            "cabecalho-card-notificacao";


        const categoria =
            document.createElement("span");

        categoria.className =
            "categoria-notificacao";

        categoria.textContent =
            nomesCategorias[
                String(
                    lembrete.categoria || ""
                ).toLowerCase()
            ] ||
            lembrete.categoria ||
            "Evento";


        const prazo =
            document.createElement("span");

        prazo.className =
            `prazo-notificacao ${situacao.classe}`;

        prazo.textContent =
            situacao.texto;


        cabecalho.append(
            categoria,
            prazo
        );


        const titulo =
            document.createElement("h3");

        titulo.textContent =
            lembrete.titulo ||
            "Evento sem título";


        conteudo.append(
            cabecalho,
            titulo
        );


        if (lembrete.instituicao) {
            const instituicao =
                document.createElement("p");

            instituicao.className =
                "instituicao-notificacao";

            instituicao.textContent =
                lembrete.instituicao;

            conteudo.append(
                instituicao
            );
        }


        if (lembrete.descricao) {
            const descricao =
                document.createElement("p");

            descricao.className =
                "descricao-notificacao";

            descricao.textContent =
                lembrete.descricao;

            conteudo.append(
                descricao
            );
        }


        const acoes =
            document.createElement("div");

        acoes.className =
            "acoes-notificacao";


        const urlCalendario =
            new URL(
                "calendario.html",
                window.location.href
            );

        acoes.append(
            criarLink(
                "Ver calendário",
                urlCalendario,
                "secundario"
            )
        );


        const urlOficial =
            obterUrlSegura(
                lembrete.urlOficial
            );

        if (urlOficial) {
            acoes.append(
                criarLink(
                    "Página oficial",
                    urlOficial,
                    "principal",
                    true
                )
            );
        }


        const botaoRemover =
            document.createElement(
                "button"
            );

        botaoRemover.type =
            "button";

        botaoRemover.className =
            "btn-remover-lembrete";

        botaoRemover.textContent =
            "Desativar lembrete";

        botaoRemover.setAttribute(
            "aria-label",
            `Desativar lembrete de ${
                lembrete.titulo ||
                "evento"
            }`
        );


        botaoRemover.addEventListener(
            "click",

            async function () {
                botaoRemover.disabled =
                    true;

                try {
                    await removerLembrete(
                        lembrete.eventoId ||
                        lembrete.id
                    );

                    mostrarMensagem(
                        `${
                            lembrete.titulo ||
                            "O evento"
                        } foi removido das notificações.`,
                        "sucesso"
                    );
                } catch (erro) {
                    botaoRemover.disabled =
                        false;

                    if (!auth.currentUser) {
                        irParaLogin();
                        return;
                    }

                    console.error(
                        "Erro ao remover lembrete:",
                        erro
                    );

                    mostrarMensagem(
                        "Não foi possível desativar o lembrete. Tente novamente.",
                        "erro"
                    );
                }
            }
        );


        acoes.append(
            botaoRemover
        );

        card.append(
            areaData,
            conteudo,
            acoes
        );

        return card;
    }


    function ordenarLembretes(
        lista
    ) {
        return [...lista].sort(
            function (a, b) {
                const diferencaA =
                    diferencaEmDias(
                        a.data
                    );

                const diferencaB =
                    diferencaEmDias(
                        b.data
                    );

                const encerradoA =
                    diferencaA !== null &&
                    diferencaA < 0;

                const encerradoB =
                    diferencaB !== null &&
                    diferencaB < 0;

                if (
                    encerradoA !==
                    encerradoB
                ) {
                    return encerradoA
                        ? 1
                        : -1;
                }

                const tempoA =
                    criarDataLocal(
                        a.data
                    )?.getTime() ??
                    Number.MAX_SAFE_INTEGER;

                const tempoB =
                    criarDataLocal(
                        b.data
                    )?.getTime() ??
                    Number.MAX_SAFE_INTEGER;

                return encerradoA
                    ? tempoB - tempoA
                    : tempoA - tempoB;
            }
        );
    }


    function passaNoFiltro(
        lembrete,
        valorFiltro
    ) {
        if (
            valorFiltro ===
            "todos"
        ) {
            return true;
        }

        const grupo =
            obterSituacao(
                lembrete
            ).grupo;

        if (
            valorFiltro ===
            "hoje"
        ) {
            return grupo === "hoje";
        }

        if (
            valorFiltro ===
            "encerrados"
        ) {
            return (
                grupo ===
                "encerrados"
            );
        }

        return (
            valorFiltro ===
                "proximos" &&
            (
                grupo ===
                    "proximos" ||
                grupo ===
                    "hoje"
            )
        );
    }


    function atualizarTextoVazio(
        total,
        valorFiltro
    ) {
        if (total === 0) {
            tituloVazio.textContent =
                "Nenhum lembrete ativado";

            textoVazio.textContent =
                "Abra o calendário e escolha os eventos importantes que você deseja acompanhar.";

            return;
        }

        tituloVazio.textContent =
            "Nenhum evento neste filtro";

        textoVazio.textContent =
            valorFiltro === "hoje"
                ? "Você não possui nenhum evento marcado para hoje."
                : "Seus lembretes não possuem eventos correspondentes a este filtro.";
    }


    function renderizar() {
        const valorFiltro =
            filtro.value;

        const filtrados =
            lembretes.filter(
                function (lembrete) {
                    return passaNoFiltro(
                        lembrete,
                        valorFiltro
                    );
                }
            );

        estadoCarregando.hidden =
            true;

        grade.replaceChildren();


        if (lembretes.length === 0) {
            resumo.textContent =
                "Nenhum lembrete ativo na sua conta.";
        } else if (
            valorFiltro === "todos"
        ) {
            resumo.textContent =
                lembretes.length === 1
                    ? "1 lembrete salvo na sua conta."
                    : `${lembretes.length} lembretes salvos na sua conta.`;
        } else {
            resumo.textContent =
                `${filtrados.length} de ${lembretes.length} lembretes exibidos.`;
        }


        if (
            filtrados.length === 0
        ) {
            grade.hidden = true;
            estadoVazio.hidden = false;

            atualizarTextoVazio(
                lembretes.length,
                valorFiltro
            );

            return;
        }

        estadoVazio.hidden = true;
        grade.hidden = false;

        filtrados.forEach(
            function (
                lembrete,
                indice
            ) {
                grade.append(
                    criarCard(
                        lembrete,
                        indice
                    )
                );
            }
        );
    }


    function tratarErro(erro) {
        console.error(
            "Erro ao carregar notificações:",
            erro
        );

        estadoCarregando.hidden =
            true;

        estadoVazio.hidden =
            true;

        grade.hidden =
            true;

        resumo.textContent =
            "Não foi possível carregar seus lembretes.";

        mostrarMensagem(
            "Não foi possível carregar suas notificações. Atualize a página e tente novamente.",
            "erro"
        );
    }


    filtro.addEventListener(
        "change",
        renderizar
    );


    onAuthStateChanged(
        auth,

        function (usuario) {
            pararObservacao?.();
            pararObservacao = null;

            if (!usuario) {
                irParaLogin();
                return;
            }

            pararObservacao =
                observarLembretes(
                    function (
                        novosLembretes
                    ) {
                        lembretes =
                            ordenarLembretes(
                                novosLembretes
                            );

                        renderizar();
                    },

                    tratarErro
                );
        },

        tratarErro
    );


    window.addEventListener(
        "beforeunload",

        function () {
            pararObservacao?.();
        },

        {
            once: true
        }
    );
}