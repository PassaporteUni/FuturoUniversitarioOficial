"use strict";

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,

    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


function aguardarUsuario() {
    if (auth.currentUser) {
        return Promise.resolve(
            auth.currentUser
        );
    }

    return new Promise(
        function (resolve, reject) {
            let pararObservacao =
                function () { };

            pararObservacao =
                onAuthStateChanged(
                    auth,

                    function (usuario) {
                        pararObservacao();
                        resolve(usuario);
                    },

                    function (erro) {
                        pararObservacao();
                        reject(erro);
                    }
                );
        }
    );
}


async function exigirUsuario() {
    const usuario =
        await aguardarUsuario();

    if (!usuario) {
        const erro =
            new Error(
                "Entre na sua conta para receber lembretes."
            );

        erro.code =
            "lembretes/usuario-nao-autenticado";

        throw erro;
    }

    return usuario;
}


function obterReferenciaLembrete(
    usuarioId,
    eventoId
) {
    const documentoId =
        encodeURIComponent(
            String(eventoId)
        );

    return doc(
        db,
        "usuarios",
        usuarioId,
        "lembretes",
        documentoId
    );
}


async function alternarLembrete(evento) {
    if (!evento?.id) {
        throw new Error(
            "O evento não possui um identificador."
        );
    }

    const usuario =
        await exigirUsuario();

    const emailUsuario =
        String(
            usuario.email ||
            ""
        )
            .trim()
            .toLowerCase();

    if (!emailUsuario) {
        const erro =
            new Error(
                "Não foi possível encontrar o e-mail da sua conta."
            );

        erro.code =
            "lembretes/email-indisponivel";

        throw erro;
    }

    const referencia =
        obterReferenciaLembrete(
            usuario.uid,
            evento.id
        );

    const documentoAtual =
        await getDoc(referencia);

    const dadosAtuais =
        documentoAtual.exists()
            ? documentoAtual.data()
            : null;

    /*
        Se estiver ativo, marca para cancelamento.
        O documento permanece no Firestore para o
        Apps Script conseguir cancelar o convite.
    */

    if (
        dadosAtuais &&
        dadosAtuais.ativo !== false
    ) {
        const possuiEventoAgenda =
            Boolean(
                String(
                    dadosAtuais.eventoAgendaId ||
                    ""
                ).trim()
            );

        await setDoc(
            referencia,
            {
                ativo:
                    false,

                agendaStatus:
                    possuiEventoAgenda
                        ? "cancelamento-pendente"
                        : "cancelado",

                desativadoEm:
                    serverTimestamp(),

                atualizadoEm:
                    serverTimestamp()
            },
            {
                merge: true
            }
        );

        return false;
    }

    /*
        Se o usuário reativar antes do Apps Script
        cancelar o convite, aproveita o mesmo evento
        e evita criar uma duplicação.
    */

    const conviteAindaExiste =
        Boolean(
            dadosAtuais &&
            dadosAtuais.agendaStatus ===
            "cancelamento-pendente" &&
            String(
                dadosAtuais.eventoAgendaId ||
                ""
            ).trim()
        );

    const dadosNovoLembrete = {
        eventoId:
            String(evento.id),

        titulo:
            String(
                evento.titulo ||
                "Evento"
            ),

        descricao:
            String(
                evento.descricao ||
                ""
            ),

        data:
            String(
                evento.data ||
                ""
            ),

        categoria:
            String(
                evento.categoria ||
                "evento"
            ),

        instituicao:
            String(
                evento.instituicao ||
                ""
            ),

        processoId:
            String(
                evento.processoId ||
                ""
            ),

        urlOficial:
            String(
                evento.urlOficial ||
                ""
            ),

        paginaOrigem:
            String(
                evento.paginaOrigem ||
                "calendario.html"
            ),

        emailUsuario:
            emailUsuario,

        ativo:
            true,

        email3DiasEnviado:
            false,

        email3DiasEnviadoEm:
            null,

        email1DiaEnviado:
            false,

        email1DiaEnviadoEm:
            null,

        agendaStatus:
            conviteAindaExiste
                ? "enviado"
                : "pendente",

        eventoAgendaId:
            conviteAindaExiste
                ? String(
                    dadosAtuais.eventoAgendaId
                )
                : "",

        conviteAgendaEnviadoEm:
            conviteAindaExiste
                ? dadosAtuais
                    .conviteAgendaEnviadoEm ||
                null
                : null,

        conviteAgendaCanceladoEm:
            null,

        ultimoErroAgenda:
            "",

        desativadoEm:
            null,

        atualizadoEm:
            serverTimestamp()
    };

    if (!documentoAtual.exists()) {
        dadosNovoLembrete.criadoEm =
            serverTimestamp();
    }

    await setDoc(
        referencia,
        dadosNovoLembrete,
        {
            merge: true
        }
    );

    return true;
}

async function removerLembrete(
    eventoId
) {
    const usuario =
        await exigirUsuario();

    const referencia =
        obterReferenciaLembrete(
            usuario.uid,
            eventoId
        );

    const documentoAtual =
        await getDoc(referencia);

    if (!documentoAtual.exists()) {
        return;
    }

    const dadosAtuais =
        documentoAtual.data();

    const possuiEventoAgenda =
        Boolean(
            String(
                dadosAtuais.eventoAgendaId ||
                ""
            ).trim()
        );

    await setDoc(
        referencia,
        {
            ativo:
                false,

            agendaStatus:
                possuiEventoAgenda
                    ? "cancelamento-pendente"
                    : "cancelado",

            desativadoEm:
                serverTimestamp(),

            atualizadoEm:
                serverTimestamp()
        },
        {
            merge: true
        }
    );
}


function observarLembretes(
    aoAtualizar,
    aoFalhar
) {
    let pararColecao =
        function () { };

    const informarErro =
        typeof aoFalhar === "function"
            ? aoFalhar
            : console.error;

    const pararAutenticacao =
        onAuthStateChanged(
            auth,

            function (usuario) {
                pararColecao();

                pararColecao =
                    function () { };

                if (!usuario) {
                    aoAtualizar([]);
                    return;
                }

                const referencia =
                    collection(
                        db,
                        "usuarios",
                        usuario.uid,
                        "lembretes"
                    );

                pararColecao =
                    onSnapshot(
                        referencia,

                        function (resultado) {
                            const lembretes =
                                resultado.docs
                                    .map(
                                        function (documento) {
                                            return {
                                                idDocumento:
                                                    documento.id,

                                                ...documento.data()
                                            };
                                        }
                                    )
                                    .filter(
                                        function (lembrete) {
                                            return lembrete.ativo !== false;
                                        }
                                    );
                            lembretes.sort(
                                function (
                                    lembreteA,
                                    lembreteB
                                ) {
                                    return String(
                                        lembreteA.data ||
                                        ""
                                    ).localeCompare(
                                        String(
                                            lembreteB.data ||
                                            ""
                                        )
                                    );
                                }
                            );

                            aoAtualizar(
                                lembretes
                            );
                        },

                        informarErro
                    );
            },

            informarErro
        );

    return function () {
        pararColecao();
        pararAutenticacao();
    };
}


export {
    alternarLembrete,
    observarLembretes,
    removerLembrete
};