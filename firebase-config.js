import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBlVi2-l5olzH13SBOa8YUJExfySW91JJs",
    authDomain: "futuro-universitario.firebaseapp.com",
    projectId: "futuro-universitario",
    storageBucket: "futuro-universitario.firebasestorage.app",
    messagingSenderId: "174559273795",
    appId: "1:174559273795:web:1b6a1a74323d2116e4c5f6"
};


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


console.info(
    "Firebase conectado:",
    app.options.projectId
);


export {
    app,
    auth,
    db
};