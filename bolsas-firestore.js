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


const campoPesquisa =
    document.getElementById(
        "pesquisa-bolsa"
    );

const filtroTipo =
    document.getElementById(
        "filtro-tipo-bolsa"
    );

const filtroNivel =
    document.getElementById(
        "filtro-nivel-bolsa"
    );

const botaoAplicarFiltros =
    document.getElementById(
        "btn-aplicar-filtros-bolsa"
    );

const campoOrdenacao =
    document.getElementById(
        "ordenar-bolsas"
    );

const contador =
    document.getElementById(
        "contador-bolsas"
    );

const grade =
    document.getElementById(
        "grade-bolsas"
    ) ||
    document.querySelector(
        ".grade-bolsas"
    );

const mensagemSemResultados =
    document.getElementById(
        "mensagem-sem-bolsas"
    );


let bolsas = [];

let bolsasCarregadas = false;

let idsFavoritos =
    new Set();


function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escaparHTML(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function obterUrlSegura(valor) {
    const texto =
        String(valor || "").trim();

    if (
        !texto ||
        texto === "#"
    ) {
        return "";
    }

    try {
        const url =
            new URL(
                texto,
                window.location.href
            );

        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {
            return url.href;
        }
    } catch (erro) {
        console.warn(
            "Link inválido em uma bolsa:",
            texto
        );
    }

    return "";
}


function atualizarContador(
    quantidade
) {
    if (contador) {
        contador.textContent =
            quantidade === 1
                ? "1 oportunidade encontrada"
                : `${quantidade} oportunidades encontradas`;
    }

    if (mensagemSemResultados) {
        mensagemSemResultados.hidden =
            quantidade !== 0;
    }
}


function bolsaPassaNosFiltros(
    bolsa
) {
    const pesquisa =
        normalizarTexto(
            campoPesquisa?.value.trim()
        );

    const tipoSelecionado =
        filtroTipo?.value || "";

    const nivelSelecionado =
        filtroNivel?.value || "";

    const informacoes =
        Array.isArray(
            bolsa.informacoes
        )
            ? bolsa.informacoes
            : [];

    const textoCompleto =
        normalizarTexto(
            [
                bolsa.nome,
                bolsa.titulo,
                bolsa.tipoTexto,
                bolsa.instituicao,
                bolsa.descricao,
                bolsa.prazoTexto,
                ...informacoes
            ].join(" ")
        );

    const correspondePesquisa =
        pesquisa === "" ||
        textoCompleto.includes(
            pesquisa
        );

    const correspondeTipo =
        tipoSelecionado === "" ||
        bolsa.tipo ===
            tipoSelecionado;

    const correspondeNivel =
        nivelSelecionado === "" ||
        bolsa.nivel ===
            nivelSelecionado;

    return (
        correspondePesquisa &&
        correspondeTipo &&
        correspondeNivel
    );
}


function ordenarLista(lista) {
    const criterio =
        campoOrdenacao?.value ||
        "relevancia";

    return [...lista].sort(
        function (bolsaA, bolsaB) {
            if (criterio === "nome") {
                return String(
                    bolsaA.nome ||
                    bolsaA.titulo ||
                    ""
                ).localeCompare(
                    String(
                        bolsaB.nome ||
                        bolsaB.titulo ||
                        ""
                    ),
                    "pt-BR"
                );
            }

            if (criterio === "prazo") {
                return (
                    Number(
                        bolsaA.prazoOrdem ||
                        99999999
                    ) -
                    Number(
                        bolsaB.prazoOrdem ||
                        99999999
                    )
                );
            }

            return (
                Number(
                    bolsaA.ordem ||
                    9999
                ) -
                Number(
                    bolsaB.ordem ||
                    9999
                )
            );
        }
    );
}


function criarHTMLCard(bolsa) {
    const id =
        String(bolsa.id || "");

    const estaFavorita =
        idsFavoritos.has(id);

    const informacoes =
        Array.isArray(
            bolsa.informacoes
        )
            ? bolsa.informacoes
            : [];

    const url =
        obterUrlSegura(
            bolsa.url
        );

    const textoLink =
        bolsa.textoLink ||
        "Ver detalhes →";

    const link = url
        ? `
            <a
                href="${escaparHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="link-bolsa"
            >
                ${escaparHTML(textoLink)}
            </a>
        `
        : `
            <span
                class="link-bolsa link-bolsa-indisponivel"
                aria-disabled="true"
            >
                ${escaparHTML(textoLink)}
            </span>
        `;

    return `
        <article
            class="card-bolsa"
            data-id="${escaparHTML(id)}"
            data-nome="${escaparHTML(
                bolsa.nome ||
                bolsa.titulo ||
                "Bolsa"
            )}"
            data-tipo="${escaparHTML(
                bolsa.tipo
            )}"
            data-nivel="${escaparHTML(
                bolsa.nivel
            )}"
            data-prazo="${escaparHTML(
                bolsa.prazoOrdem
            )}"
        >

            <div class="cabecalho-card-bolsa">

                <div class="simbolo-bolsa">
                    ${escaparHTML(
                        bolsa.simbolo ||
                        "🎓"
                    )}
                </div>

                <button
                    class="btn-favorito-bolsa ${
                        estaFavorita
                            ? "favoritado"
                            : ""
                    }"
                    type="button"
                    data-id-bolsa="${escaparHTML(id)}"
                    aria-label="${
                        estaFavorita
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                    }"
                    title="${
                        estaFavorita
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                    }"
                >
                    ${estaFavorita ? "♥" : "♡"}
                </button>

            </div>

            <span class="tipo-bolsa">
                ${escaparHTML(
                    bolsa.tipoTexto ||
                    bolsa.tipo ||
                    "Bolsa"
                )}
            </span>

            <h3>
                ${escaparHTML(
                    bolsa.titulo ||
                    bolsa.nome ||
                    "Bolsa"
                )}
            </h3>

            <p class="instituicao-bolsa">
                🏫 ${escaparHTML(
                    bolsa.instituicao
                )}
            </p>

            <p>
                ${escaparHTML(
                    bolsa.descricao
                )}
            </p>

            <div class="informacoes-bolsa">

                ${informacoes.map(
                    function (
                        informacao
                    ) {
                        return `
                            <span>
                                ${escaparHTML(
                                    informacao
                                )}
                            </span>
                        `;
                    }
                ).join("")}

            </div>

            <div class="prazo-bolsa">
                ${escaparHTML(
                    bolsa.prazoTexto
                )}
            </div>

            ${link}

        </article>
    `;
}


function renderizarBolsas() {
    if (
        !grade ||
        !bolsasCarregadas
    ) {
        return;
    }

    const bolsasVisiveis =
        ordenarLista(
            bolsas.filter(
                bolsaPassaNosFiltros
            )
        );

    grade.innerHTML =
        bolsasVisiveis
            .map(criarHTMLCard)
            .join("");

    atualizarContador(
        bolsasVisiveis.length
    );
}


function obterDadosFavorito(
    bolsa
) {
    const titulo =
        bolsa.nome ||
        bolsa.titulo ||
        "Bolsa";

    return {
        tipo: "bolsa",

        itemId:
            String(bolsa.id),

        titulo,

        subtitulo:
            [
                bolsa.tipoTexto,
                bolsa.instituicao
            ]
                .filter(Boolean)
                .join(" • "),

        descricao:
            String(
                bolsa.descricao ||
                ""
            ),

        imagem: "",

        url:
            obterUrlSegura(
                bolsa.url
            ),

        paginaOrigem:
            "bolsas.html"
    };
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

    window.location.assign(
        urlLogin.href
    );
}


campoPesquisa?.addEventListener(
    "input",
    renderizarBolsas
);


campoPesquisa?.addEventListener(
    "keydown",

    function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();

            renderizarBolsas();
        }
    }
);


filtroTipo?.addEventListener(
    "change",
    renderizarBolsas
);


filtroNivel?.addEventListener(
    "change",
    renderizarBolsas
);


botaoAplicarFiltros?.addEventListener(
    "click",
    renderizarBolsas
);


campoOrdenacao?.addEventListener(
    "change",
    renderizarBolsas
);


grade?.addEventListener(
    "click",

    async function (evento) {
        const botao =
            evento.target.closest(
                ".btn-favorito-bolsa"
            );

        if (
            !botao ||
            !grade.contains(botao)
        ) {
            return;
        }

        evento.preventDefault();
        evento.stopPropagation();

        const idBolsa =
            String(
                botao.dataset.idBolsa ||
                ""
            );

        const bolsa =
            bolsas.find(
                function (item) {
                    return (
                        String(item.id) ===
                        idBolsa
                    );
                }
            );

        if (
            !bolsa ||
            botao.disabled
        ) {
            return;
        }

        botao.disabled = true;

        try {
            const estaFavorita =
                await alternarFavorito(
                    obterDadosFavorito(
                        bolsa
                    )
                );

            if (estaFavorita) {
                idsFavoritos.add(
                    idBolsa
                );
            } else {
                idsFavoritos.delete(
                    idBolsa
                );
            }

            renderizarBolsas();

        } catch (erro) {
            if (
                erro?.code ===
                "favoritos/usuario-nao-autenticado"
            ) {
                redirecionarParaLogin();
                return;
            }

            console.error(
                "Erro ao alterar bolsa favorita:",
                erro
            );

            botao.disabled = false;
        }
    }
);


observarFavoritos(
    "bolsa",

    function (favoritos) {
        idsFavoritos =
            new Set(
                favoritos.map(
                    function (
                        favorito
                    ) {
                        return String(
                            favorito.itemId ||
                            ""
                        );
                    }
                )
            );

        renderizarBolsas();
    },

    function (erro) {
        console.error(
            "Erro ao carregar bolsas favoritas:",
            erro
        );
    }
);


onSnapshot(
    collection(
        db,
        "bolsasEstudo"
    ),

    function (snapshot) {
        bolsas =
            snapshot.docs.map(
                function (
                    documento
                ) {
                    return {
                        ...documento.data(),
                        id:
                            documento.id
                    };
                }
            );

        bolsasCarregadas = true;

        renderizarBolsas();

        console.info(
            "Bolsas sincronizadas com Firestore:",
            bolsas.length
        );
    },

    function (erro) {
        console.error(
            "Erro ao carregar bolsas:",
            erro
        );

        bolsasCarregadas = true;

        if (grade) {
            grade.innerHTML = `
                <p class="estado-erro-bolsas">
                    Não foi possível carregar as bolsas agora.
                </p>
            `;
        }

        atualizarContador(0);
    }
);