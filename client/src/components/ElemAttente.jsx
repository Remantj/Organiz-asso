import "../styles/elem_attente.css";
import img_accepter from "../assets/accepter.jpg";
import img_refuser from "../assets/refuser.webp";


function ElemAttente(props){

	// Permet d'accepter un utilisateur
	function accepter(){
		props.accepter(props.id);
	}

	// Permet de refuser un utilisateur
	function refuser(){
		props.refuser(props.id);
	}

	return (<>
		<div className="elemAttente">
			<div className="utilisateur">
				<p>{props.auteur}</p>
			</div>
			<div className="accepter" >
				<button className="boutonElem" onClick={accepter}>
					<img className="imgElem" src={img_accepter} alt="accepter" />
				</button>
			</div>
			<div className="refuser">
				<button className="boutonElem" onClick={refuser}>
					<img className="imgElem" src={img_refuser} alt="refuser" />
				</button>
			</div>
		</div>
</>)
}

export default ElemAttente;