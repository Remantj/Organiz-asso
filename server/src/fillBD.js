const { MongoClient, ObjectId } = require('mongodb');

async function remplissage(db){
    try{
        // Initialisation
        await db.db("asso");
        const user = await db.db("asso").collection("User");
        const message = await db.db("asso").collection("Message");
        const discussion = await db.db("asso").collection("Discussion");
        
        // Insertion utilisateur
		const utilisateur1 = {nom: "jul", prenom: "ien", login:"julien", password: "0", isAdmin: true, isAccepted: true};
		const jul = await user.insertOne(utilisateur1);
		const utilisateur2 = {nom: "Orlinfo", prenom: "Jade", login:"JadeO", password: "0", isAdmin: false, isAccepted: true};
		const jade = await user.insertOne(utilisateur2);

		// Insertion Discussion
        const discu = {titre: "First", date: new Date(), user_id: jul.insertedId, isRestricted: false};
        const result = await discussion.insertOne(discu);

		// Insertion message
        const msg1 = {auteur: "julien", texte: "Bonjour à tous !", date: new Date(), discussion_id: result.insertedId, user_id: jul.insertedId};
        const msg2 = {auteur: "JadeO", texte: "Salut", date: new Date(), discussion_id: result.insertedId, user_id: jade.insertedId};
        await message.insertOne(msg1);
        await message.insertOne(msg2);
    }
    catch(e){
        console.log(e);
    }
}

module.exports = remplissage;