const path = require('path');
const cors = require('cors');
const api_user = require('./routes/api_user.js');
const api_discussion = require('./routes/api_discussion.js');
const api_message = require('./routes/api_message.js');
const remplissage = require('./fillBD.js');

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express();
app.use(cors({origin: "http://localhost:5173", credentials: true}));
const {MongoClient} = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function main(){
    try{
        await client.connect();
        await remplissage(client);        
    }
    catch(e){
        console.error(e);
    }
}

main().catch(console.error);

//api_1 = require("./api.js");
const session = require("express-session");

app.use(session({
    secret: "technoweb rocks",
    resave: false,
    saveUninitialized: false,
}));

app.use('/user', api_user.default(client));
app.use('/discussion', api_discussion.default(client));
app.use('/message', api_message.default(client));

// Démarre le serveur
app.on('close', () => {
    if (client.isConnected()) {
        client.close();
        console.log("Disconnected from MongoDB");
    }
});
exports.default = app;

