"use strict";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    db
} from "./firebase-config.js";


const referenciaUniversidades =
    collection(
        db,
        "universidades"
    );


onSnapshot(
    referenciaUniversidades,

    function (snapshot) {
        const universidades =
            snapshot.docs.map(
                function (documento) {
                    return {
                        ...documento.data(),

                        id:
                            documento.id
                    };
                }
            );


        universidades.sort(
            function (
                universidadeA,
                universidadeB
            ) {
                return String(
                    universidadeA.nome || ""
                ).localeCompare(
                    String(
                        universidadeB.nome || ""
                    ),
                    "pt-BR"
                );
            }
        );


        window.universidadesFirestoreDados =
            universidades;


        window.dispatchEvent(
            new CustomEvent(
                "universidades:dados-firestore",
                {
                    detail:
                        universidades
                }
            )
        );


        console.info(
            "Universidades sincronizadas com Firestore:",
            universidades.length
        );
    },

    function (erro) {
        console.error(
            "Erro ao carregar universidades do Firestore:",
            erro
        );
    }
);