import { useState } from "react";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import {idContext} from "./components/useId.jsx";

function MainPage() {

  const [isConnected, setConnected] = useState(false); // état de la connexion
  const [currentPage, setCurrentPage] = useState("Login"); // Page à afficher actuellement
  // identifiants de l'utilisateur qui est connecté, ceux-ci sont transmis à tous les composants grâce au hook useContext
  const [ident, setIdent] = useState({"auteur": "JadeO", "id": "66166b400a0efd16b5fb6b1c", "admin": true});

  // Permet de se connecter
  function getConnected(){
    setConnected(true);
    setCurrentPage("Home");
  }

  // Permet de se déconnecter de l'application
  async function setLogout(){
    try{
      setConnected(false);
      setCurrentPage("Login");
    }
    catch(e){
      console.error(e);
    }
  }

  // Permet de mettre à jour les identifiants et informations utiles de l'utilisateur actuellement connecté
  function modifId(identifiant){
    setIdent(identifiant);
  }


  var page = undefined;
  if (currentPage === "Login"){
    // On affiche la page de connexion
    page = <Login getConnected={getConnected} setCurrentPage={setCurrentPage} modifId={modifId}/>;
  }
  else
    if (currentPage === "SignUp"){
      // On affiche la page d'inscription
      page = <SignUp setLogout={setLogout} setCurrentPage={setCurrentPage} />;
    }
    else
      if (currentPage === "Home"){
        // On affiche la page Home
        page = <Home setLogout={setLogout}/>;
      }
  
  // On transmet les identifiants et informations utiles sur l'utilisateur actuellement connecté aux composants React enfants
  return (
    <>
      <idContext.Provider value={ident}>
        {page}
      </idContext.Provider>
    </>
  );
}


export default MainPage;
