const { MongoClient, ObjectId } = require('mongodb');

class Message {
  constructor(db) {
    this.db = db;
  }

  // Aajout du message data dans la base de donnée
  async createMessage(data) {
    try{
		// Collection Message
		const message = this.db.db("asso").collection("Message");

		// Conversion des id en ObjectId
		data.discussion_id = new ObjectId(data.discussion_id);
		data.user_id = new ObjectId(data.user_id);

		data.isReported = false; //La variable estSignalé est initialisé à faux

		// Requête d'ajout d'un nouveau message
        const result = await message.insertOne(data);
		return result;
	}
	catch(e){
		console.log(e); // Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Suppression d'un message à partir de son message_id
  async deleteMessage(message_id){
	try{
		// Collection Message
		const message = await this.db.db("asso").collection("Message");
		
		// Suppression du message d'id message_id
		const res = await message.deleteOne({_id: new ObjectId(message_id)});
		return res;
	}
	catch(e){
		console.log(e);// Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Recherche de message en fonction de sa date de création ou de son contenu à l'aide d'expressions régulières
  async getMessage(data){
	try{
		// Collection Message
		const message = await this.db.db("asso").collection("Message");
		var re = new RegExp(data.texte);
		var query;

		// Recherchez les messages avec la plage horaire spécifiée et la chaîne de caractères dans le texte
		if (data.date_debut === '' || data.date_fin === ''){
			query = {texte: {$regex: re, $options: 'i'}}
		}
		else{
			query = {
				date: {
					$gte: data.date_debut, // Supérieur ou égal à la date de début
					$lte: data.date_fin, // Inférieur ou égal à la date de fin
				},
				texte: {$regex: re, $options: 'i'} // Recherche de la chaîne de caractères dans le texte (insensible à la casse)
			}
		}
		const options = {projection: {_id: 1, auteur: 1, texte: 1, date: 1, user_id: 1}}; // Format de la réponse
		const cursor = await message.find(query, options);
		const resultat = await cursor.toArray();
		return resultat;
	}
	catch(e){
		console.log(e); // Affichage des erreurs
		throw new Error("Erreur interne");
	}
	
  }

  //Signaler un message problématique à partir de son id
  async signalementMessage(message_id, isReported){
	try{
		//Collection Message
		const message = await this.db.db("asso").collection("Message");

		// Modification du champs isReported du message
		const query = {_id: {$eq: new ObjectId(message_id)}}; // Conversion de l'id en ObjectID
		const options = {$set: {isReported: !isReported}}; // On change la valeur du champ isReported
		const res = await message.updateOne(query, options); // on met à jours la base de donnée
		//console.log(res);
		return res;
	}
	catch(e){
		console.log(e);// Affichage des erreurs
		throw new Error("Erreur interne");
	}
  }

  // Obtenir l'ensemble des message signalés
  async getReported(){
	try{
		// Collection Message
		const message = await this.db.db("asso").collection("Message");

		// Récupération des messages signalés
		const query = {isReported: {$eq: true}}; // Message dont le champ iSReported est à True
		const options = {projection: {_id: 1, auteur: 1, texte: 1, date: 1, user_id: 1, isReported: 1}}; // Format de la réponse
		const cursor = await message.find(query, options);
		const resultat = await cursor.toArray(); // Conversion en tableau Js
		return resultat;
	}
	catch(e){
		console.log(e);
		throw new Error("Erreur interne");
	}
  }

  async findAuthor(message_id){
	try{
		// Collection Message
		const message = await this.db.db("asso").collection("Message");

		// Récupération des messages signalés
		const query = {_id: {$eq: new ObjectId(message_id)}}; // Message dont le champ iSReported est à True
		const options = {projection: {_id: 1, user_id: 1}}; // Format de la réponse
		const cursor = await message.find(query, options);
		const resultat = await cursor.toArray(); // Conversion en tableau Js
		return resultat;
	}
	catch(e){
		console.log(e);
		throw new Error("Erreur interne");
	}
  }

}

exports.default = Message;
