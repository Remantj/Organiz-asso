const { MongoClient, ObjectId } = require('mongodb');

class Users {
  constructor(db) {
    this.db = db
  }

  // Création d'un nouveau utilisateur (les logins doivent être uniques)
  async createUser(data) {
	try{
		// Collection User
		const user = await this.db.db("asso").collection("User");

		// Recherche d'un utilisateur existant et ayant le même login
		const query = {login: {$eq: data.login}};
		const retour = await user.findOne(query);
		if (retour){
			return null;
		}

		data.isAdmin = false; // L'utilisateur est initialisé non admin
		data.isAccepted = false; // L'utilisateur n'est pas encore accepté par un admin
		// Requête d'ajout d'un nouveau utilisateur
        const result = await user.insertOne(data);
		return result;
	  }
	  catch(e){
		console.log(e); // Affichage des erreurs
		throw new Error("Erreur interne");
	  }
  }

  // Obtenir le Profil d'un utilisateur en fonction de son userid
  async getProfile(userid, data){
	try{
		// Collection User
		const user = await this.db.db("asso").collection("User");
		// Collection Message
		const message = await this.db.db("asso").collection("Message");

		// Récupération du nom, du prénom, de l'id, du login, du statut
		const query = {_id: {$eq: new ObjectId(userid)}};
		const options = {projection: {_id: 1, nom: 1, prenom: 1, login: 1, isAdmin: 1}};
		const result = await user.findOne(query, options);

		// Récupération du nombre de messages
		const query2 = {user_id: {$eq: new ObjectId(userid)}};
		const options2 = {projection: {_id: 1, auteur: 1, texte: 1, date: 1}};
		const cursor = await message.find(query2, options2);
		const res = await cursor.toArray();
		result.nbMessages = res.length;

		if (data.listeMessages == true){
			// on récupère la liste des message que si on est un admin 
			// ou lorsque l'on regarde son propre profil
			result.messages = res; 
		}
		return result;
	}
	catch(e){
		console.log(e);// Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Obtenir l'ensemble des utilisater qui se sont inscrit
  // mais pas encore accepté par les admins
  async getUsers(){
	try{
		// Collection User
		const user = await this.db.db("asso").collection("User");
		
		// Récupération des utilisateurs non acceptés
		const query = {isAccepted: {$eq: false}};
		const options = {projection: {_id: 1, login: 1}}; // Format de la réponse
		const cursor = await user.find(query, options);
		const res = await cursor.toArray(); // Conversion en tableau JS
		return res;
	}
	catch(e){
		console.log(e);// Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Accepter un utilisateur inscrit à accéder au Forum
  async acceptUser(userid){
	try{
		// Collection User
		const user = await this.db.db("asso").collection("User");
		
		// Modification de l'utilisateur d'id userid
		const query = {_id: {$eq: new ObjectId(userid)}}; // Conversion de l'id en ObjectID
		const options = {$set: {isAccepted: true}}; // Il est désormais accepté
		const res = await user.updateOne(query, options);
		return res;
	}
	catch(e){
		console.log(e); // Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }
  
  // Supression d'un utilisateur
  async deleteUser(userid){
	try{
		const user = await this.db.db("asso").collection("User");
		
		// Suppression de l'utilisateur d'id userid
		const res = await user.deleteOne({_id: new ObjectId(userid)});
		return res;
	}
	catch(e){
		console.log(e); // affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Récupérer un utilisateur en fonction de son login
  async getUser(data){
	try{
		// Collection User
		const user = await this.db.db("asso").collection("User");
		
		// Récupération de l'utilisateur
		const query = {login: {$eq: data.login}};
		const res = await user.findOne(query);
		return res;
	}
	catch(e){
		console.log(e);// affichage des erreurs
		throw new Error("Erreur interne");
	}
  }


  // Mettre à jour le statut d'un utilisateur
  // S'il est admin il devient user
  // et inversement
  async updateAdmin(data){
	try{
		const user = await this.db.db("asso").collection("User");

		// Modification du champs isAdmin de l'utilisateur
		const query = {_id: {$eq: new ObjectId(data["_id"])}}; // conversion de l'id en Object id
		const options = {$set: {isAdmin: !data.isAdmin}}; // on met à jour son statut is admin
		const res = await user.updateOne(query, options);
		return res;
	}
	catch(e){
		console.log(e);// affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Permet de vérifier si un utilisateur existe
  async exists(id){
	try{
		const user = await this.db.db("asso").collection("User");

		const query = {_id: {$eq: new ObjectId(id)}}; // conversion de l'id en Object id
		const res = await user.findOne(query);

		if (res){
			return true;
		}
		return false;
	}
	catch(e){
		console.log(e);
		throw new Error("Erreur interne");
	}
  }
}

exports.default = Users;

