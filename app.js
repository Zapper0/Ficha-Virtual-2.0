//imports

import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import flash from 'connect-flash';
import path from 'path';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, get, child, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD8SiYu6fKNEUTbANRRojSUUZR8oiXX70I",
    authDomain: "fichavirtualapp.firebaseapp.com",
    databaseURL: "https://fichavirtualapp-default-rtdb.firebaseio.com",
    projectId: "fichavirtualapp",
    storageBucket: "fichavirtualapp.appspot.com",
    messagingSenderId: "519488013741",
    appId: "1:519488013741:web:fdd6ab4ba855241d45cd24",
    measurementId: "G-QXHSQFCS1T"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
// const analytics = getAnalytics(app);

//config

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.engine('handlebars', handlebars.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
const __dirname = path.resolve();
const viewsPath = path.join(__dirname, 'views');

//routes
app.get('/', (req, res) => {
    const auth = getAuth();
    get(child(ref(db), `estoque`)).then(snapshot => {
        res.render('index', { user: auth.currentUser, itens: snapshot.val() });
    }); 
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(`${user.email} logou com sucesso`);
            res.redirect('/');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(`${userCredential.user.email} criou uma conta com sucesso`);
            updateProfile(auth.currentUser, {
                displayName: username
            }).then(() => {
                const user = userCredential.user;
                console.log(`${user.email} registrou-se com sucesso`);
                res.redirect('/');
            }).catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
});

//start server

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor online na porta ${port}`);
})