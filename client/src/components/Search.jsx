import "../styles/search.css";
import ListeMessages from "./ListeMessages.jsx";

function Search(props){

	
    return (
        <>
            <div className="discussion">
				<div className="discuss">
					<h2>Résultat de la Recherche</h2>
					<ListeMessages liste={props.liste} updateProfil={props.updateProfil} deleteMessage={props.deleteMessage} discussion={false} page_signalement={false} />
				</div>
				<div className="retour" onClick={props.retour}>
					<button >Retour &rarr;</button>
				</div>
			</div>
        </>
    );
}

export default Search;