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


const paginaCursos =
    document.querySelector(
        ".pagina-cursos-tecnicos"
    );


if (paginaCursos) {

    /* ==================================================
       ELEMENTOS DA PÁGINA
    ================================================== */

    const obterElemento =
        function (id) {
            return document.getElementById(id);
        };


    const campoPesquisa =
        obterElemento(
            "pesquisa-curso"
        );

    const filtroArea =
        obterElemento(
            "filtro-area-curso"
        );

    const filtroModalidade =
        obterElemento(
            "filtro-modalidade-curso"
        );

    const botaoAplicarFiltros =
        obterElemento(
            "btn-aplicar-filtros-curso"
        );

    const campoOrdenacao =
        obterElemento(
            "ordenar-cursos"
        );

    const contadorCursos =
        obterElemento(
            "contador-cursos"
        );

    const mensagemSemCursos =
        obterElemento(
            "mensagem-sem-cursos"
        );

    const gradeCursos =
        document.querySelector(
            ".grade-cursos-tecnicos"
        );


    /* ==================================================
       ELEMENTOS DO MODAL
    ================================================== */

    const modalCurso =
        obterElemento(
            "modal-curso-tecnico"
        );

    const overlayModal =
        modalCurso?.querySelector(
            ".overlay-modal-curso"
        );

    const botaoFecharModal =
        obterElemento(
            "fechar-modal-curso"
        );


    const camposModal = {

        area:
            obterElemento(
                "area-modal-curso"
            ),

        titulo:
            obterElemento(
                "titulo-modal-curso"
            ),

        instituicao:
            obterElemento(
                "instituicao-modal-curso"
            ),

        local:
            obterElemento(
                "local-modal-curso"
            ),

        duracao:
            obterElemento(
                "duracao-modal-curso"
            ),

        modalidade:
            obterElemento(
                "modalidade-modal-curso"
            ),

        turno:
            obterElemento(
                "turno-modal-curso"
            ),

        processoTitulo:
            obterElemento(
                "titulo-processo-modal"
            ),

        status:
            obterElemento(
                "status-processo-modal"
            ),

        avisoStatus:
            obterElemento(
                "aviso-status-processo"
            ),

        textoOferta:
            obterElemento(
                "texto-oferta-modal"
            ),

        verificacao:
            obterElemento(
                "verificacao-modal-curso"
            ),

        botaoProcesso:
            obterElemento(
                "btn-processo-curso"
            ),

        botaoInstituicao:
            obterElemento(
                "btn-instituicao-curso"
            )
    };


    /* ==================================================
       ESTADO LOCAL
    ================================================== */

    let cursosTecnicos = [];

    let cursosCarregados =
        false;

    let idsCursosFavoritos =
        new Set();

    let ultimoElementoFocado =
        null;


    const ordemCursosIniciais = {

        "desenvolvimento-sistemas": 1,

        "administracao": 2,

        "enfermagem": 3,

        "mecanica": 4,

        "redes-computadores": 5,

        "logistica": 6
    };


    /* ==================================================
       FUNÇÕES AUXILIARES
    ================================================== */

    function normalizarTexto(texto) {

        return String(
            texto ||
            ""
        )
            .toLowerCase()

            .normalize(
                "NFD"
            )

            .replace(
                /[\u0300-\u036f]/g,
                ""
            );
    }


    function escaparHtml(texto) {

        return String(
            texto ??
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


    function obterAreaNome(curso) {

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
            curso.areaNome ||

            nomes[
                curso.area
            ] ||

            curso.area ||

            "Curso técnico"
        );
    }


    function obterOrdem(curso) {

        const ordemSalva =
            Number(
                curso.ordem
            );


        if (
            Number.isFinite(
                ordemSalva
            )
        ) {
            return ordemSalva;
        }


        return (
            ordemCursosIniciais[
                curso.id
            ] ??
            9999
        );
    }


    /* ==================================================
       FILTROS E ORDENAÇÃO
    ================================================== */

    function obterCursosVisiveis() {

        const pesquisa =
            normalizarTexto(
                campoPesquisa
                    ?.value
                    .trim()
            );


        const areaSelecionada =
            filtroArea?.value ||
            "";


        const modalidadeSelecionada =
            filtroModalidade?.value ||
            "";


        const ordenacao =
            campoOrdenacao?.value ||
            "relevancia";


        const resultado =
            cursosTecnicos.filter(

                function (curso) {

                    const informacoes =
                        Array.isArray(
                            curso.informacoesResumo
                        )

                            ? curso.informacoesResumo

                            : [];


                    const textoCompleto =
                        normalizarTexto(

                            [
                                curso.nome,

                                obterAreaNome(
                                    curso
                                ),

                                curso.instituicaoResumo,

                                curso.descricaoResumo,

                                ...informacoes

                            ].join(" ")
                        );


                    const correspondePesquisa =

                        pesquisa === "" ||

                        textoCompleto.includes(
                            pesquisa
                        );


                    const correspondeArea =

                        areaSelecionada === "" ||

                        curso.area ===
                        areaSelecionada;


                    const correspondeModalidade =

                        modalidadeSelecionada === "" ||

                        curso.modalidade ===
                        modalidadeSelecionada;


                    return (
                        correspondePesquisa &&

                        correspondeArea &&

                        correspondeModalidade
                    );
                }
            );


        resultado.sort(

            function (
                cursoA,
                cursoB
            ) {

                if (
                    ordenacao ===
                    "nome"
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


                if (
                    ordenacao ===
                    "duracao"
                ) {

                    return (

                        Number(
                            cursoA.duracaoMeses ||
                            0
                        )

                        -

                        Number(
                            cursoB.duracaoMeses ||
                            0
                        )
                    );
                }


                const diferenca =

                    obterOrdem(
                        cursoA
                    )

                    -

                    obterOrdem(
                        cursoB
                    );


                if (
                    diferenca !== 0
                ) {
                    return diferenca;
                }


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


        return resultado;
    }


    /* ==================================================
       CRIAÇÃO DOS CARDS
    ================================================== */

    function criarHtmlCard(curso) {

        const id =
            String(
                curso.id
            );


        const nome =
            curso.nome ||
            "Curso técnico";


        const estaFavoritado =
            idsCursosFavoritos.has(
                id
            );


        const informacoes =
            Array.isArray(
                curso.informacoesResumo
            )

                ? curso.informacoesResumo

                : [];


        const htmlInformacoes =

            informacoes.map(

                function (informacao) {

                    return (
                        `<span>${escaparHtml(
                            informacao
                        )}</span>`
                    );
                }

            ).join("");


        return `
            <article
                class="card-curso-tecnico"
                data-id="${escaparHtml(id)}"
                data-nome="${escaparHtml(nome)}"
                data-area="${escaparHtml(curso.area)}"
                data-modalidade="${escaparHtml(curso.modalidade)}"
                data-duracao="${escaparHtml(curso.duracaoMeses)}"
            >

                <div class="cabecalho-card-curso">

                    <div class="simbolo-curso">

                        ${escaparHtml(
                            curso.simbolo ||
                            "🎓"
                        )}

                    </div>


                    <button
                        class="btn-favorito-curso${estaFavoritado
                            ? " favoritado"
                            : ""
                        }"
                        type="button"
                        data-curso-id="${escaparHtml(id)}"
                        aria-pressed="${String(estaFavoritado)}"
                        aria-label="${estaFavoritado
                            ? "Remover"
                            : "Adicionar"
                        } ${escaparHtml(nome)} ${estaFavoritado
                            ? "dos"
                            : "aos"
                        } favoritos"
                        title="${estaFavoritado
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                        }"
                    >

                        ${estaFavoritado
                            ? "♥"
                            : "♡"
                        }

                    </button>

                </div>


                <span class="area-curso">

                    ${escaparHtml(
                        obterAreaNome(
                            curso
                        )
                    )}

                </span>


                <h3>

                    ${escaparHtml(
                        nome
                    )}

                </h3>


                <p class="instituicao-curso">

                    🏫 ${escaparHtml(
                        curso.instituicaoResumo ||
                        "Instituição não informada"
                    )}

                </p>


                <p>

                    ${escaparHtml(
                        curso.descricaoResumo ||
                        ""
                    )}

                </p>


                <div class="informacoes-curso">

                    ${htmlInformacoes}

                </div>


                <a
                    href="#"
                    class="link-curso btn-detalhes-curso"
                    data-curso-id="${escaparHtml(id)}"
                >

                    Ver detalhes →

                </a>

            </article>
        `;
    }


    function renderizarCursos() {

        if (
            !gradeCursos ||
            !cursosCarregados
        ) {
            return;
        }


        const cursosVisiveis =
            obterCursosVisiveis();


        gradeCursos.innerHTML =

            cursosVisiveis
                .map(
                    criarHtmlCard
                )
                .join("");


        if (
            contadorCursos
        ) {

            contadorCursos.textContent =

                cursosVisiveis.length === 1

                    ? "1 curso encontrado"

                    : `${cursosVisiveis.length} cursos encontrados`;
        }


        if (
            mensagemSemCursos
        ) {

            mensagemSemCursos.hidden =

                cursosVisiveis.length !== 0;
        }
    }


    /* ==================================================
       FAVORITOS
    ================================================== */

    function criarDadosFavorito(curso) {

        return {

            tipo:
                "curso",

            itemId:
                String(
                    curso.id
                ),

            titulo:
                String(
                    curso.nome ||
                    "Curso técnico"
                ),

            subtitulo:

                [
                    obterAreaNome(
                        curso
                    ),

                    curso.instituicaoResumo

                ]
                    .filter(
                        Boolean
                    )
                    .join(
                        " • "
                    ),

            descricao:
                String(
                    curso.descricaoResumo ||
                    ""
                ),

            imagem:
                "",

            url:
                "",

            paginaOrigem:
                "cursos-tecnicos.html"
        };
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


        window.location.assign(
            urlLogin.href
        );
    }


    async function tratarCliqueFavorito(
        botao,
        curso
    ) {

        botao.disabled =
            true;


        try {

            const estaFavoritado =

                await alternarFavorito(

                    criarDadosFavorito(
                        curso
                    )
                );


            if (
                estaFavoritado
            ) {

                idsCursosFavoritos.add(
                    String(
                        curso.id
                    )
                );

            } else {

                idsCursosFavoritos.delete(
                    String(
                        curso.id
                    )
                );
            }


            renderizarCursos();


        } catch (erro) {

            if (
                erro?.code ===

                "favoritos/usuario-nao-autenticado"
            ) {

                redirecionarParaLogin();

                return;
            }


            console.error(

                "Erro ao alterar curso favorito:",

                erro
            );


        } finally {

            botao.disabled =
                false;
        }
    }


    observarFavoritos(

        "curso",


        function (favoritos) {

            idsCursosFavoritos =

                new Set(

                    favoritos.map(

                        function (
                            favorito
                        ) {

                            return String(
                                favorito.itemId
                            );
                        }
                    )
                );


            renderizarCursos();
        },


        function (erro) {

            console.error(

                "Erro ao acompanhar cursos favoritos:",

                erro
            );
        }
    );


    /* ==================================================
       PREENCHIMENTO DO MODAL
    ================================================== */

    function definirTexto(
        elemento,
        valor,
        padrao = "—"
    ) {

        if (
            elemento
        ) {

            elemento.textContent =

                valor ||
                padrao;
        }
    }


    function configurarLink(
        elemento,
        url,
        texto,
        padrao
    ) {

        if (
            !elemento
        ) {
            return;
        }


        const possuiUrl =

            Boolean(

                String(
                    url ||
                    ""
                ).trim()
            );


        elemento.hidden =
            !possuiUrl;


        if (
            !possuiUrl
        ) {

            elemento.removeAttribute(
                "href"
            );

            return;
        }


        elemento.href =
            String(
                url
            );


        elemento.textContent =

            texto ||
            padrao;
    }


    function preencherModal(curso) {

        const detalhes =
            curso.detalhes ||
            {};


        definirTexto(

            camposModal.area,

            detalhes.area ||
            obterAreaNome(
                curso
            ),

            "Curso técnico"
        );


        definirTexto(

            camposModal.titulo,

            detalhes.titulo ||
            curso.nome,

            "Curso técnico"
        );


        definirTexto(

            camposModal.instituicao,

            detalhes.instituicao ||
            curso.instituicaoResumo,

            "Instituição não informada"
        );


        definirTexto(
            camposModal.local,
            detalhes.local
        );


        definirTexto(
            camposModal.duracao,
            detalhes.duracao
        );


        definirTexto(
            camposModal.modalidade,
            detalhes.modalidade
        );


        definirTexto(
            camposModal.turno,
            detalhes.turno
        );


        definirTexto(

            camposModal.processoTitulo,

            detalhes.processoTitulo,

            "Processo seletivo"
        );


        definirTexto(

            camposModal.status,

            detalhes.status,

            "Consulte a instituição"
        );


        if (
            camposModal.status
        ) {

            camposModal.status.className =

                "status-processo" +

                (
                    detalhes.statusClasse

                        ? ` ${detalhes.statusClasse}`

                        : ""
                );
        }


        definirTexto(

            camposModal.avisoStatus,

            detalhes.avisoStatus,

            "Consulte a fonte oficial para confirmar as informações."
        );


        const processo =

            Array.isArray(
                detalhes.processo
            )

                ? detalhes.processo

                : [];


        for (
            let indice = 0;

            indice < 6;

            indice++
        ) {

            const numero =
                indice + 1;


            const rotulo =
                obterElemento(
                    `rotulo-processo-${numero}`
                );


            const valor =
                obterElemento(
                    `valor-processo-${numero}`
                );


            const item =
                processo[
                    indice
                ];


            if (
                rotulo?.parentElement
            ) {

                rotulo.parentElement.hidden =
                    !item;
            }


            if (
                item
            ) {

                definirTexto(

                    rotulo,

                    item.rotulo,

                    "Informação"
                );


                definirTexto(

                    valor,

                    item.valor
                );
            }
        }


        definirTexto(

            camposModal.textoOferta,

            detalhes.textoOferta,

            curso.descricaoResumo ||

            "Informações sobre esta oferta."
        );


        definirTexto(

            camposModal.verificacao,

            detalhes.verificacao,

            "Consulte a fonte oficial para confirmar as informações."
        );


        configurarLink(

            camposModal.botaoProcesso,

            detalhes.processoLink,

            detalhes.processoTexto,

            "Fonte oficial do processo"
        );


        configurarLink(

            camposModal.botaoInstituicao,

            detalhes.instituicaoLink,

            detalhes.instituicaoTexto,

            "Site da instituição"
        );
    }


    /* ==================================================
       ABRIR E FECHAR MODAL
    ================================================== */

    function abrirModal(curso) {

        if (
            !modalCurso
        ) {
            return;
        }


        ultimoElementoFocado =
            document.activeElement;


        preencherModal(
            curso
        );


        modalCurso.classList.add(
            "ativo"
        );


        modalCurso.setAttribute(

            "aria-hidden",

            "false"
        );


        document.body.style.overflow =
            "hidden";


        botaoFecharModal?.focus();
    }


    function fecharModal() {

        if (
            !modalCurso
        ) {
            return;
        }


        modalCurso.classList.remove(
            "ativo"
        );


        modalCurso.setAttribute(

            "aria-hidden",

            "true"
        );


        document.body.style.overflow =
            "";


        if (
            ultimoElementoFocado instanceof
            HTMLElement
        ) {

            ultimoElementoFocado.focus();
        }
    }


    /* ==================================================
       EVENTOS DOS FILTROS
    ================================================== */

    campoPesquisa?.addEventListener(

        "input",

        renderizarCursos
    );


    campoPesquisa?.addEventListener(

        "keydown",

        function (evento) {

            if (
                evento.key ===
                "Enter"
            ) {

                evento.preventDefault();

                renderizarCursos();
            }
        }
    );


    filtroArea?.addEventListener(

        "change",

        renderizarCursos
    );


    filtroModalidade?.addEventListener(

        "change",

        renderizarCursos
    );


    botaoAplicarFiltros?.addEventListener(

        "click",

        renderizarCursos
    );


    campoOrdenacao?.addEventListener(

        "change",

        renderizarCursos
    );


    /* ==================================================
       CLIQUES NOS CARDS
    ================================================== */

    gradeCursos?.addEventListener(

        "click",

        async function (evento) {

            const botaoFavorito =

                evento.target.closest(

                    ".btn-favorito-curso"
                );


            if (
                botaoFavorito
            ) {

                evento.preventDefault();

                evento.stopPropagation();


                const cursoId =

                    botaoFavorito
                        .dataset
                        .cursoId;


                const curso =

                    cursosTecnicos.find(

                        function (item) {

                            return (

                                String(
                                    item.id
                                )

                                ===

                                String(
                                    cursoId
                                )
                            );
                        }
                    );


                if (
                    curso
                ) {

                    await tratarCliqueFavorito(

                        botaoFavorito,

                        curso
                    );
                }


                return;
            }


            const botaoDetalhes =

                evento.target.closest(

                    ".btn-detalhes-curso"
                );


            if (
                !botaoDetalhes
            ) {
                return;
            }


            evento.preventDefault();


            const cursoId =

                botaoDetalhes
                    .dataset
                    .cursoId;


            const curso =

                cursosTecnicos.find(

                    function (item) {

                        return (

                            String(
                                item.id
                            )

                            ===

                            String(
                                cursoId
                            )
                        );
                    }
                );


            if (
                curso
            ) {

                abrirModal(
                    curso
                );
            }
        }
    );


    /* ==================================================
       EVENTOS DO MODAL
    ================================================== */

    botaoFecharModal?.addEventListener(

        "click",

        fecharModal
    );


    overlayModal?.addEventListener(

        "click",

        fecharModal
    );


    document.addEventListener(

        "keydown",

        function (evento) {

            if (
                evento.key ===
                "Escape"

                &&

                modalCurso
                    ?.classList
                    .contains(
                        "ativo"
                    )
            ) {

                fecharModal();
            }
        }
    );


    /* ==================================================
       FIRESTORE EM TEMPO REAL
    ================================================== */

    const referenciaCursos =

        collection(

            db,

            "cursosTecnicos"
        );


    onSnapshot(

        referenciaCursos,


        function (snapshot) {

            cursosTecnicos =

                snapshot.docs.map(

                    function (
                        documento
                    ) {

                        return {

                            id:
                                documento.id,

                            ...documento.data()
                        };
                    }
                );


            cursosCarregados =
                true;


            renderizarCursos();


            console.info(

                "Cursos técnicos sincronizados com Firestore:",

                cursosTecnicos.length
            );
        },


        function (erro) {

            console.error(

                "Erro ao carregar cursos técnicos:",

                erro
            );


            if (
                contadorCursos
            ) {

                contadorCursos.textContent =

                    "Não foi possível carregar os cursos";
            }


            if (
                gradeCursos
            ) {

                gradeCursos.innerHTML = `

                    <p class="mensagem-sem-resultados">

                        Não foi possível carregar os cursos agora.

                        Tente novamente em instantes.

                    </p>
                `;
            }


            if (
                mensagemSemCursos
            ) {

                mensagemSemCursos.hidden =
                    true;
            }
        }
    );
}