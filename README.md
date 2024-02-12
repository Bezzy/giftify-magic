Pour accéder à l'application rendez-vous simplement à cette adresse:

```
195.15.206.94
```

# Frontend

Le frontend se trouve dans le dossier ./public et est composé de deux fichiers.
Le fichier index.html et le fichier index.js.

La partie css est directement inclus dans le fichier index.html en inline.

L'application utilise comme dépendence:
- React
- Tailwinds
- Babel

Les trois sont utilisés avec un CDN. L'arborescence du dossier est donc très
simple. La raison est que je ne prévoyais pas de faire autant de modifications
au projet.

L'application utilise React. Le choix d'utiliser React
s'est fait naturellement pour gérer une application aussi réactive qu'un
Deck Builder.

Au début je voulais faire tout le rendu coté serveur en SSR (Server Side Rendering).
Mais, ensuite j'ai préféré uen interface plus intéractive qui répond en live
au changement du Backend. Ceci offre une expérience plus immersive mais à pour
inconvénient de devoir structurer le backend et le frontend de façon à
synchroniser les changements d'états.

Globalement, le front est structuré ainsi.

- Une liste d'états globaux pour gérér de façon dynamique les différents
états de l'interface. Est-ce-qu'on est en mode creating ou updating ?
Le nombre de cartes dans le deck... Il n'y a pas de router. Tout changement
d'interface se fait en checkant la valeur d'un global state. is_updating_mode,
is_create_mode ... Ceci à pour l'avantage de controler l'interface à un niveau
très précis mais à pour inconvénient de compliqué la logique. Pour gérer les
états je n'utilise pas de state manager mais, si je devais utiliser une
librairie cela serait zustand.

- Une partie composant, qui défini les différentes éléments de l'interface.

- Une partie API fetch, qui à pour but de fetch les deux api utilisés. Celle de
magic et celle du backend. Le fetching des data se fait généralement par le
triggering d'un événement ou d'un état de l'application. Les états
de l'application définissent qu'elles données on va demander. Par exemple,
quand on clique sur sauvegarder le deck, si on est en update_mode alors
on va query /update_deck mais si on est en create_mode alors on va query
/create_deck.



# Backend

La partie backend est très simple aussi. Elle utilise un système de route
(Altorouter) pour gérer les différents accès de l'API et communique les data
via json.

L'api est très primitif et est divisé comme suit.

- create: C'est ici qu'on va créer le deck en récupérant le json correspondant.

- update_deck: Après avoir modifier le deck dans le front. Celui-ci renvoie un
json avec le deck modifié.

- deck_list: Fetch les decks et renvoie un json incluant les deck.

- edit_deck: Renvoie les cartes d'un deck sous format json.

- secret_delete: Rénitialise la db en supprimant toutes les entrées.

# DB

J'utilise une base de donnée afin de faire persister les data de l'API magic.

La base de donnée utilisé est SQLite3. Il y a deux tables qui sont importantes.
La table cards et la table Deck. La table cards contient les cartes du jeux et
ses attributs (mana, puissance...). Chaque cartes dans la table cards contient
l'id du deck auquel elle appartient. C'est ce qui permet de faire la jointure
entre le deck et ses cartes. Le deck lui contient juste le nom du deck et
le nombre de cartes dans le deck.

La table cards

| name | manaCost | cmc | type | text | power | toughness | imageUrl | flavor | id | id_deck | id_card |
|------|----------|-----|------|-----:|-------|-----------|----------|--------|----|---------|---------|
|      |          |     |      |      |       |           |          |        |    |         |         |

La table Deck

| Name | cards_numbers | id |
|------|---------------|----|
|      |               |    |


# Features

## Common Features

Ces fonctionalités sont persistants entre le view mode et le editing mode

## View mode

Cette configuration permet de parcourir l'ensemble des cartes mais ne permet
pas de construire son deck. On peut utiliser la pagination pour parcourir
les cartes. Ou utiliser la bar de recherche pour faire une recherche par nom.

Quand le state editing_mode est a false alors on est en mode view mode par défaut.

## Editing Mode

Il s'agit de la fonctionalité principal du deck builder. Elle regroupe plusieurs
fonctionalités:

- Selected card
- Change Deck Name
- Save Deck
- Mana Avg
- Cards Number

Ce mode à deux états. Le create_mode || update_mode. Selon leurs états,
les fonctionalités du  editing mode auront des comportements différents.

Par exemple, si

```javascript

update_mode = true;

```

alors le bouton sauvegarder va fetch


```
/api/update_deck

```
 plutot que

```
/api/create
```


## Selected Card

Cette fonctionalité permet 