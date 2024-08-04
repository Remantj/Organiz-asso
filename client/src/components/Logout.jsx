import axios from 'axios';

// port du serveur; par défaut axios écoute le port 80
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;


function Logout(props){

  // Permet la déconnexion de l'utilisateurn connecté
  async function logout(){
	try{
		console.log("Déconnexion");
		const result = await axios.post("/logout");
		console.log("Utilisateur déconnecté");
		props.setLogout();
	}
	catch(e){
		console.error(e);
	}
  }

  return (
    <button onClick={logout}>Déconnexion</button>
  )
}

export default Logout;