import Message from "./Message.jsx";
import "../styles/listemessages.css";

function ListeMessages(props){

    // Permet d'afficher la liste des messages
    function affichage() {
        return props.liste.map((elem, index) => (
            <Message key={index} id={elem["_id"]} user_id={elem.user_id} auteur={elem.auteur} texte={elem.texte} date={elem.date} deleteMessage={props.deleteMessage} updateProfil={props.updateProfil} discussion={props.discussion} page_signalement={props.page_signalement} designalerMessage={props.designalerMessage} />
        ));
    }

    return (<>
        <div className="listeMessages"> 
            {affichage()}
        </div>
    </>)
}

export default ListeMessages;