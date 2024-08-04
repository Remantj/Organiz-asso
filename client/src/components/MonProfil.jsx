import "../styles/monprofil.css";
import menu from "../assets/menu.png";
import axios from 'axios';
import {useState, useContext, useEffect} from "react";
import {idContext} from "./useId.jsx";

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function MonProfil(props){

	// Contient le nom
	const [nom, setNom] = useState("");

	// Contient le prénom
	const [prenom, setPrenom] = useState("");

	// Contient le login
	const [login, setLogin] = useState("");

	// Contient le nombre de messages
	const [nbMessages, setNbMessages] = useState(0);

	// Contient le statut
	const [statut, setStatut] = useState("");

	// Permet d'afficher sa page de profil complète avec la liste des messages que l'on a envoyé
    function updateProfilDefault(e){
        e.preventDefault();

		// On ferme le menu gauche
        props.modifWidth();

		// On met à jour 
        props.updateProfil(userid.id);
    }

	// On récupère les informations de l'utilisateur connecté
	const userid = useContext(idContext);

	// On actualise les informations à chaque ouverture ou fermeture du menu gauche
	useEffect(() => {
		affichage();
	}, [props.expanse])

	// Récupère les informations sur l'utilisateur connecté et les place dans les états
	async function affichage(){
		try{
			const data = {"listeMessages": "false"};
			const res = await axios.post('/user/profile/' + userid.id, data);
			setNom(res.data.nom);
			setPrenom(res.data.prenom);
			setLogin(res.data.login);
			setNbMessages(res.data.nbMessages);
			if (res.data.isAdmin == true){
				setStatut("admin");
			}
			else{
				setStatut("user");
			}
		}catch(e){
			console.error(e);
		}
	}

	// Si le menu gauche est fermé, on affiche une icône hamburger
    if (props.expanse == false){
        return (<>
            <div>
                <img className="icon-hamburger" src={menu} alt="icone du menu" onClick={props.modifWidth} />
            </div>
        </>);
    }

	// Sinon on affiche les informations sur l'utilisateur
    else{
        return (<>
            <div id="aside">
				<div id="infos">
					<h2>Mon Profil</h2>
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
					<p>
						<span>statut:</span> {statut}
					</p>
					<p>
						<a href="" onClick={updateProfilDefault}>Gestion de mon Profil</a>
					</p>
				</div>
				<div className="x" onClick={props.modifWidth}>
					<p>x</p>
				</div>
			</div>
        </>)
    }

    
}

export default MonProfil;