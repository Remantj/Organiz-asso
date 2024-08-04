import "../styles/header.css";
import logo_sorbonne from "../assets/logo_sorbonne.png";
import {idContext} from "./useId.jsx";
import {useContext} from "react";
import axios from 'axios';

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;


function Header(props){

	// On récupère les identifiants de l'utilisateur actuellement connecté
	const userid = useContext(idContext);

	// Il faut afficher la liste d'attente
	function update_liste_attente(){
		props.setAffListeAttente(true);
	}

	// Il faut afficher l'autre forum
	function update_forum(){
		props.setForumPrive(!props.forumPrive);
	}

	// Il faut afficher la page de signalement
	function update_signalement(){
		console.log("changement de forum");
		props.setSignalement(true);
	}

	// Permet de changer le nom du forum selon celui actuel
	function nom(){
		if (props.forumPrive == false){
			return "Accès Forum Privé";
		}
		return "Accès Forum Public";
	}

	// Déconnexion de l'utilisateur
	async function logout(){
		try{
			console.log("Déconnexion");
			const result = await axios.post("/user/logout");
			props.setLogout();
			return result;
		}
		catch(e){
			console.error(e);
		}
	}

	// Permet d'afficher les boutons de changement de page selon que l'utilisateur actuel est administrateur ou non
	function affichage_boutons(){
		if (userid.admin == false){
			// On n'affiche que le bouton de déconnexion
			return (<>
					<div className="Déconnexion">
						<button onClick={logout}>Déconnexion</button>
					</div>
			</>)
		}
		// On affiche tous les boutons
		return (<>
					<div className="Déconnexion">
						<button onClick={logout}>Déconnexion</button>
					</div>
					<div className="attente">
						<button onClick={update_liste_attente}>Voir les utilisateurs en attente</button>
					</div>
					<div className="signalement">
						<button onClick={update_signalement}>Signalements</button>
					</div>
					<div className="forumPrive">
						<button onClick={update_forum}>{nom()}</button>
					</div>
		</>)
	}

	// Permet de rechercher un ou des messages selon un interval de temps et un ou des mots clés
	async function recherche(event){
		try{
			event.preventDefault();
			console.log("recherche d'un message");

			const data = new Object();
			data.date_debut = document.getElementById("debut").value;
			data.date_fin = document.getElementById("fin").value;
			data.texte = document.getElementById("search").value;

			// Requête de recherche de messages au serveur
			const res = await axios.post("/message/search", data);
			props.setSearch(true);

			// On met à jour la liste des messages recherchés
			props.setListe(res.data);
		}
		catch(e){
			console.error(e);
		}
	}

    return (
        <>
            <div className="logo">
              <img className="img" src={logo_sorbonne} />
            </div>
            <div className="search">
                <form action="" method="POST" className="search_header">
                    <label htmlFor="search">rechercher</label>
                    <input type="text" id="search" />
                    <label htmlFor ="debut">début</label>
                    <input type="date" id="debut" />
                    <label htmlFor ="fin">fin</label>
                    <input type="date" id="fin" /> 
                    <input type="submit" value="search" onClick={recherche} />
                </form>
            </div>
			<div className="boutons_header">
				{affichage_boutons()}
			</div>
        </>
    );
}

export default Header;