import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import "../styles/content.css";
import Discussion from "./Discussion.jsx";
import {idContext} from "./useId.jsx";

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Content(props){

	// affichage contient un booléen afin de savoir s'il faut afficher une discussion
	// affichage contient également un objet contenant l'id et le titre de la discussion à afficher
    const [affichage, setAffichage] = useState([false, {"_id": 1234, "titre": "titre"}]);

	// Liste contenant les titres de discussion à afficher
    const [listDiscuss, setListDiscuss] = useState([
        {"_id": 1234, "titre": "titre"}
    ]);

	// On récupère les identifiants de l'utilisateur actuellement connecté
    const userid = useContext(idContext);

	// On actualise l'affichage des titres de discussions à la première ouverture
	// et lorsque l'on change de forum (public, privé)
	useEffect(() => {
		actualisation_discussion();
	}, [props.forumPrive]);

	// Permet d'afficher une discussion en particulier
    function modifAff(event){
        event.preventDefault();
        setAffichage([true, {"_id": event.target.getAttribute("key-data"), "titre": getTitre(event.target.getAttribute("key-data"))}]);
    }

	// Récupère le titre de la discussion dans listDiscuss à partir de l'id
	function getTitre(id){
		for (var i=0; i<listDiscuss.length; i++){
			if (listDiscuss[i]["_id"] == id){
				return listDiscuss[i].titre;
			}
		}	
	}

	// Permet de sortir d'une discussion et de ré-afficher les titres des discussions
    function retour(){
        setAffichage([false, {}]);
    }

	// Permet d'afficher la liste des titres de discussion
    function affTitres(){
        return listDiscuss.map((elem) => (
            <li key={elem["_id"]}>
                <button onClick={modifAff} className="boutonDiscuss" key-data={elem["_id"]}>{elem.titre}</button>
            </li>
        ))
    }
    
	// Permet de créer une discussion
	async function creerDiscussion(){
		try{
			console.log("création d'une discusion");
			const data = new Object();
			data.titre = document.getElementById("nouvDiscuss").value;
			data.date = new Date();
			data.user_id = userid.id;
			data.isRestricted = props.forumPrive;
			//console.log(data);
			const result = await axios.post("/discussion/", data);
			//console.log(result);

			// Mise à jour de la liste de discussions
			setListDiscuss([...listDiscuss, {"_id": result.data.insertedId, "titre": data.titre}]);
			document.getElementById("nouvDiscuss").value = "";
		}
		catch(e){
			// Afficher un message d'erreur en dessous du formulaire
			if (e.response.data.status == 400 && e.response.data.message == "La discussion existe déjà"){
				const messageErreur = document.createElement('p');
				messageErreur.textContent = 'Cette discussion existe déjà !';
				messageErreur.id = "messageErreur";
				messageErreur.style.color = "red";
				document.getElementById("nouvDiscuss").style.border = '2px solid red'; // Entourer en rouge
				document.getElementById('creationDiscussion').appendChild(messageErreur);
				setTimeout(nettoyage, 5000);
			}
			else{
				console.error(e);
			}
		}
	}

	// Permet de récupérer les titres des discussions à afficher
	async function actualisation_discussion(){
		try{
			console.log("récupération des discussions");
			const data = new Object();
			data.isRestricted = props.forumPrive;
			const res = await axios.post('/discussion/topic', data);
			setListDiscuss(res.data);
		}catch(e){
			console.error(e);
		}
	}

	// Permet d'enlever le message d'erreur
	function nettoyage(){
		document.getElementById('creationDiscussion').removeChild(document.getElementById("messageErreur"));
		document.getElementById("nouvDiscuss").value = "";
		document.getElementById("nouvDiscuss").style.border = '1px solid black'; // Entourer en rouge
	}

	// Si une discussion a été selectionnée, on l'affiche
    if (affichage[0]){
        return <Discussion id={affichage[1]["_id"]} titre={affichage[1].titre} retour={retour} updateProfil={props.updateProfil}/>;
    }

	// Sinon, on affiche la liste des discussions
    return (
        <>
            <div className="contenu">
                <h1>Dernières Discussions</h1>
                <ul>
                    {affTitres()}
                </ul>
                <fieldset id="creationDiscussion">
                    <label htmlFor="nouvDiscuss">Créer une nouvelle discussion : </label>
                    <input type="text" id="nouvDiscuss" />
                    <button className="boutonDiscuss" onClick={creerDiscussion}>Créer</button>
                </fieldset>
            </div>
        </>
    );
}

export default Content;