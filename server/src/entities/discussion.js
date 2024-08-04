const { MongoClient, ObjectId } = require('mongodb');

class Discussion {
  constructor(db) {
    this.db = db;
  }

  // Créer un nouveau fil de discussion (le titre doit être unique)
  async createDiscussion(data) {
	  try{
    	// Collection Discussion
		const discussion = await this.db.db("asso").collection("Discussion");

		// Recherche d'une discussion existante et portant ce titre
		const query = {titre: {$eq: data.titre}};
		const retour = await discussion.findOne(query);
		if (retour){ // si la discussion est existante on ne créer rien
			return null;
		}

		// Requête d'ajout d'une nouvelle discussion
    const result = await discussion.insertOne(data);
		return result;
	  }
	  catch(e){
		  console.log(e); // Affichage des erreurs
		  throw new Error("Erreur interne");
	  }
  }

  //Récupérer la discussion en fonction de son id
  async getDiscussion(discussion_id){
      // Requête permettant de récupérer la discussion
      try{
        const query = {discussion_id: {$eq: new ObjectId(discussion_id)}}; // On convertit l'id en ObjectId
        const options = {projection: {_id: 1, auteur: 1, texte: 1, date: 1, user_id: 1}}; // Le format de la réponse
        const message = await this.db.db("asso").collection("Message");
        const cursor = await message.find(query, options);
        const result = await cursor.toArray(); // On transforme en tableau JS

        // Réponse de la requête
        return result;
      }
      catch(e){
        console.log(e); // Affichage des erreurs
		throw new Error("Erreur interne");
      }
  }


  // Récupérer les titres des discussions d'un forum
  async getTopic(forumPrive){
	try{
		// Requête permetant de récupérer le titres des discussion du Forum en fonction
		// de la variable forumPrive qui indique si le forum est privé ou pas
		const query = {isRestricted: {$eq: forumPrive}}; // On regarde si la discussion est privé ou pas
        const options = {projection: {_id: 1, titre: 1}};  // Le format de la réponse
        const discussion = await this.db.db("asso").collection("Discussion");
        const cursor = await discussion.find(query, options);
        const result = await cursor.toArray(); // On transforme en tableau JS

		return result;
	}
	catch(e){
		console.log(e); //Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Vérification de l'existance d'une discussion
  async exists(id){
	try{
		// Collection Discussion
		const discussion = await this.db.db("asso").collection("Discussion");

		// Recherche d'une discussion existante
		const query = {_id: {$eq: new ObjectId(id)}};
		const result = await discussion.findOne(query);

		if (result){
			return true;
		}
		return false;
	}
	catch(e){
		console.log(e);
		throw new Error("Erreur interne");
	}
  }

  async getRestricted(discussion_id){
	try{
		// Collection Discussion
		const discussion = await this.db.db("asso").collection("Discussion");

		// Recherche d'une discussion existante
		const query = {_id: {$eq: new ObjectId(discussion_id)}};
		const result = await discussion.findOne(query);

		return result.isRestricted;
	}
	catch(e){
		console.log(e);
		throw new Error("Erreur interne");
	}
  }
  
}

exports.default = Discussion;
