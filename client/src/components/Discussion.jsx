import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import "../styles/discussion.css";
import ListeMessages from "./ListeMessages.jsx";
import {idContext} from "./useId.jsx";

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Discussion(props){

	// Liste contenant les messages de la discussion actuelle
	const [liste, setListe] = useState([
		{_id: "ehferv5466", auteur: "penguin", texte: "Salut, ça va ?", date: new Date(), user_id: "zeff484ed"},
	])

	// On récupère les identifiants de l'utilisateur actuellement connecté
	const userid = useContext(idContext);


	// On actualise l'affichage de la discussion au début et si l'on change de discussion
	useEffect(() => {
		actualisation_messages();
	}, [props.id])

	// Permet d'ajouter un message
	async function ajoutMessage(event){
		try{
			event.preventDefault();
			console.log("création d'un message");

			// Définition d'un message
			const data = new Object();
			data.auteur = userid.auteur;
			data.texte = document.getElementById("nv_mess").value;
			data.date = new Date();
			data.discussion_id = props.id;
			data.user_id = userid.id;

			// Requête d'ajout du message au serveur
			const res = await axios.post("/message/", data);

			// Mise à jour de la liste de messages
			setListe([...liste, {"_id": res.data.insertedId, "auteur": data.auteur, "texte": data.texte, "date": data.date, "user_id": data.user_id}]);

			// Faire défiler vers le bas après l'ajout du nouveau message
			setTimeout(() => {
				var listeMessages = document.querySelector('.listeMessages');
				listeMessages.scrollTop = listeMessages.scrollHeight;
			}, 0);

			// Effacer le contenu du champ de texte après l'ajout du message
			document.getElementById("nv_mess").value = "";
		}
		catch(e){
			console.error(e);
		}
	}

	// Permet de supprimer un message
	async function deleteMessage(id){
        try{
			console.log("suppression d'un message");
			const res = await axios.delete("/message/" + id);
			setListe(liste.filter(elem => elem["_id"] !== id));
			//console.log(res);
		}
		catch(e){
			console.errorr(e);
		}
    }

	// Permet de récupérer les messages composant la discussion
	async function actualisation_messages(){
		try{
			console.log("chargement de la discussion")
			const res = await axios.get('/discussion/' + props.id);
			//console.log(res.data);

			// On les place dans la liste
			setListe(res.data);
		}catch(e){
			console.error(e);
		}
	}

	return (<>
		<div className="discussion">
			<div className="discuss">
				<h2 className="titreDiscuss">{props.titre}</h2> 
				<ListeMessages liste={liste} updateProfil={props.updateProfil} deleteMessage={deleteMessage} discussion={true} page_signalement={false} />


				<form action="" method="POST" className="form_contenu1">
					<label htmlFor="nv_mess">Nouveau Message</label>
					<textarea id="nv_mess" rows="3" cols="40"></textarea>
					<button onClick={ajoutMessage} className="sub_nv_mess">Envoyer</button>
				</form>
			</div>
			<div className="retour" onClick={props.retour}>
				<button >Retour &rarr;</button>

			</div>
		</div>
</>)
}

export default Discussion;