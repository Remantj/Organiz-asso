import { useState, useContext, useEffect } from "react";
import "../styles/profil.css";
import ListeMessages from "./ListeMessages.jsx";
import {idContext} from "./useId.jsx";
import axios from 'axios';

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Profil(props){
	const [id, setId] = useState(null);
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [login, setLogin] = useState("");
	const [nbMessages, setNbMessages] = useState(0);
	const [statut, setStatut] = useState("");
	const [listeMessages, setListeMessages] = useState(null);
	const [nomBouton, setNomBouton] = useState("");

	// Récupération des informations sur l'utilisateur connecté
	const userid = useContext(idContext);

	// Permet de récupérer les informations de l'utilisateur props.id_profil
	async function affichage(){
		try{
			const data = new Object();

			// Si l'on affiche le profil de l'utilisateur actuellement connecté, on affiche la liste des messages qu'il a envoyé 
			if (userid.id === props.id_profil || userid.admin == true){
				data.listeMessages = true;
			}
			// Sinon ce n'est pas le cas
			else{
				data.listeMessages = false;
			}
			
			console.log("affichage du profil");
			// Récupération des informations
			const res = await axios.post('/user/profile/' + props.id_profil, data);

			// Affectations de celles-ci
			setNom(res.data.nom);
			setPrenom(res.data.prenom);
			setLogin(res.data.login);
			setId(res.data["_id"]);
			setNbMessages(res.data.nbMessages);

			if (res.data.isAdmin == true){
				setStatut("admin");
				setNomBouton("Révoquer les droits d'admin"); // Nom affiché sur le bouton
			}
			else{
				setStatut("user");
				setNomBouton("Mettre admin"); // Nom affiché sur le bouton
			}
			if (data.listeMessages == true){
				setListeMessages(res.data.messages);
			}
			//console.log(res)
		}catch(e){
			console.error(e);
		}
	}

	// Permet, si l'utilisateur actuel est administrateur, de passer l'utilisateur props.id_profil
	// en administrateur ou de le rétrograder selon son statut
	async function updateAdmin(){
		try{
			const data = new Object();
			data["_id"] = id;
			if (statut === "admin"){
				data.isAdmin = true;
			}
			else{
				data.isAdmin = false;
			}
			console.log("Mise à jour du statut");
			const result = await axios.post("/user/admin/", data);
			//console.log(result);
			affichage();
		}
		catch(e){
			console.error(e);
		}
	}

	// Permet de supprimer un message
	async function deleteMessage(id){
        try{
			console.log("Suppression d'un message");
			const res = await axios.delete("/message/" + id);
			setListeMessages(listeMessages.filter(elem => elem["_id"] !== id));
			//console.log(res);
		}
		catch(e){
			console.error(e);
		}
    }

	// On actualise les informations à chaque ouverture de la page de profil
	useEffect(() => {
		affichage();
	}, [])

	// Permet d'afficher la liste des messages
	function affichage_discussion(){
		if (listeMessages){
			return <ListeMessages liste={listeMessages} deleteMessage={deleteMessage} discussion={false} page_signalement={false} />;
		}
	}

	// Permet d'afficher le bouton
	function afficher_bouton(){
		if (userid.id !== props.id_profil && userid.admin == true){
			return <button id="boutonUpdate" onClick={updateAdmin}>{nomBouton}</button>
		}
	}
    
    return (<>
        <h1 id="h1-profil">Page de Profil</h1>
        <div id="profil">
            <div id="contenu-profil">
                <div className="p-profil">
					<p>
						<span>Nom:</span> {nom}
					</p>
					<p>
						<span>Prénom:</span> {prenom}
					</p>
					<p>
						<span>Login:</span> {login}
					</p>
					<p>
						<span>Nombre de messages envoyés:</span> {nbMessages}
					</p>
					<div className="mettreAdmin">
						<p>
							<span>statut:</span> {statut}
						</p>
						{afficher_bouton()}
					</div>
                </div>
                {affichage_discussion()}
            </div>
            <div className="retour">
                <button onClick={props.updateProfil}>Retour &rarr;</button>
            </div>
        </div>
    </>)
}

export default Profil;