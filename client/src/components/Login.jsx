import "../styles/login.css";
import { useState } from "react";
import axios from 'axios';

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function Login({getConnected, setCurrentPage, modifId}){

  // Permet de ne pas afficher plusieurs fois le message d'erreur dû à au moins un champs qui est vide
  const [errVide, setErrVide] = useState(false);

  // Permet la connexion
  // La requête au serveur n'est envoyée que s'il n'y a pas d'erreurs dans le remplissage du formulaire de connexion
  async function connexion(event){
	try{
		event.preventDefault();
		// Récupérer les champs de formulaire
		const login = document.getElementById("login_form");
		const password = document.getElementById("password");

		const verif = verifErreur();
		if (verif == false){
			console.log("Connexion");
			const data = {login: login.value, password: password.value};
			const result = await axios.post("user/login", data);
			modifId({"auteur": result.data.login, "id": result.data["_id"], "admin": result.data.isAdmin});
			getConnected();
		}
	}
	catch(e){
		// Récupérer les champs de formulaire
		const login = document.getElementById("login_form");
		const password = document.getElementById("password");

		// S'il y a eu une erreur côté serveur, on l'affiche
		const erreurLogin = document.createElement('p');
		erreurLogin.textContent = e.response.data.message;
		login.style.border = '2px solid red';
		password.style.border = '2px solid red';
		erreurLogin.style.color = "red";
		document.getElementById('login').appendChild(erreurLogin);
	}
  }

  // Vérifie s'il y a des erreurs dans le remplissage du formulaire
  function verifErreur(){
	// Récupérer les champs de formulaire
	const login = document.getElementById("login_form");
	const password = document.getElementById("password");

	// Vérifier si les champs sont vides
	let erreur = false;
	if (login.value.trim() === '') {
		login.style.border = '2px solid red'; // Entourer en rouge le champ vide
		erreur = true;
	} else {
		login.style.borderColor = ''; // Réinitialiser la couleur du champ
	}
	if (password.value.trim() === '') {
		password.style.border = '2px solid red'; // Entourer en rouge le champ vide
		erreur = true;
	} else {
		password.style.borderColor = ''; // Réinitialiser la couleur du champ
	}

	if (erreur && !errVide) {
		// Afficher un message d'erreur en dessous du formulaire
		const messageErreur = document.createElement('p');
		messageErreur.textContent = 'Veuillez remplir tous les champs';
		messageErreur.style.color = "red";
		document.getElementById('login').appendChild(messageErreur);
		setErrVide(true);
	}
	return erreur;
  }

  // Permet de passer à la page d'inscription
  const inscription = () => setCurrentPage("SignUp");
  
  return  <>
      <div id="login">
        <div className="titre">
          <h1>Ouvrir une session</h1>
        </div>
        <div className="form_connexion">
          <form action="" method="POST">
            <label htmlFor="login_form">Login</label>
            <input type="text" id="login_form" />
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" />
            <input type="reset" value="Annuler" className="bouton" />
            <input onClick={connexion} type="submit" value="Connexion" className="bouton" />
          </form>
        </div>
        <div className="inscription">
          <h2>Vous n'avez pas encore de compte, Inscrivez-vous</h2>
          <button onClick={inscription}>Inscription</button>
        </div>
      </div>
    </>
}

export default Login;