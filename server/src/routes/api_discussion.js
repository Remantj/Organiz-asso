const express = require("express");
const Discussion = require("../entities/discussion.js");
const User = require("../entities/users.js");

function init(db) {
        const router = express.Router();
        // On utilise JSON
        router.use(express.json());
        // simple logger for this router's requests
        // all requests to this router will first hit this middleware
        router.use((req, res, next) => {
                console.log('API Discussion: method %s, path %s', req.method, req.path);
                console.log('Body', req.body);
                next();
        });

        const discussion = new Discussion.default(db);
		const user = new User.default(db);


        // Service qui récupère la discussion selon l'id reçu dans le corps
        router.get("/:discussion_id(*[a-z]+*)", async (req, res) => {
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
				if (discussion.getRestricted == true && req.session.user.isAdmin == false){
					res.status(403).json({
						status: 403,
						"message": "Vous devez être administrateur"
					});
					return;
				}
				

                const result = await discussion.getDiscussion(req.params.discussion_id);
                res.status(200).send(result)
            }
            catch (e) {
                res.status(500).send(e);
            }
        })


        // Service qui affiche les titres des discussion du forum
        // On passe le status du forum dans le forum (privé/public)
		router.post("/topic", async (req, res) => {
            try {
				// Vérification de session
				if (!req.session.user){
					res.status(401).json({
						status: 401,
						message: "Une authentification est nécessaire pour accéder à cette ressource"
					});
					return;
				}

				// Vérification des champs
				if (!req.body.isRestricted){
					req.body.isRestricted = false;
				}

				// Vérification des droits
				if (req.body.isRestricted == true && req.session.user.isAdmin == false){
					res.status(403).json({
						status: 403,
						"message": "Vous devez être administrateur"
					});
					return;
				}

                const result = await discussion.getTopic(req.body.isRestricted);
                res.status(200).send(result)
            }
            catch (e) {
                res.status(500).send(e);
            }
        })


        // Service qui créer une discussion
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

				// Vérification des champs
				const data = req.body;
				if (!data.isRestricted){
					data.isRestricted = false;
				}
				if (!data.titre || !data.date || !data.user_id || !user.exists(data.user_id)){
					res.status(400).json({
						status: 400,
						"message": "Requête invalide"
					});
					return;
				}

				// Vérification des droits
				if (data.isRestricted == true && req.session.user.isAdmin == false){
					res.status(403).json({
						status: 403,
						"message": "Vous n'avez pas les droits"
					});
					return;
				}

                const result = await discussion.createDiscussion(req.body);
				if (result == null){
					res.status(400).json({
						status: 400,
						"message": "La discussion existe déjà"
					});
					return;
				}
                res.status(201).send(result)
            }
            catch (e) {
                res.status(500).send(e);
            }
        })
                
        return router;
}
exports.default = init;

