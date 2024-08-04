import { useState, useRef } from "react";
import "../styles/home.css";
import Header from "./Header.jsx";
import MonProfil from "./MonProfil.jsx";
import Content from "./Content.jsx";
import Profil from "./Profil.jsx";
import ListeAttente from "./ListeAttente.jsx";
import Search from './Search.jsx';
import Signalement from './Signalement.jsx';
import axios from 'axios';

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Home(props){

    // Permet de gérer l'état de l'affichage du menu gauche
    const [expanse, setExpanse] = useState(false);

    // Permet de savoir s'il faut afficher la page de profil
    const [profil, setProfil] = useState(null);

    // Permet de savoir s'il faut afficher la page des utilisateurs en attente d'acceptation
	const [affListeAttente, setAffListeAttente] = useState(false);

    // Permet de savoir s'il faut afficher le forum privé ou le public
	const [forumPrive, setForumPrive] = useState(false);

    // Permet de savoir si l'on doit afficher la recherche de messages
	const [search, setSearch] = useState(false);

    // Permet de savoir s'il faut afficher la page des messages signalés
	const [signalement, setSignalement] = useState(false);

    // Contient les messages recherchés
	const [liste, setListe] = useState([]);

    // référence vers le menu gauche
    const aside = useRef(null);

    // référence vers la partie contenue
    const contenu = useRef(null);

    // Permet d'ouvrir ou non le menu gauche
    function modifWidth(){
        if (expanse == false){
            setExpanse(true);
			console.log("affichage de mon profil");
            aside.current.style.width = "20%";
            aside.current.style.backgroundColor = "gray";
            contenu.current.style.width = "80%";
        }
        else{
            setExpanse(false);
            aside.current.style.width = "10%";
            contenu.current.style.width = "90%";
            aside.current.style.backgroundColor = "white";
        }
    }

    // Permet d'afficher la bonne page selon les états  
	function afficher_content(){

        // On affiche la page contenant les messages recherchés
		if (search == true){
			return (<>
					<Search retour={retour} liste={liste} deleteMessage={deleteMessage} updateProfil={updateProfil} />
			</>)
		}
        // On affiche la page contenant les utilisateurs en attente
		if (affListeAttente == true){
			return <ListeAttente setAffListeAttente={setAffListeAttente} />;
		}
        // On affiche la page de signalement
		if (signalement == true){
			return <Signalement retour={retour} updateProfil={updateProfil} />
		}
        // On affiche le forum privé
		if (forumPrive == false){
			return <Content updateProfil={updateProfil} forumPrive={false} />;
		}
        // On affiche le forum public
		return <Content updateProfil={updateProfil} forumPrive={true} />
	}

    // Permet de sortir de la page de recherche ou de la page de signalement
	function retour(){
		setSearch(false);
		setSignalement(false);
	}

    // Permet de supprimer un message (ceux de la page de recherche)
	async function deleteMessage(id){
        try{
			console.log("suppresion d'un message");
			const res = await axios.delete("/message/" + id);

            // On efface le message que l'on vient de supprimer de la liste
			setListe(liste.filter(elem => elem["_id"] !== id));
			//console.log(res);
		}
		catch(e){
			console.error(e);
		}
    }


    // Permet d'afficher la page de profil
	function updateProfil(id_user){
		if (profil == null){
			setProfil(id_user);
		}
		else{
			setProfil(null);
		}
	}

    // On affiche la page de profil
    if (profil){
        return (<>
            <div id="home">
                <header className="header">
                    <Header setLogout={props.setLogout} forumPrive={forumPrive} setForumPrive={setForumPrive} setAffListeAttente={setAffListeAttente} setSearch={setSearch} setSignalement={setSignalement} setListe={setListe} />
                </header>
                <Profil updateProfil={updateProfil} id_profil={profil}/>
            </div>
        </>)
    }

    return (
        <>
            <div id="home">
                <header className="header">
                    <Header setLogout={props.setLogout} forumPrive={forumPrive} setForumPrive={setForumPrive} setAffListeAttente={setAffListeAttente} setSearch={setSearch} setListe={setListe} setSignalement={setSignalement} />
                </header>
                <main>
                    <aside ref={aside}>
                        <MonProfil expanse={expanse} modifWidth={modifWidth} updateProfil={updateProfil} />
                    </aside>
                    <div ref={contenu} className="contenu">
                        {afficher_content()}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Home;