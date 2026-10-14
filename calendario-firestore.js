"use strict";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    db
} from "./firebase-config.js";


/* ==================================================
   COLEÇÕES
================================================== */

const referenciaEventos =
    collection(
        db,
        "eventosCalendario"
    );

const referenciaProcessos =
    collection(
        db,
        "processosCalendario"
    );


/* ==================================================
   ESTADO LOCAL
================================================== */

let eventosFirestore = [];

let processosFirestore = {};

let eventosCarregados = false;

let processosCarregados = false;


/* ==================================================
   ENVIAR DADOS PARA O CALENDÁRIO
================================================== */

function publicarDadosCalendario() {

    /*
        Espera as duas coleções responderem
        pelo menos uma vez.
    */

    if (
        !eventosCarregados ||
        !processosCarregados
    ) {
        return;
    }


    const dados = {
        eventos:
            eventosFirestore,

        processos:
            processosFirestore
    };


    /*
        Guarda também no window para impedir
        problemas caso o script.js comece a
        escutar depois do Firestore carregar.
    */

    window.calendarioFirestoreDados =
        dados;


    window.dispatchEvent(
        new CustomEvent(
            "calendario:dados-firestore",
            {
                detail: dados
            }
        )
    );


    console.info(
        "Calendário sincronizado com Firestore:",
        eventosFirestore.length,
        "evento(s) e",
        Object.keys(processosFirestore).length,
        "processo(s)."
    );
}


/* ==================================================
   EVENTOS
================================================== */

onSnapshot(
    referenciaEventos,

    function (snapshot) {

        eventosFirestore =
            snapshot.docs.map(
                function (documento) {

                    return {
                        id: documento.id,
                        ...documento.data()
                    };
                }
            );


        eventosCarregados = true;


        publicarDadosCalendario();
    },

    function (erro) {

        console.error(
            "Erro ao carregar eventos do calendário:",
            erro
        );


        /*
            Marca como carregado para não travar
            o restante do calendário.
        */

        eventosCarregados = true;


        publicarDadosCalendario();
    }
);


/* ==================================================
   PROCESSOS
================================================== */

onSnapshot(
    referenciaProcessos,

    function (snapshot) {

        processosFirestore = {};


        snapshot.docs.forEach(
            function (documento) {

                processosFirestore[
                    documento.id
                ] = documento.data();
            }
        );


        processosCarregados = true;


        publicarDadosCalendario();
    },

    function (erro) {

        console.error(
            "Erro ao carregar processos do calendário:",
            erro
        );


        processosCarregados = true;


        publicarDadosCalendario();
    }
);