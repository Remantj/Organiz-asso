import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import "../styles/liste_attente.css";
import ElemAttente from "./ElemAttente.jsx";
import {idContext} from "./useId.jsx";

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function ListeAttente(props){

	// Liste des utilisateurs en attente
	const [liste, setListe] = useState([
		{_id: "ehferv5466", login: "penguin"},
	])

	// Permet de récupérer les informations de l'utilisateur
	const userid = useContext(idContext);

	// On actualise la liste des utilisateurs en attente à chaque ouverture de la page 
	useEffect(() => {
		actualisation_liste();
	}, [])

	// Permet d'afficher les utilisateurs en attente
	function affichage(){
		if (liste.length == 0){
			return <p>Il n'y a pas d'utilisateur en attente</p>;
		}
		return (<>
			<ul>
				{liste.map((elem) => (
					<li key={elem["_id"]}>
						<ElemAttente id={elem["_id"]} auteur={elem.login} accepter={accepter} refuser={refuser} />
					</li>
				))}
			</ul>
		</>);
	}

	// Permet de retourner à la page Home
	function retour(){
		props.setAffListeAttente(false);
	}

	// Permet de supprimer un élément de la liste
	function removeElement(id){
		setListe(liste.filter(elem => elem["_id"] !== id));
	}

	// Permet d'accepter un utilisateur
	async function accepter(id){
		try{
			console.log("Acceptation d'un utilisateur");
			const res = await axios.put("/user/" + id);
			removeElement(id);
			//console.log(res);
		}
		catch(e){
			console.errorr(e);
		}
	}

	// Permet de supprimer un utilisateur
	async function refuser(id){
		try{
			console.log("refus d'un utilisateur");
			const res = await axios.delete("/user/" + id);
			removeElement(id);
			//console.log(res);
		}
		catch(e){
			console.errorr(e);
		}
	}

	// Permet d'actualiser la liste
	async function actualisation_liste(){
		try{
			console.log("affichage de la liste d'attente");
			const res = await axios.get("/user");
			setListe(res.data);
			//console.log(res.data);
		}
		catch(e){
			console.error(e);
		}
	}

	return (<>
		<div className="contenu_attente">
			<div className="listeAttente">
				<div className="titreAttente">
					<h2>Liste des utilisateurs en attente d'acceptation</h2> 
				</div>
				<div className="liste">
					{affichage()}
				</div>
			</div>
			<div className="retour">
				<button onClick={retour}>Retour &rarr;</button>
			</div>
		</div>
</>)
}

export default ListeAttente;