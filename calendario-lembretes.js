"use strict";

import { auth } from "./firebase-config.js";
import {
    alternarLembrete,
    observarLembretes
} from "./lembretes-firestore.js";


const botaoLembreteEvento =
    document.getElementById(
        "btn-lembrete-evento"
    );

const textoBotaoLembrete =
    botaoLembreteEvento?.querySelector(
        ".texto-btn-lembrete-evento"
    );

const iconeBotaoLembrete =
    botaoLembreteEvento?.querySelector(
        ".icone-btn-lembrete-evento"
    );

const ajudaLembreteEvento =
    document.getElementById(
        "ajuda-lembrete-evento"
    );

const urlPaginaLogin =
    new URL(
        "./pages/login.html",
        import.meta.url
    );

const urlAppsScriptAgenda =
    "https://script.google.com/macros/s/AKfycbxm5w1LZXFCn6UZ5jfyVgvYLQiqa-uB8d7d2et9jOXd54drKC7UGePDCzl06tNOqv7LkA/exec";


async function enviarAcaoParaAgendaGoogle(eventoId) {
    const usuario = auth.currentUser;

    if (!usuario) {
        throw new Error("Faça login para sincronizar com a Agenda Google.");
    }

    const idToken = await usuario.getIdToken();

    await fetch(urlAppsScriptAgenda, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify({
            idToken: idToken,
            eventoId: String(eventoId)
        })
    });
}


if (
    botaoLembreteEvento &&
    textoBotaoLembrete &&
    iconeBotaoLembrete
) {
    let eventoAberto = null;

    let idsLembretesAtivos =
        new Set();


    ajudaLembreteEvento?.setAttribute(
        "aria-live",
        "polite"
    );


    function lembreteEstaAtivo() {
        return Boolean(
            eventoAberto &&
            idsLembretesAtivos.has(
                String(eventoAberto.id)
            )
        );
    }


    function atualizarBotaoLembrete() {
        if (!eventoAberto) {
            return;
        }

        const estaAtivo =
            lembreteEstaAtivo();

        botaoLembreteEvento.classList.toggle(
            "lembrete-ativo",
            estaAtivo
        );

        botaoLembreteEvento.setAttribute(
            "aria-pressed",
            String(estaAtivo)
        );

        botaoLembreteEvento.setAttribute(
            "aria-label",
            estaAtivo
                ? `Desativar lembrete de ${eventoAberto.titulo}`
                : `Receber lembrete de ${eventoAberto.titulo}`
        );

        textoBotaoLembrete.textContent =
            estaAtivo
                ? "Lembrete ativado"
                : "Receber lembrete";

        iconeBotaoLembrete.textContent =
            estaAtivo
                ? "✓"
                : "🔔";

        if (ajudaLembreteEvento) {
            ajudaLembreteEvento.textContent =
                estaAtivo
                    ? "Você receberá este aviso na sua área de notificações. Clique novamente para desativar."
                    : "Este evento aparecerá na sua área de notificações.";
        }
    }


    function redirecionarParaLogin() {
        const url =
            new URL(
                urlPaginaLogin.href
            );

        url.searchParams.set(
            "voltar",
            window.location.href
        );

        window.location.href =
            url.href;
    }


    window.addEventListener(
        "calendario:evento-aberto",

        function (eventoPersonalizado) {
            eventoAberto =
                eventoPersonalizado.detail;

            atualizarBotaoLembrete();
        }
    );


    botaoLembreteEvento.addEventListener(
        "click",

        async function () {
            if (
                !eventoAberto ||
                botaoLembreteEvento.disabled
            ) {
                return;
            }

            botaoLembreteEvento.disabled =
                true;
            const eventoEscolhido = { ...eventoAberto };
            try {
                const estaAtivo =
                    await alternarLembrete(eventoEscolhido);

                const eventoId =
                    String(eventoEscolhido.id);

                if (estaAtivo) {
                    idsLembretesAtivos.add(eventoId);
                } else {
                    idsLembretesAtivos.delete(eventoId);
                }

                await enviarAcaoParaAgendaGoogle(eventoId);

                atualizarBotaoLembrete();
            } catch (erro) {
                if (
                    erro?.code ===
                    "lembretes/usuario-nao-autenticado"
                ) {
                    redirecionarParaLogin();
                    return;
                }

                console.error(
                    "Erro ao atualizar o lembrete:",
                    erro
                );

                if (ajudaLembreteEvento) {
                    ajudaLembreteEvento.textContent =
                        "Não foi possível atualizar o lembrete agora.";
                }
            } finally {
                botaoLembreteEvento.disabled =
                    false;
            }
        }
    );


    observarLembretes(
        function (lembretes) {
            idsLembretesAtivos =
                new Set(
                    lembretes.map(
                        function (lembrete) {
                            return String(
                                lembrete.eventoId ||
                                ""
                            );
                        }
                    )
                );

            atualizarBotaoLembrete();
        },

        function (erro) {
            console.error(
                "Erro ao acompanhar os lembretes:",
                erro
            );

            if (ajudaLembreteEvento) {
                ajudaLembreteEvento.textContent =
                    "Não foi possível carregar seus lembretes.";
            }
        }
    );
}