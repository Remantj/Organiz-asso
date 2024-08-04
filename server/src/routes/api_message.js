const express = require("express");
const Message = require("../entities/message.js");
const User = require("../entities/users.js");
const Discussion = require("../entities/discussion.js");

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API Message: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const message = new Message.default(db);
	const user = new User.default(db);
	const discussion = new Discussion.default(db);


	//Service qui créer un nouveau message
    router.post("/", async (req, res) => {
		try {
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// Vérification de la présence des champs requis
			const data = req.body;
			if (!data.auteur || !data.date || !data.texte || !data.discussion_id || !data.user_id){
				res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : il manque des champs"
                });
                return;
			}

			if (!user.exists(data.user_id) || !discussion.exists(data.discussion_id)){
				res.status(400).json({
                    status: 400,
                    "message": "L'utilisateur ou la discussion n'existe pas"
                });
                return;
			}

			const result = await message.createMessage(req.body);
			res.status(201).send(result)
		}
		catch (e) {
			res.status(500).send(e);
		}
	})

	// Service qui supprime un message en fonction de son id
	router.delete("/:message_id(*[a-z]+*)", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// Vérification des droits
			const id_auteur = await(message.findAuthor(req.params.message_id));
			if (!(req.session.user.isAdmin || req.session.user.id == id_auteur[0]["user_id"])){
				res.status(403).json({
                    status: 403,
                    "message": "Vous n'avez pas les droits"
                });
                return;
			}

			const result = await message.deleteMessage(req.params.message_id);
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service de recherche de message à partir de la date et de son contenu
	// passé dans le corps de la requête
	router.post("/search", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			const result = await message.getMessage(req.body);
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service permettant d'obtenir les messages signalés
	router.get("/", async (req, res) => {
		try {
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// Vérification des droits
			if (!req.session.user.isAdmin){
				res.status(403).json({
                    status: 403,
                    "message": "Vous n'avez pas les droits"
                });
                return;
			}

			const result = await message.getReported();
			//console.log(result);
			res.status(200).send(result)
		}
		catch (e) {
			res.status(500).send(e);
		}
	})

	// Service qui permet de signaler un message à partir de son id
	router.post("/:message_id(*[a-z]+*)", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// Vérification des champs
			if (!req.body.isReported){
				req.body.isReported = false;
			}

			// Vérification de l'identité de l'utilisateur
			if (req.session.user.id == message.findAuthor(req.params.message_id)){
				res.status(403).json({
                    status: 403,
                    "message": "Vous ne pouvez pas signaler vos messages"
                });
                return;
			}

			const result = await message.signalementMessage(req.params.message_id, req.body.isReported);
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
			res.status(500).send(e);
		}
	})

    return router;
	
}
exports.default = init;

