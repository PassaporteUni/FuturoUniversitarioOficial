"use strict";

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const botoesLogin = Array.from(
    document.querySelectorAll("a.btn-login")
);

const urlPaginaLogin = new URL(
    "./pages/login.html",
    import.meta.url
);

const urlPaginaPerfil = new URL(
    "./pages/perfil.html",
    import.meta.url
);

const urlPaginaNotificacoes = new URL(
    "./pages/notificacoes.html",
    import.meta.url
);

const urlPaginaFavoritos = new URL(
    "./pages/favoritos.html",
    import.meta.url
);
const urlPaginaAdmin = new URL(
    "./pages/admin.html",
    import.meta.url
);

const temporizadoresMenu = new WeakMap();

let contadorMenusConta = 0;


/* ==================================================
   DADOS DO USUÁRIO
================================================== */

function obterNomeUsuario(usuario) {
    return (
        usuario.displayName ||
        usuario.email?.split("@")[0] ||
        "Usuário"
    ).trim();
}


function obterPrimeiroNome(nome) {
    return (
        nome.split(/\s+/)[0] ||
        "Usuário"
    );
}


function obterIniciais(nome) {
    const partes = nome
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (partes.length === 0) {
        return "US";
    }

    if (partes.length === 1) {
        return partes[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        partes[0].charAt(0) +
        partes[partes.length - 1].charAt(0)
    ).toUpperCase();
}


function obterUrlLogin() {
    const url = new URL(
        urlPaginaLogin.href
    );

    const estaNoLogin =
        decodeURIComponent(
            window.location.pathname
        )
            .toLowerCase()
            .endsWith("/pages/login.html");

    if (!estaNoLogin) {
        url.searchParams.set(
            "voltar",
            window.location.href
        );
    }

    return url.href;
}

async function verificarAcessoAdministrador(
    usuario
) {
    if (!usuario) {
        return false;
    }

    try {
        const referenciaAdministrador =
            doc(
                db,
                "administradores",
                usuario.uid
            );

        const documentoAdministrador =
            await getDoc(
                referenciaAdministrador
            );

        return (
            documentoAdministrador.exists() &&
            documentoAdministrador.data()?.ativo === true
        );
    } catch (erro) {
        console.error(
            "Erro ao verificar acesso administrativo:",
            erro
        );

        return false;
    }
}


/* ==================================================
   AVATAR
================================================== */

function criarAvatarUsuario(
    usuario,
    nome
) {
    function criarIniciais() {
        const iniciais =
            document.createElement("span");

        iniciais.className =
            "avatar-login-usuario";

        iniciais.textContent =
            obterIniciais(nome);

        iniciais.setAttribute(
            "aria-hidden",
            "true"
        );

        return iniciais;
    }

    if (!usuario.photoURL) {
        return criarIniciais();
    }

    const imagem =
        document.createElement("img");

    imagem.className =
        "avatar-login-usuario";

    imagem.src =
        usuario.photoURL;

    imagem.alt = "";

    imagem.referrerPolicy =
        "no-referrer";

    imagem.addEventListener(
        "error",
        function () {
            imagem.replaceWith(
                criarIniciais()
            );
        },
        {
            once: true
        }
    );

    return imagem;
}


/* ==================================================
   ÍCONES
================================================== */

function criarSetaMenu() {
    const seta =
        document.createElement("span");

    seta.className =
        "seta-menu-conta";

    seta.setAttribute(
        "aria-hidden",
        "true"
    );

    seta.innerHTML = `
        <svg viewBox="0 0 24 24" focusable="false">
            <path d="M7 10l5 5 5-5"></path>
        </svg>
    `;

    return seta;
}


const iconesMenu = {
    favoritos: `
        <svg viewBox="0 0 24 24" focusable="false">
            <path
                d="M12 20.5s-7-4.4-7-10A4 4 0 0 1
                   12 7.8a4 4 0 0 1 7 2.7c0 5.6-7 10-7 10Z"
            ></path>
        </svg>
    `,

    perfil: `
        <svg viewBox="0 0 24 24" focusable="false">
            <circle cx="12" cy="8" r="3.5"></circle>
            <path d="M5.5 20a6.5 6.5 0 0 1 13 0"></path>
        </svg>
    `,

    notificacoes: `
        <svg viewBox="0 0 24 24" focusable="false">
            <path
                d="M6.5 17h11l-1.4-2.1V10
                   a4.1 4.1 0 0 0-8.2 0v4.9L6.5 17Z"
            ></path>
            <path d="M10 20h4"></path>
        </svg>
    `,
    admin: `
        <svg viewBox="0 0 24 24" focusable="false">
            <path
                d="M12 3 5.5 5.5v5.8
                   c0 4.1 2.7 7.8 6.5 9.7
                   3.8-1.9 6.5-5.6 6.5-9.7V5.5L12 3Z"
            ></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
    `,

    sair: `
        <svg viewBox="0 0 24 24" focusable="false">
            <path d="M10 5H5v14h5"></path>
            <path d="M14 8l4 4-4 4"></path>
            <path d="M18 12H9"></path>
        </svg>
    `
};


/* ==================================================
   ITENS DO MENU
================================================== */

function criarItemMenu(
    tipo,
    texto
) {
    const item =
        document.createElement("button");

    item.type = "button";

    item.className =
        "item-menu-conta";

    item.dataset.acaoConta =
        tipo;

    item.setAttribute(
        "role",
        "menuitem"
    );

    const icone =
        document.createElement("span");

    icone.className =
        "icone-item-menu-conta";

    icone.setAttribute(
        "aria-hidden",
        "true"
    );

    icone.innerHTML =
        iconesMenu[tipo];

    const rotulo =
        document.createElement("span");

    rotulo.className =
        "texto-item-menu-conta";

    rotulo.textContent =
        texto;

    item.append(
        icone,
        rotulo
    );

    return item;
}


/* ==================================================
   ABRIR E FECHAR MENU
================================================== */

function fecharMenuConta(
    container,
    devolverFoco = false
) {
    const botao =
        container.querySelector(
            ".btn-login.usuario-conectado"
        );

    const menu =
        container.querySelector(
            ".menu-conta-dropdown"
        );

    if (!botao || !menu) {
        return;
    }

    const estavaAberto =
        container.classList.contains(
            "menu-conta-aberto"
        );

    window.clearTimeout(
        temporizadoresMenu.get(container)
    );

    container.classList.remove(
        "menu-conta-aberto"
    );

    botao.setAttribute(
        "aria-expanded",
        "false"
    );

    menu.setAttribute(
        "aria-hidden",
        "true"
    );

    const temporizador =
        window.setTimeout(
            function () {
                if (
                    !container.classList.contains(
                        "menu-conta-aberto"
                    )
                ) {
                    menu.hidden = true;
                }
            },
            220
        );

    temporizadoresMenu.set(
        container,
        temporizador
    );

    if (
        devolverFoco &&
        estavaAberto
    ) {
        botao.focus();
    }
}


function fecharTodosMenus(
    excecao = null
) {
    document
        .querySelectorAll(
            ".menu-conta-cabecalho.menu-conta-aberto"
        )
        .forEach(
            function (container) {
                if (container !== excecao) {
                    fecharMenuConta(container);
                }
            }
        );
}


function abrirMenuConta(container) {
    const botao =
        container.querySelector(
            ".btn-login.usuario-conectado"
        );

    const menu =
        container.querySelector(
            ".menu-conta-dropdown"
        );

    if (!botao || !menu) {
        return;
    }

    fecharTodosMenus(container);

    window.clearTimeout(
        temporizadoresMenu.get(container)
    );

    menu.hidden = false;

    void menu.offsetWidth;

    container.classList.add(
        "menu-conta-aberto"
    );

    botao.setAttribute(
        "aria-expanded",
        "true"
    );

    menu.setAttribute(
        "aria-hidden",
        "false"
    );
}


function alternarMenuConta(container) {
    if (
        container.classList.contains(
            "menu-conta-aberto"
        )
    ) {
        fecharMenuConta(container);
    } else {
        abrirMenuConta(container);
    }
}


/* ==================================================
   EVENTOS DO BOTÃO
================================================== */

function configurarEventosBotao(botao) {
    if (
        botao.dataset.menuContaConfigurado ===
        "true"
    ) {
        return;
    }

    botao.dataset.menuContaConfigurado =
        "true";

    botao.addEventListener(
        "click",
        function (event) {
            if (
                !botao.classList.contains(
                    "usuario-conectado"
                )
            ) {
                return;
            }

            event.preventDefault();

            const container =
                botao.closest(
                    ".menu-conta-cabecalho"
                );

            if (container) {
                alternarMenuConta(container);
            }
        }
    );

    botao.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key !== "ArrowDown" ||
                !botao.classList.contains(
                    "usuario-conectado"
                )
            ) {
                return;
            }

            event.preventDefault();

            const container =
                botao.closest(
                    ".menu-conta-cabecalho"
                );

            if (!container) {
                return;
            }

            abrirMenuConta(container);

            container
                .querySelector(
                    ".item-menu-conta"
                )
                ?.focus();
        }
    );
}


/* ==================================================
   CRIAÇÃO DO DROPDOWN
================================================== */

function criarMenuConta(
    container,
    idMenu,
    ehAdministrador = false
) {
    const menu =
        document.createElement("div");

    menu.className =
        "menu-conta-dropdown";

    menu.id = idMenu;
    menu.hidden = true;

    menu.setAttribute(
        "role",
        "menu"
    );

    menu.setAttribute(
        "aria-label",
        "Opções da conta"
    );

    menu.setAttribute(
        "aria-hidden",
        "true"
    );


    const favoritos =
        criarItemMenu(
            "favoritos",
            "Favoritos"
        );

    const perfil =
        criarItemMenu(
            "perfil",
            "Perfil"
        );

    const notificacoes =
        criarItemMenu(
            "notificacoes",
            "Notificações"
        );

    const painelAdministrador =
        ehAdministrador
            ? criarItemMenu(
                "admin",
                "Painel administrativo"
            )
            : null;

    const separador =
        document.createElement("div");

    separador.className =
        "separador-menu-conta";

    separador.setAttribute(
        "role",
        "separator"
    );


    const sair =
        criarItemMenu(
            "sair",
            "Sair"
        );

    sair.classList.add(
        "item-menu-conta-sair"
    );


    favoritos.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            event.stopPropagation();

            fecharMenuConta(container);

            window.location.assign(
                urlPaginaFavoritos.href
            );
        }
    );


    perfil.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            event.stopPropagation();

            fecharMenuConta(container);

            window.location.assign(
                urlPaginaPerfil.href
            );
        }
    );


    notificacoes.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            event.stopPropagation();

            fecharMenuConta(container);

            window.location.assign(
                urlPaginaNotificacoes.href
            );
        }
    );


    if (painelAdministrador) {
        painelAdministrador.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();

                fecharMenuConta(container);

                window.location.assign(
                    urlPaginaAdmin.href
                );
            }
        );
    }


    sair.addEventListener(
        "click",
        async function () {
            sair.disabled = true;

            fecharMenuConta(container);

            try {
                await signOut(auth);
            } catch (erro) {
                sair.disabled = false;

                console.error(
                    "Erro ao sair da conta:",
                    erro
                );

                window.alert(
                    "Não foi possível sair da conta. Tente novamente."
                );
            }
        }
    );


    menu.append(
        favoritos,
        perfil,
        notificacoes
    );

    if (painelAdministrador) {
        menu.append(
            painelAdministrador
        );
    }

    menu.append(
        separador,
        sair
    );

    return menu;
}


/* ==================================================
   CONTAINER DO MENU
================================================== */

function garantirContainerConta(botao) {
    const existente =
        botao.closest(
            ".menu-conta-cabecalho"
        );

    if (existente) {
        return existente;
    }

    const container =
        document.createElement("div");

    container.className =
        "menu-conta-cabecalho";

    botao.before(container);
    container.append(botao);

    return container;
}


/* ==================================================
   USUÁRIO DESCONECTADO
================================================== */

function mostrarBotaoDesconectado(botao) {
    const container =
        botao.closest(
            ".menu-conta-cabecalho"
        );

    if (container) {
        window.clearTimeout(
            temporizadoresMenu.get(container)
        );

        container.replaceWith(botao);
    }

    botao.classList.remove(
        "usuario-conectado"
    );

    botao.href =
        obterUrlLogin();

    botao.textContent =
        "Entrar";

    botao.removeAttribute(
        "aria-haspopup"
    );

    botao.removeAttribute(
        "aria-expanded"
    );

    botao.removeAttribute(
        "aria-controls"
    );

    botao.removeAttribute(
        "title"
    );

    botao.setAttribute(
        "aria-label",
        "Entrar ou criar uma conta"
    );
}


/* ==================================================
   USUÁRIO CONECTADO
================================================== */

function mostrarBotaoConectado(
    botao,
    usuario,
    ehAdministrador
) {
    const nomeCompleto =
        obterNomeUsuario(usuario);

    const primeiroNome =
        obterPrimeiroNome(nomeCompleto);

    const avatar =
        criarAvatarUsuario(
            usuario,
            nomeCompleto
        );

    const textos =
        document.createElement("span");

    textos.className =
        "textos-login-usuario";

    const nome =
        document.createElement("strong");

    nome.textContent =
        primeiroNome;

    const tipoUsuario =
        document.createElement("small");

    tipoUsuario.textContent =
        "Estudante";

    textos.append(
        nome,
        tipoUsuario
    );

    botao.replaceChildren(
        avatar,
        textos,
        criarSetaMenu()
    );

    botao.classList.add(
        "usuario-conectado"
    );

    /*
       Mantemos o login como destino reserva.
       Se o JavaScript falhar, o usuário ainda
       consegue abrir a página da conta.
    */

    botao.href =
        obterUrlLogin();

    botao.setAttribute(
        "aria-haspopup",
        "menu"
    );

    botao.setAttribute(
        "aria-expanded",
        "false"
    );

    botao.setAttribute(
        "aria-label",
        `Abrir menu da conta de ${nomeCompleto}`
    );

    botao.title =
        `Conta de ${nomeCompleto}`;

    configurarEventosBotao(botao);

    const container =
        garantirContainerConta(botao);

    container
        .querySelector(
            ".menu-conta-dropdown"
        )
        ?.remove();

    contadorMenusConta += 1;

    const idMenu =
        `menu-conta-${contadorMenusConta}`;

    const menu =
        criarMenuConta(
            container,
            idMenu,
            ehAdministrador
        );

    botao.setAttribute(
        "aria-controls",
        idMenu
    );

    container.append(menu);
}


/* ==================================================
   FECHAMENTO GLOBAL
================================================== */

document.addEventListener(
    "click",
    function (event) {
        if (
            event.target.closest(
                ".menu-conta-cabecalho"
            )
        ) {
            return;
        }

        fecharTodosMenus();
    }
);


document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }

        const menuAberto =
            document.querySelector(
                ".menu-conta-cabecalho.menu-conta-aberto"
            );

        if (menuAberto) {
            fecharMenuConta(
                menuAberto,
                true
            );
        }
    }
);


/* ==================================================
   MONITORAMENTO DA AUTENTICAÇÃO
================================================== */

if (botoesLogin.length > 0) {
    onAuthStateChanged(
        auth,

        async function (usuario) {
            const ehAdministrador =
                await verificarAcessoAdministrador(
                    usuario
                );

            /*
                Evita mostrar dados antigos caso
                a conta seja trocada durante a consulta.
            */

            if (
                usuario &&
                auth.currentUser?.uid !== usuario.uid
            ) {
                return;
            }

            botoesLogin.forEach(
                function (botao) {
                    if (usuario) {
                        mostrarBotaoConectado(
                            botao,
                            usuario,
                            ehAdministrador
                        );
                    } else {
                        mostrarBotaoDesconectado(
                            botao
                        );
                    }
                }
            );

            document.documentElement
                .classList
                .add(
                    "autenticacao-carregada"
                );
        },

        function (erro) {
            console.error(
                "Erro ao atualizar o cabeçalho:",
                erro
            );

            botoesLogin.forEach(
                mostrarBotaoDesconectado
            );
        }
    );
}

/* ==================================================
   LINK DA CONTA NO RODAPÉ
================================================== */

const linksContaRodape =
    Array.from(
        document.querySelectorAll(
            ".rodape-site a"
        )
    ).filter(
        function (link) {
            return (
                link.textContent
                    .trim()
                    .toLowerCase() ===
                "entrar"
            );
        }
    );


if (linksContaRodape.length > 0) {
    onAuthStateChanged(
        auth,

        function (usuario) {
            linksContaRodape.forEach(
                function (link) {
                    link.href =
                        obterUrlLogin();

                    if (usuario) {
                        const nome =
                            obterNomeUsuario(
                                usuario
                            );

                        link.textContent =
                            "Minha conta";

                        link.setAttribute(
                            "aria-label",
                            `Abrir a conta de ${nome}`
                        );
                    } else {
                        link.textContent =
                            "Entrar";

                        link.setAttribute(
                            "aria-label",
                            "Entrar ou criar uma conta"
                        );
                    }
                }
            );
        },

        function (erro) {
            console.error(
                "Erro ao atualizar o link do rodapé:",
                erro
            );
        }
    );
}