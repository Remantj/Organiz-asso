import { useRef, useEffect, useContext } from "react";
import "../styles/message.css";
import poubelle from "../assets/poubelle.jpg";
import signaler from "../assets/signaler.png";
import accepter from "../assets/accepter.jpg";
import {idContext} from "./useId.jsx";
import axios from 'axios';

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Message(props){

	// On récupère les informations de l'utilisateur
	const userid = useContext(idContext);

	// Permet de gérer l'affichage
	var id_message;

	if (props.discussion == false){
		id_message = "affichage_message";
	}
	else{
		if (props.auteur === userid.auteur){
			id_message = "message_user";
		}
		else{
			id_message = "message_autre";
		}
	}	

	// Permet d'afficher la date
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };


	// Permet d'afficher la page de profil
	function updateProfilDefault(){
		props.updateProfil(props.user_id);
	}
    
	// Permet de supprimer les messages
    function deleteMessage(){
        props.deleteMessage(props.id);
    }

	// Permet de signaler les messages
	async function signalerMessage(){
		const data = new Object();

		// Si l'on signale un message, alors on suppose qu'il ne l'est pas déjà
		data.isReported = false;
		try{
			console.log("Signalement d'un message");
			const res = axios.post("/message/" + props.id, data);
		}
		catch(e){
			console.error(e);
		}
	}

	// Permet de supprimer un message de la liste des messages signalés
	function designalerMessage(){
		props.designalerMessage(props.id);
	}


	// Permet selon la situation d'afficher ou non le bouton de signalement
	function aff_bouton_signalement(){
		// Si l'on est sur la page de signalement, alors on affiche le bouton
		// pour désignaler un message
		if (props.page_signalement == true){
			return (<>
				<div className="div_signaler">
					<button className="bouton_signaler" onClick={designalerMessage}>
						<img className="image_signaler" src={accepter} alt="designaler le message" />
					</button>
				</div>
			</>)
		}
		// On ne peut signaler un de ses messages
		if (props.auteur === userid.auteur){
			return;
		}
		// Sinon, on affiche le bouton de signalement
		return (<>
			<div className="div_signaler">
				<button className="bouton_signaler" onClick={signalerMessage}>
					<img className="image_signaler" src={signaler} alt="signalement" />
				</button>
			</div>
		</>)
	}

	// Permet d'afficher ou non le bouton afin de supprimer un bouton
	function aff_bouton_poubelle(){
		// Les administrateurs peuvent tout le temps supprimer un message
		if (userid.admin == true){
			return (<>
				<div className="div_poubelle">
					<button className="bouton_poubelle" onClick={deleteMessage}>
						<img className="image_poubelle" src={poubelle} alt="poubelle" />
					</button>
				</div>
			</>)
		}
		// Un utilisateur peut supprimer ses propres messages
		if (userid.auteur == props.auteur){
			return (<>
				<div className="div_poubelle">
					<button className="bouton_poubelle" onClick={deleteMessage}>
						<img className="image_poubelle" src={poubelle} alt="poubelle" />
					</button>
				</div>
			</>)
		}
		// Sinon, on ne peut pas
		return;
	}


	// Permet de créer un message
    function creationMessage(){
		// Si l'on affiche une discussion, et qu'on est l'auteur, alors le message se situe légèrement sur la gauche 
		if (props.auteur === userid.auteur && props.discussion == true){
			return  (<>
						<div className="conteneur" id={id_message} >    
							<div className="message">
								<div id="auteur">
									<a onClick={updateProfilDefault} id="auteur">{props.auteur}</a>
								</div>
								<div className="texte" >
									<p>{props.texte}</p>
								</div>
								<div id="date">
									<p>{date}</p>
								</div>
							</div>
							<div className="div_boutons_message">
								{aff_bouton_signalement()}
								{aff_bouton_poubelle()}
							</div>
						</div>
					</>)
		}
		// Sinon, on affiche les boutons légèrement vers la droite
		else{
			return  (<>
				<div className="conteneur" id={id_message} >
					<div className="div_boutons_message">
						{aff_bouton_signalement()}
						{aff_bouton_poubelle()}
					</div>
					<div className="message">
						<div id="auteur">
							<a onClick={updateProfilDefault}>{props.auteur}</a>
						</div>
						<div className="texte" >
							<p>{props.texte}</p>
						</div>
						<div id="date">
							<p>{date}</p>
						</div>
					</div>
				</div>
			</>)
		}
	}

	// Création de la date
    const d = new Date(props.date);
    const date = d.toLocaleDateString('fr-FR', options);

    return (<>
        {creationMessage()}
    </>)
}

export default Message;