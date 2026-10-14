"use strict";

import {
    auth
} from "./firebase-config.js";

import {
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const paginaLogin =
    document.querySelector(".pagina-login");

if (paginaLogin) {

    /* ==================================================
       ELEMENTOS
    ================================================== */

    const conteudoAutenticacao =
        document.getElementById(
            "conteudo-autenticacao"
        );

    const painelUsuarioConectado =
        document.getElementById(
            "painel-usuario-conectado"
        );

    const abasAutenticacao =
        document.querySelector(
            ".abas-autenticacao"
        );

    const botoesAbas =
        Array.from(
            document.querySelectorAll(
                "[data-aba-auth]"
            )
        );

    const painelEntrar =
        document.getElementById(
            "painel-entrar"
        );

    const painelCadastrar =
        document.getElementById(
            "painel-cadastrar"
        );

    const painelRecuperacao =
        document.getElementById(
            "painel-recuperar-senha"
        );

    const opcoesLoginSocial =
        document.getElementById(
            "opcoes-login-social"
        );

    const mensagemAutenticacao =
        document.getElementById(
            "mensagem-autenticacao"
        );

    const formEntrar =
        document.getElementById(
            "form-entrar"
        );

    const formCadastrar =
        document.getElementById(
            "form-cadastrar"
        );

    const formRecuperarSenha =
        document.getElementById(
            "form-recuperar-senha"
        );

    const emailEntrar =
        document.getElementById(
            "email-entrar"
        );

    const senhaEntrar =
        document.getElementById(
            "senha-entrar"
        );

    const manterConectado =
        document.getElementById(
            "manter-conectado"
        );

    const nomeCadastrar =
        document.getElementById(
            "nome-cadastrar"
        );

    const emailCadastrar =
        document.getElementById(
            "email-cadastrar"
        );

    const senhaCadastrar =
        document.getElementById(
            "senha-cadastrar"
        );

    const confirmarSenhaCadastrar =
        document.getElementById(
            "confirmar-senha-cadastrar"
        );

    const emailRecuperacao =
        document.getElementById(
            "email-recuperacao"
        );

    const botaoEntrarConta =
        document.getElementById(
            "btn-entrar-conta"
        );

    const botaoCriarConta =
        document.getElementById(
            "btn-criar-conta"
        );

    const botaoGoogle =
        document.getElementById(
            "btn-entrar-google"
        );

    const botaoEsqueciSenha =
        document.getElementById(
            "btn-esqueci-senha"
        );

    const botaoVoltarLogin =
        document.getElementById(
            "btn-voltar-login"
        );

    const botaoEnviarRecuperacao =
        document.getElementById(
            "btn-enviar-recuperacao"
        );

    const botaoSair =
        document.getElementById(
            "btn-sair-conta"
        );

    const nomeUsuario =
        document.getElementById(
            "nome-usuario-auth"
        );

    const emailUsuario =
        document.getElementById(
            "email-usuario-auth"
        );

    const avatarUsuario =
        document.getElementById(
            "avatar-usuario-auth"
        );

    const botaoContinuar =
        painelUsuarioConectado.querySelector(
            ".btn-principal-auth"
        );


    /* ==================================================
       MENSAGENS
    ================================================== */

    function exibirMensagem(texto, tipo) {
        mensagemAutenticacao.textContent =
            texto;

        mensagemAutenticacao.className =
            `mensagem-autenticacao ${tipo}`;

        mensagemAutenticacao.hidden = false;
    }

    function limparMensagem() {
        mensagemAutenticacao.textContent = "";

        mensagemAutenticacao.className =
            "mensagem-autenticacao";

        mensagemAutenticacao.hidden = true;
    }


    /* ==================================================
       TRADUÇÃO DOS ERROS
    ================================================== */

    function traduzirErroFirebase(erro) {
        const mensagens = {
            "auth/invalid-email":
                "Digite um endereço de e-mail válido.",

            "auth/invalid-credential":
                "E-mail ou senha incorretos.",

            "auth/user-not-found":
                "E-mail ou senha incorretos.",

            "auth/wrong-password":
                "E-mail ou senha incorretos.",

            "auth/email-already-in-use":
                "Já existe uma conta cadastrada com este e-mail.",

            "auth/weak-password":
                "A senha escolhida é muito fraca.",

            "auth/missing-password":
                "Digite sua senha.",

            "auth/too-many-requests":
                "Muitas tentativas foram realizadas. Aguarde alguns minutos.",

            "auth/network-request-failed":
                "Não foi possível acessar a internet. Verifique sua conexão.",

            "auth/popup-closed-by-user":
                "O login com Google foi cancelado.",

            "auth/popup-blocked":
                "O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.",

            "auth/unauthorized-domain":
                "Este endereço ainda não está autorizado no Firebase.",

            "auth/account-exists-with-different-credential":
                "Já existe uma conta com este e-mail usando outro método de acesso.",

            "auth/operation-not-allowed":
                "Este método de login ainda não está habilitado no Firebase.",

            "auth/internal-error":
                "O Firebase encontrou um erro interno. Tente novamente."
        };

        return mensagens[erro?.code] ||
            "Não foi possível concluir a operação. Tente novamente.";
    }


    /* ==================================================
       CARREGAMENTO DOS BOTÕES
    ================================================== */

    function definirCarregamento(
        botao,
        carregando,
        textoCarregando
    ) {
        if (!botao) {
            return;
        }

        const rotulo =
            botao.querySelector(
                "span:last-child"
            );

        if (
            rotulo &&
            !botao.dataset.rotuloOriginal
        ) {
            botao.dataset.rotuloOriginal =
                rotulo.textContent.trim();
        }

        botao.disabled = carregando;

        botao.classList.toggle(
            "carregando",
            carregando
        );

        if (!rotulo) {
            return;
        }

        rotulo.textContent =
            carregando
                ? textoCarregando
                : botao.dataset.rotuloOriginal;
    }


    /* ==================================================
       TROCA DE PAINÉIS
    ================================================== */

    function abrirPainel(tipo) {
        limparMensagem();

        painelEntrar.hidden =
            tipo !== "entrar";

        painelCadastrar.hidden =
            tipo !== "cadastrar";

        painelRecuperacao.hidden =
            tipo !== "recuperacao";

        abasAutenticacao.hidden =
            tipo === "recuperacao";

        opcoesLoginSocial.hidden =
            tipo === "recuperacao";

        botoesAbas.forEach(
            function (botao) {
                const estaAtivo =
                    botao.dataset.abaAuth ===
                    tipo;

                botao.classList.toggle(
                    "ativo",
                    estaAtivo
                );

                botao.setAttribute(
                    "aria-selected",
                    String(estaAtivo)
                );
            }
        );

        const camposFoco = {
            entrar: emailEntrar,
            cadastrar: nomeCadastrar,
            recuperacao: emailRecuperacao
        };

        window.setTimeout(
            function () {
                camposFoco[tipo]?.focus();
            },
            80
        );
    }

    botoesAbas.forEach(
        function (botao, indice) {
            botao.addEventListener(
                "click",
                function () {
                    abrirPainel(
                        botao.dataset.abaAuth
                    );
                }
            );

            botao.addEventListener(
                "keydown",
                function (evento) {
                    if (
                        evento.key !== "ArrowLeft" &&
                        evento.key !== "ArrowRight"
                    ) {
                        return;
                    }

                    evento.preventDefault();

                    const direcao =
                        evento.key === "ArrowRight"
                            ? 1
                            : -1;

                    const novoIndice =
                        (
                            indice +
                            direcao +
                            botoesAbas.length
                        ) %
                        botoesAbas.length;

                    const novaAba =
                        botoesAbas[novoIndice];

                    novaAba.focus();

                    abrirPainel(
                        novaAba.dataset.abaAuth
                    );
                }
            );
        }
    );


    /* ==================================================
       MOSTRAR E OCULTAR SENHA
    ================================================== */

    const botoesMostrarSenha =
        document.querySelectorAll(
            "[data-campo-senha]"
        );

    botoesMostrarSenha.forEach(
        function (botao) {
            botao.addEventListener(
                "click",
                function () {
                    const campo =
                        document.getElementById(
                            botao.dataset.campoSenha
                        );

                    if (!campo) {
                        return;
                    }

                    const senhaVisivel =
                        campo.type === "text";

                    campo.type =
                        senhaVisivel
                            ? "password"
                            : "text";

                    botao.textContent =
                        senhaVisivel
                            ? "Mostrar"
                            : "Ocultar";

                    botao.setAttribute(
                        "aria-label",
                        senhaVisivel
                            ? "Mostrar senha"
                            : "Ocultar senha"
                    );
                }
            );
        }
    );


    /* ==================================================
       ENTRAR COM E-MAIL E SENHA
    ================================================== */

    formEntrar.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            limparMensagem();

            const email =
                emailEntrar.value.trim();

            const senha =
                senhaEntrar.value;

            definirCarregamento(
                botaoEntrarConta,
                true,
                "Entrando..."
            );

            try {
                const persistencia =
                    manterConectado.checked
                        ? browserLocalPersistence
                        : browserSessionPersistence;

                await setPersistence(
                    auth,
                    persistencia
                );

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    senha
                );
            } catch (erro) {
                console.error(
                    "Erro ao entrar:",
                    erro
                );

                exibirMensagem(
                    traduzirErroFirebase(erro),
                    "erro"
                );
            } finally {
                definirCarregamento(
                    botaoEntrarConta,
                    false,
                    ""
                );
            }
        }
    );


    /* ==================================================
       CRIAR CONTA
    ================================================== */

    formCadastrar.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            limparMensagem();

            const nome =
                nomeCadastrar.value
                    .trim()
                    .replace(/\s+/g, " ");

            const email =
                emailCadastrar.value.trim();

            const senha =
                senhaCadastrar.value;

            const confirmarSenha =
                confirmarSenhaCadastrar.value;

            if (nome.length < 2) {
                exibirMensagem(
                    "Digite um nome válido.",
                    "erro"
                );

                nomeCadastrar.focus();
                return;
            }

            if (senha.length < 8) {
                exibirMensagem(
                    "A senha precisa ter pelo menos 8 caracteres.",
                    "erro"
                );

                senhaCadastrar.focus();
                return;
            }

            if (senha !== confirmarSenha) {
                exibirMensagem(
                    "As duas senhas não são iguais.",
                    "erro"
                );

                confirmarSenhaCadastrar.focus();
                return;
            }

            definirCarregamento(
                botaoCriarConta,
                true,
                "Criando conta..."
            );

            try {
                await setPersistence(
                    auth,
                    browserLocalPersistence
                );

                const credencial =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        senha
                    );

                await updateProfile(
                    credencial.user,
                    {
                        displayName: nome
                    }
                );

                mostrarUsuarioConectado(
                    credencial.user
                );

                formCadastrar.reset();
            } catch (erro) {
                console.error(
                    "Erro ao criar conta:",
                    erro
                );

                exibirMensagem(
                    traduzirErroFirebase(erro),
                    "erro"
                );
            } finally {
                definirCarregamento(
                    botaoCriarConta,
                    false,
                    ""
                );
            }
        }
    );


    /* ==================================================
       LOGIN COM GOOGLE
    ================================================== */

    const provedorGoogle =
        new GoogleAuthProvider();

    provedorGoogle.setCustomParameters({
        prompt: "select_account"
    });

    botaoGoogle.addEventListener(
        "click",
        async function () {
            limparMensagem();

            definirCarregamento(
                botaoGoogle,
                true,
                "Conectando..."
            );

            try {
                await setPersistence(
                    auth,
                    browserLocalPersistence
                );

                await signInWithPopup(
                    auth,
                    provedorGoogle
                );
            } catch (erro) {
                console.error(
                    "Erro no login com Google:",
                    erro
                );

                exibirMensagem(
                    traduzirErroFirebase(erro),
                    "erro"
                );
            } finally {
                definirCarregamento(
                    botaoGoogle,
                    false,
                    ""
                );
            }
        }
    );


    /* ==================================================
       RECUPERAÇÃO DE SENHA
    ================================================== */

    botaoEsqueciSenha.addEventListener(
        "click",
        function () {
            emailRecuperacao.value =
                emailEntrar.value.trim();

            abrirPainel("recuperacao");
        }
    );

    botaoVoltarLogin.addEventListener(
        "click",
        function () {
            abrirPainel("entrar");
        }
    );

    formRecuperarSenha.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            limparMensagem();

            const email =
                emailRecuperacao.value.trim();

            definirCarregamento(
                botaoEnviarRecuperacao,
                true,
                "Enviando..."
            );

            try {
                await sendPasswordResetEmail(
                    auth,
                    email
                );

                exibirMensagem(
                    "Se existir uma conta com esse e-mail, as instruções de recuperação serão enviadas.",
                    "sucesso"
                );
            } catch (erro) {
                console.error(
                    "Erro ao recuperar senha:",
                    erro
                );

                if (
                    erro.code ===
                    "auth/user-not-found"
                ) {
                    exibirMensagem(
                        "Se existir uma conta com esse e-mail, as instruções de recuperação serão enviadas.",
                        "sucesso"
                    );
                } else {
                    exibirMensagem(
                        traduzirErroFirebase(erro),
                        "erro"
                    );
                }
            } finally {
                definirCarregamento(
                    botaoEnviarRecuperacao,
                    false,
                    ""
                );
            }
        }
    );


    /* ==================================================
       DESTINO APÓS O LOGIN
    ================================================== */

    function obterDestinoDepoisDoLogin() {
        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const destinoRecebido =
            parametros.get("voltar");

        if (!destinoRecebido) {
            return "../index.html";
        }

        try {
            const destino =
                new URL(
                    destinoRecebido,
                    window.location.href
                );

            if (
                destino.origin ===
                window.location.origin
            ) {
                return destino.href;
            }
        } catch (erro) {
            console.warn(
                "Destino de retorno inválido."
            );
        }

        return "../index.html";
    }


    /* ==================================================
       USUÁRIO CONECTADO
    ================================================== */

    function mostrarUsuarioConectado(usuario) {
        conteudoAutenticacao.hidden = true;

        painelUsuarioConectado.hidden = false;

        const nome =
            usuario.displayName ||
            usuario.email?.split("@")[0] ||
            "Usuário";

        nomeUsuario.textContent = nome;

        emailUsuario.textContent =
            usuario.email || "Conta Google";

        avatarUsuario.textContent =
            nome.charAt(0).toUpperCase();

        botaoContinuar.href =
            obterDestinoDepoisDoLogin();
    }

    function mostrarFormularioAutenticacao() {
        painelUsuarioConectado.hidden = true;

        conteudoAutenticacao.hidden = false;
    }


    /* ==================================================
       SAIR
    ================================================== */

    botaoSair.addEventListener(
        "click",
        async function () {
            botaoSair.disabled = true;
            botaoSair.textContent =
                "Saindo...";

            try {
                await signOut(auth);

                mostrarFormularioAutenticacao();
                abrirPainel("entrar");

                exibirMensagem(
                    "Você saiu da sua conta.",
                    "sucesso"
                );
            } catch (erro) {
                console.error(
                    "Erro ao sair:",
                    erro
                );

                exibirMensagem(
                    "Não foi possível sair da conta.",
                    "erro"
                );
            } finally {
                botaoSair.disabled = false;
                botaoSair.textContent =
                    "Sair da conta";
            }
        }
    );


    /* ==================================================
       OBSERVADOR DA SESSÃO
    ================================================== */

    onAuthStateChanged(
        auth,
        function (usuario) {
            if (usuario) {
                mostrarUsuarioConectado(
                    usuario
                );
            } else {
                mostrarFormularioAutenticacao();
            }
        },
        function (erro) {
            console.error(
                "Erro ao verificar sessão:",
                erro
            );

            mostrarFormularioAutenticacao();

            exibirMensagem(
                "Não foi possível verificar sua sessão.",
                "erro"
            );
        }
    );

}