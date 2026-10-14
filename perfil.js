"use strict";

import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const formPerfil =
    document.querySelector(
        "#form-perfil"
    );

const campoNome =
    document.querySelector(
        "#nome-exibicao-perfil"
    );

const campoEmail =
    document.querySelector(
        "#email-perfil"
    );

const nomeResumo =
    document.querySelector(
        "#titulo-resumo-perfil"
    );

const emailResumo =
    document.querySelector(
        "#email-resumo-perfil"
    );

const avatarPerfil =
    document.querySelector(
        "#avatar-perfil"
    );

const nomeProvedor =
    document.querySelector(
        "#nome-provedor-perfil"
    );

const iconeProvedor =
    document.querySelector(
        ".icone-provedor-perfil"
    );

const mensagemPerfil =
    document.querySelector(
        "#mensagem-perfil"
    );

const botaoSalvar =
    document.querySelector(
        "#btn-salvar-perfil"
    );

const botaoCancelar =
    document.querySelector(
        "#btn-cancelar-perfil"
    );


let usuarioAtual = null;
let nomeSalvo = "";
let salvandoPerfil = false;


/* ==================================================
   TRATAMENTO DO NOME
================================================== */

function normalizarNome(nome) {
    return nome
        .trim()
        .replace(/\s+/g, " ");
}


function obterNomeUsuario(usuario) {
    return normalizarNome(
        usuario.displayName ||
        usuario.email?.split("@")[0] ||
        "Usuário"
    );
}


function obterPrimeiroNome(nome) {
    return (
        nome.split(/\s+/)[0] ||
        "Usuário"
    );
}


function obterIniciais(nome) {
    const partes =
        normalizarNome(nome)
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


/* ==================================================
   MENSAGENS
================================================== */

function mostrarMensagem(
    tipo,
    texto
) {
    mensagemPerfil.className =
        `mensagem-perfil ${tipo}`;

    mensagemPerfil.textContent =
        texto;

    mensagemPerfil.hidden =
        false;
}


function esconderMensagem() {
    mensagemPerfil.hidden =
        true;

    mensagemPerfil.textContent =
        "";

    mensagemPerfil.className =
        "mensagem-perfil";
}


/* ==================================================
   ESTADO DO FORMULÁRIO
================================================== */

function nomeValido(nome) {
    return (
        nome.length >= 2 &&
        nome.length <= 60
    );
}


function atualizarEstadoBotoes() {
    const nomeDigitado =
        normalizarNome(
            campoNome.value
        );

    const alterado =
        nomeDigitado !== nomeSalvo;

    const podeSalvar = (
        usuarioAtual &&
        alterado &&
        nomeValido(nomeDigitado) &&
        !salvandoPerfil
    );

    botaoSalvar.disabled =
        !podeSalvar;

    botaoCancelar.disabled =
        !alterado ||
        salvandoPerfil;
}


/* ==================================================
   AVATAR
================================================== */

function mostrarIniciaisNoAvatar(nome) {
    avatarPerfil.replaceChildren();

    avatarPerfil.textContent =
        obterIniciais(nome);
}


function mostrarAvatar(
    usuario,
    nome
) {
    if (!usuario.photoURL) {
        mostrarIniciaisNoAvatar(nome);
        return;
    }

    const imagem =
        document.createElement("img");

    imagem.src =
        usuario.photoURL;

    imagem.alt = "";

    imagem.referrerPolicy =
        "no-referrer";

    imagem.addEventListener(
        "error",
        function () {
            mostrarIniciaisNoAvatar(nome);
        },
        {
            once: true
        }
    );

    avatarPerfil.replaceChildren(
        imagem
    );
}


/* ==================================================
   MÉTODO DE LOGIN
================================================== */

function mostrarProvedor(usuario) {
    const provedores =
        usuario.providerData.map(
            function (provedor) {
                return provedor.providerId;
            }
        );

    if (
        provedores.includes(
            "google.com"
        )
    ) {
        nomeProvedor.textContent =
            "Google";

        iconeProvedor.textContent =
            "G";

        return;
    }

    if (
        provedores.includes(
            "password"
        )
    ) {
        nomeProvedor.textContent =
            "E-mail e senha";

        iconeProvedor.textContent =
            "@";

        return;
    }

    nomeProvedor.textContent =
        "Conta Firebase";

    iconeProvedor.textContent =
        "✓";
}


/* ==================================================
   ATUALIZAÇÃO DO CABEÇALHO
================================================== */

function atualizarCabecalho(
    nomeCompleto,
    usuario
) {
    const primeiroNome =
        obterPrimeiroNome(
            nomeCompleto
        );

    document
        .querySelectorAll(
            ".textos-login-usuario strong"
        )
        .forEach(
            function (elemento) {
                elemento.textContent =
                    primeiroNome;
            }
        );

    document
        .querySelectorAll(
            ".btn-login.usuario-conectado"
        )
        .forEach(
            function (botao) {
                botao.setAttribute(
                    "aria-label",
                    `Abrir menu da conta de ${nomeCompleto}`
                );

                botao.title =
                    `Conta de ${nomeCompleto}`;
            }
        );

    if (!usuario.photoURL) {
        document
            .querySelectorAll(
                ".avatar-login-usuario:not(img)"
            )
            .forEach(
                function (avatar) {
                    avatar.textContent =
                        obterIniciais(
                            nomeCompleto
                        );
                }
            );
    }
}


/* ==================================================
   PREENCHIMENTO DO PERFIL
================================================== */

function preencherPerfil(usuario) {
    const nome =
        obterNomeUsuario(usuario);

    const email =
        usuario.email ||
        "E-mail não informado";

    usuarioAtual = usuario;
    nomeSalvo = nome;

    campoNome.value = nome;
    campoNome.disabled = false;

    campoEmail.value = email;

    nomeResumo.textContent = nome;
    emailResumo.textContent = email;

    mostrarAvatar(
        usuario,
        nome
    );

    mostrarProvedor(usuario);
    atualizarEstadoBotoes();
}


/* ==================================================
   PROTEÇÃO DA PÁGINA
================================================== */

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

    window.location.replace(
        urlLogin.href
    );
}


/* ==================================================
   ALTERAÇÃO DO CAMPO
================================================== */

campoNome.addEventListener(
    "input",
    function () {
        esconderMensagem();
        atualizarEstadoBotoes();
    }
);


/* ==================================================
   DESCARTAR ALTERAÇÕES
================================================== */

botaoCancelar.addEventListener(
    "click",
    function () {
        campoNome.value =
            nomeSalvo;

        esconderMensagem();
        atualizarEstadoBotoes();

        campoNome.focus();
    }
);


/* ==================================================
   SALVAR PERFIL
================================================== */

formPerfil.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        if (
            !usuarioAtual ||
            salvandoPerfil
        ) {
            return;
        }

        const novoNome =
            normalizarNome(
                campoNome.value
            );

        if (!nomeValido(novoNome)) {
            mostrarMensagem(
                "erro",
                "Digite um nome entre 2 e 60 caracteres."
            );

            campoNome.focus();
            return;
        }

        if (novoNome === nomeSalvo) {
            return;
        }

        salvandoPerfil = true;

        campoNome.disabled = true;
        botaoSalvar.disabled = true;
        botaoCancelar.disabled = true;

        const textoBotao =
            botaoSalvar.querySelector(
                "span"
            );

        textoBotao.textContent =
            "Salvando...";

        try {
            await updateProfile(
                usuarioAtual,
                {
                    displayName: novoNome
                }
            );

            nomeSalvo = novoNome;
            campoNome.value = novoNome;
            nomeResumo.textContent = novoNome;

            if (!usuarioAtual.photoURL) {
                mostrarIniciaisNoAvatar(
                    novoNome
                );
            }

            atualizarCabecalho(
                novoNome,
                usuarioAtual
            );

            mostrarMensagem(
                "sucesso",
                "Nome atualizado com sucesso."
            );
        } catch (erro) {
            console.error(
                "Erro ao atualizar o perfil:",
                erro
            );

            mostrarMensagem(
                "erro",
                "Não foi possível salvar as alterações. Tente novamente."
            );
        } finally {
            salvandoPerfil = false;

            campoNome.disabled =
                false;

            textoBotao.textContent =
                "Salvar alterações";

            atualizarEstadoBotoes();
        }
    }
);


/* ==================================================
   AUTENTICAÇÃO
================================================== */

onAuthStateChanged(
    auth,

    function (usuario) {
        if (!usuario) {
            redirecionarParaLogin();
            return;
        }

        preencherPerfil(usuario);
    },

    function (erro) {
        console.error(
            "Erro ao carregar o perfil:",
            erro
        );

        mostrarMensagem(
            "erro",
            "Não foi possível carregar os dados da sua conta."
        );
    }
);