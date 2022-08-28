import { initializeApp } from "firebase/app"

export const firebaseConfig = {
    apiKey: "AIzaSyBDLpiR5x7rIXJKBs6qsTRjWslYTf8_yPY",
    authDomain: "isep-life.firebaseapp.com",
    projectId: "isep-life",
    storageBucket: "isep-life.appspot.com",
    messagingSenderId: "1001463308502",
    appId: "1:1001463308502:web:dcbe107b4659c0d5902977",
    measurementId: "G-2P4YWF3DW8"
}
export const firebaseApp = initializeApp(firebaseConfig)