import { useState } from "react";
import "../styles/signup.css";
import axios from 'axios';


// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function SignUp(props) {
  
  // Permet de ne pas afficher plusieurs fois le message d'erreur dû à au moins un champs qui est vide
  const [errVide, setErrVide] = useState(false); 

  // erreur dû à deux password qui sont différents
  const [errPass, setErrPass] = useState(false);
  const [errLogin, setErrLogin] = useState(false);

  // On affiche la page de connexion
  const messageAcceptation = () => props.setCurrentPage("Login");

  // Permet l'inscription
  async function update(e){
    e.preventDefault();


	// Récupérer les champs du formulaire
	const prenom = document.getElementById('prenom');
	const nom = document.getElementById('nom');
	const login = document.getElementById('login');
	const password = document.getElementById('password');
	const verify = document.getElementById('verify');

	// Vérifier si les password sont bien égaux
	let erreurPassword = false;

	// Vérifier si les champs sont vides
	let erreur = false;
	if (prenom.value.trim() === '') {
		prenom.style.border = '2px solid red'; // Entourer en rouge le champ vide
		erreur = true;
	} else {
		prenom.style.borderColor = ''; // Réinitialiser la couleur du champ
	}
	if (nom.value.trim() === '') {
		nom.style.border = '2px solid red'; // Entourer en rouge le champ vide
		erreur = true;
	} else {
		nom.style.borderColor = ''; // Réinitialiser la couleur du champ
	}
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
	if (verify.value.trim() === '') {
		verify.style.border = '2px solid red'; // Entourer en rouge le champ vide
		erreur = true;
	} else {
		verify.style.borderColor = ''; // Réinitialiser la couleur du champ
	}

	// Si les champs password et retapez le password sont différents
	if (password.value.trim() !== verify.value.trim()){
		password.style.border = '2px solid red'; // Entourer en rouge le champ vide
		verify.style.border = '2px solid red'; // Entourer en rouge le champ vide
		erreurPassword = true;
	}
   
	// Si l'un des champs est vide et que le message n'est pas encore apparu
	if (erreur && !errVide) {
		// Afficher un message d'erreur en dessous du formulaire
		const messageErreur = document.createElement('p');
		messageErreur.textContent = 'Veuillez remplir tous les champs';
		messageErreur.style.color = "red";
		document.getElementById('signin').appendChild(messageErreur);
		setErrVide(true);
	}

	// Si les mots de passe sont différents et que le message n'est pas encore apparu
	if (erreurPassword && !errPass){
		const erreurPass = document.createElement('p');
		erreurPass.textContent = 'Les champs Mot de passe et Retapez doivent être équivalents';
		erreurPass.id = "erreurPass";
		erreurPass.style.color = "red";
		document.getElementById('signin').appendChild(erreurPass);
		setErrPass(true);
	}
	else{
		// Si le problème des mots de passe qui sont différents est réglé, on enlève le message d'erreur correspondant
		if (errPass){
			document.getElementById('signin').removeChild(document.getElementById("erreurPass"));
		}
	}

	// S'il n'y a pas eu d'erreurs
	if (!erreur && !erreurPassword){
		const data = new Object();
		data.login = login.value;
		data.password = password.value;
		data.prenom = prenom.value;
		data.nom = nom.value;
		try{
			console.log("Inscription");
			const res = await axios.post('/user/', data);

			// On affiche un message validant l'inscription
			const reussiteLogin = document.createElement('p');
			reussiteLogin.textContent = "Inscription réussie";
			reussiteLogin.style.color = "red";
			document.getElementById('signin').appendChild(reussiteLogin);

			// Au bout de deux secondes on affiche la page de connexion
			setTimeout(messageAcceptation, 2000);
		}catch(e){
			// On affiche un message d'erreur
			if (!errLogin){
				const erreurLogin = document.createElement('p');
				erreurLogin.textContent = 'Un utilisateur ayant le même login existe déjà, veuillez en choisir un autre';
				login.style.border = '2px solid red';
				erreurLogin.style.color = "red";
				document.getElementById('signin').appendChild(erreurLogin);
				setErrLogin(true);
			}
		}
	}
  }

  
  return (
    <>
      <div id="signin">
        <div>
            <h1>Inscription</h1>
        </div>
        <div>
            <form action='' method='POST'>
                <label htmlFor="prenom">Prénom</label>
                <input type="text" id="prenom"/>
                <label htmlFor="nom">Nom</label>
                <input type="text" id="nom"/>
                <label htmlFor="login" className="connexion">Login</label>
                <input type="text" id="login"/>
                <label htmlFor="password" className="connexion">Mot de passe</label>
                <input type="password" id="password"/>
                <label htmlFor="verify" className="connexion">Retapez</label>
                <input type="password" id="verify"/>
                <button className="bouton" onClick={props.setLogout}>Annuler</button>
                <input onClick={update} type="submit" value="Inscription" className="bouton"/>

            </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;