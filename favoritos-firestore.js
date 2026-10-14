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
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


function aguardarUsuario() {
    return new Promise(
        function (resolver, rejeitar) {
            let pararObservacao =
                function () {};

            pararObservacao =
                onAuthStateChanged(
                    auth,

                    function (usuario) {
                        pararObservacao();
                        resolver(usuario);
                    },

                    function (erro) {
                        pararObservacao();
                        rejeitar(erro);
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
                "É necessário entrar na conta para utilizar os favoritos."
            );

        erro.code =
            "favoritos/usuario-nao-autenticado";

        throw erro;
    }

    return usuario;
}


function criarIdDocumento(
    tipo,
    itemId
) {
    return encodeURIComponent(
        `${tipo}::${itemId}`
    );
}


function obterReferenciaFavorito(
    usuarioId,
    tipo,
    itemId
) {
    return doc(
        db,
        "usuarios",
        usuarioId,
        "favoritos",
        criarIdDocumento(
            tipo,
            itemId
        )
    );
}


async function alternarFavorito(
    favorito
) {
    const usuario =
        await exigirUsuario();

    const tipo =
        String(
            favorito.tipo || ""
        )
            .trim()
            .toLowerCase();

    const itemId =
        String(
            favorito.itemId ||
            favorito.id ||
            ""
        ).trim();

    if (!tipo || !itemId) {
        throw new Error(
            "O favorito precisa possuir tipo e itemId."
        );
    }

    const referencia =
        obterReferenciaFavorito(
            usuario.uid,
            tipo,
            itemId
        );

    const documentoAtual =
        await getDoc(referencia);

    if (documentoAtual.exists()) {
        await deleteDoc(referencia);

        return false;
    }

    await setDoc(
        referencia,
        {
            tipo: tipo,
            itemId: itemId,

            titulo:
                favorito.titulo ||
                "Favorito",

            subtitulo:
                favorito.subtitulo ||
                "",

            descricao:
                favorito.descricao ||
                "",

            imagem:
                favorito.imagem ||
                "",

            url:
                favorito.url ||
                "",

            paginaOrigem:
                favorito.paginaOrigem ||
                "",

            criadoEm:
                serverTimestamp()
        }
    );

    return true;
}

async function removerFavorito(
    tipo,
    itemId
) {
    const usuario =
        await exigirUsuario();

    const tipoNormalizado =
        String(tipo || "")
            .trim()
            .toLowerCase();

    const itemIdNormalizado =
        String(itemId || "")
            .trim();

    if (
        !tipoNormalizado ||
        !itemIdNormalizado
    ) {
        throw new Error(
            "O favorito precisa possuir tipo e itemId."
        );
    }

    const referencia =
        obterReferenciaFavorito(
            usuario.uid,
            tipoNormalizado,
            itemIdNormalizado
        );

    await deleteDoc(referencia);
}

function observarFavoritos(
    tipo,
    aoAtualizar,
    aoFalhar
) {
    let pararConsulta =
        function () {};

    const pararAutenticacao =
        onAuthStateChanged(
            auth,

            function (usuario) {
                pararConsulta();

                pararConsulta =
                    function () {};

                if (!usuario) {
                    aoAtualizar([]);
                    return;
                }

                let consulta =
                    collection(
                        db,
                        "usuarios",
                        usuario.uid,
                        "favoritos"
                    );

                if (tipo) {
                    consulta =
                        query(
                            consulta,
                            where(
                                "tipo",
                                "==",
                                tipo
                            )
                        );
                }

                pararConsulta =
                    onSnapshot(
                        consulta,

                        function (resultado) {
                            const favoritos =
                                resultado.docs
                                    .map(
                                        function (
                                            documento
                                        ) {
                                            return {
                                                documentoId:
                                                    documento.id,

                                                ...documento.data()
                                            };
                                        }
                                    )
                                    .sort(
                                        function (a, b) {
                                            const tempoA =
                                                a.criadoEm
                                                    ?.toMillis?.() ||
                                                0;

                                            const tempoB =
                                                b.criadoEm
                                                    ?.toMillis?.() ||
                                                0;

                                            return (
                                                tempoB -
                                                tempoA
                                            );
                                        }
                                    );

                            aoAtualizar(
                                favoritos
                            );
                        },

                        function (erro) {
                            console.error(
                                "Erro ao carregar favoritos:",
                                erro
                            );

                            aoFalhar?.(erro);
                        }
                    );
            },

            function (erro) {
                console.error(
                    "Erro ao verificar a conta:",
                    erro
                );

                aoFalhar?.(erro);
            }
        );

    return function pararObservacoes() {
        pararConsulta();
        pararAutenticacao();
    };
}


export {
    alternarFavorito,
    observarFavoritos,
    removerFavorito
};