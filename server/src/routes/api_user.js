const express = require("express");
const Users = require("../entities/users.js");
const { MongoClient, ObjectId } = require('mongodb');

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API User : method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const user = new Users.default(db);

	// Service permettant la connexion d'un utilisateur 
	// à partir de son login et de son mot de passe passé dans le corps de la requête
    router.post("/login", async (req, res) => {
        try {
            // Erreur sur la requête HTTP
            if (!req.body.login || !req.body.password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }

			// Récupération de l'utilisateur 
			const result = await user.getUser(req.body);

			// Vérification de l'existence
            if(!result) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }

			// Vérification du mot de passe
            if (result.password === req.body.password) {
				if (result.isAccepted == false){
					res.status(404).json({
						status: 404,
						message: "Vous n'avez pas encore été accepté"
					});
					return;
				}
				
                // Avec middleware express-session
				if (!req.session.connected){
					req.session.user = {
						connected : true,
						id : result["_id"],
						isAdmin: result.isAdmin}
					res.status(200).send(result);
				}
                return;
            }

            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

	// Service permettant l'inscription d'un nouveau Utilisateur
	// Tous les champs sont passés dans le corps de la requête
    router.post("/", async (req, res) => {
        try {
			// Vérification des champs en entrée
			if (!req.body.login || !req.body.password || !req.body.nom || !req.body.prenom) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : il manque des champs"
                });
                return;
            }

			const result = await user.createUser(req.body);
			if (result == null){
				throw new Error("User déjà existant");
			}
			res.status(201).send(result);
		}
		catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service permettant d'obtenir le profil d'un utilisateur et ses messages envoyé en fonction de son id
	router.post("/profile/:user_id(*[a-z]+*)", async (req, res) => {
		try {
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// Vérification des champs en entrée
			if (!req.body.listeMessages){
				req.body.listeMessages = false;
			}
			
			// Vérification que l'on peut afficher la liste des messages
			if (req.body.listeMessages == true && (!req.session.user.isAdmin && req.session.user.id != new ObjectId(req.params.user_id))){
				res.status(403).json({
                    status: 403,
                    "message": "Vous n'avez pas les droits"
                });
                return;
			}
			
			
			const result = await user.getProfile(req.params.user_id, req.body);
			res.status(200).send(result)
		}
		catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service permettant d'obtenir les utilisateurs en attente
	router.get("/", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// vérifier droits côté serveur
			if (req.session.user.isAdmin == false){
				res.status(403).json({
                    status: 403,
                    "message": "Vous devez être administrateur"
                });
                return;
			}

			const result = await user.getUsers();
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service permettant d'accepter un utilisateur inscrit
	router.put("/:user_id(*[a-z]+*)", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// vérifier droits côté serveur
			if (req.session.user.isAdmin == false){
				res.status(403).json({
                    status: 403,
                    "message": "Vous devez être administrateur"
                });
                return;
			}

			const result = await user.acceptUser(req.params.user_id);
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service permettant de supprimer un utilisateur
	router.delete("/:user_id(*[a-z]+*)", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// vérifier droits côté serveur
			if (req.session.user.isAdmin == false){
				res.status(403).json({
                    status: 403,
                    "message": "Vous devez être administrateur"
                });
                return;
			}

			const result = await user.deleteUser(req.params.user_id);
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
			res.status(500).send(e);
		}
	})

	// Service permettant de déconnecter un utilisateur
	router.post("/logout", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// destruction de la session
            req.session.destroy((err) => { });
			res.status(200).json({
				status: 200,
				message: "L'utilisateur a bien été déconnecté"
			});
		}
		catch(e){
			console.log(e);
		}
	})

	// Service permettant de mettre à jours le status d'un utilisateur
	router.post("/admin", async (req, res) => {
		try{
			// Vérification de session
			if (!req.session.user){
				res.status(401).json({
					status: 401,
					message: "Une authentification est nécessaire pour accéder à cette ressource"
				});
				return;
			}

			// vérifier droits côté serveur
			if (req.session.user.isAdmin == false){
				res.status(403).json({
                    status: 403,
                    "message": "Vous devez être administrateur"
                });
                return;
			}

			result = await user.updateAdmin(req.body);
			res.status(200).send(result);
		}
		catch(e){
			console.log(e);
		}
	})

    return router;
}
exports.default = init;

