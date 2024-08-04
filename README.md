# Organiz'Asso

## Présentation

Ce projet a pour objectif de développer le site associatif Organiz'assso.

Le site Organiz’asso permet à des membres d’une association d’échanger des messages via un forum.
L’association est pilotée par un conseil d’administration, qui sont des membres élus appelés administrateurs.
Il y a deux forums :
- le forum ouvert, que chaque membre inscrit peut consulter et sur lequel il peut poster des messages ;
-  le forum fermé, réservé aux membres du conseil d’administration.
  
Hors connexion, un utilisateur n’a que la possibilité de créer un compte. Son inscription doit être validée par
un administrateur pour lui attribuer le statut de membre.
Lorsqu’un membre se connecte, cela permet d’ouvrir une page principale qui contient le forum ouvert.
Une fois connecté, un membre peut :
- créer des messages :
  - soit en réponse à un message précédemment posté
  - soit pour démarrer une nouvelle discussion
- visualiser son profil contenant au moins la liste des messages qu’il a publiés. A partir de son profil, il
peut supprimer ses propres messages.
- visualiser le profil d’autres membres.
- rechercher des messages en précisant des mots-clés, un intervalle de temps de publication ou leur auteur.
Un administrateur :
- a accès au forum fermé
- peut donner ou retirer le statut administrateur à un autre utilisateur, sauf à lui-même
- revoit les inscriptions sur le site, et valide ou non le statut de membre à un utilisateur inscrit.

A la fin de son activité, l’utilisateur a la possibilité de se déconnecter.

## Structure

Ce projet s'articule autour de trois points :
- Le client :
  - mise en place d'un site web à l'aide de react
  - communication avec le serveur via axios
- Le serveur :
  - mise en place d'un serveur à l'aide de Node js et d'Express
  - mise en place de Web Services suivant les spécifications de l'API REST
- La base de données
  - mise en place d'un serveur MongoDB

## Dépendances et Installation

- Le gestionnaire de paquets npm
- React
- Axios : ```npm install axios```
- Express : ```npm install express```
- Nodemon : ```npm install nodemon```
- MongoDB
- Le driver pour Node.js : ```npm install
mongodb```

## Mise en Place

## Utilisation

