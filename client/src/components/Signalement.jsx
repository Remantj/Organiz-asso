import { useState, useEffect } from "react";
import ListeMessages from "./ListeMessages.jsx";
import axios from 'axios';
import "../styles/signalement.css";

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Signalement(props){

	// Liste des messages signalés
	const [liste, setListe] = useState([]);

	// On actualise les messages à chaque ouverture de la page de signalement
	useEffect(() => {
		actualisation_messages();
	}, [])

	// Récupération des messages et mise de ceux-ci dans la liste
	async function actualisation_messages(){
		try{
			console.log("Affichage de la liste de signalements");
			const res = await axios.get('/message');
			//console.log(res.data);
			setListe(res.data);
		}catch(e){
			console.error(e);
		}
	}

	// Permet de supprimer un message
	async function deleteMessage(id){
        try{
			console.log("Suppression d'un message");
			const res = await axios.delete("/message/" + id);
			setListe(liste.filter(elem => elem["_id"] !== id));
			//console.log(res);
		}
		catch(e){
			console.error(e);
		}
    }

	// Permet d'enlever un message de la liste des signalements
	async function designalerMessage(id){
		const data = new Object();

		// On suppose que l'on ne peut que designaler un message déjà signalé
		data.isReported = true;
		try{
			console.log("Désignalement d'un message");
			const res = axios.post("/message/" + id, data);
			setListe(liste.filter(elem => elem["_id"] !== id));
		}
		catch(e){
			console.error(e);
		}
	}


	return (<>
		<div className="div_signalement">
			<div className="contenu_signalement">
				<h2>Messages Signalés</h2>
				<ListeMessages liste={liste} updateProfil={props.updateProfil} deleteMessage={deleteMessage} discussion={false} page_signalement={true} designalerMessage={designalerMessage} />
			</div>
			<div className="retour" onClick={props.retour}>
				<button >Retour &rarr;</button>
			</div>
		</div>
	</>)
		
}

export default Signalement;