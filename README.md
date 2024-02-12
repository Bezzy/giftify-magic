To access the application, simply go to this address:

```
195.15.206.94
```

Here is a link that shows the interaction with the application and its various features.

[Lien de la vidéo](https://drive.google.com/file/d/1O2RPyVrVJh1-6WnsibLhVXc4EByQ4rEd/view?usp=sharing)

# Frontend


The frontend is located in the ./public directory and consists of two files: index.html and index.js.

The CSS part is directly included in the index.html file inline.

The application uses the following dependencies:

React
Tailwind CSS
Babel
All three are used with a CDN. The folder structure is therefore very simple. The reason is that I did not plan to make so many modifications to the project. So, I didn't bother setting up a development environment. In the end, that's what I should have done because I ended up setting up an entire server.

The application uses React. The choice to use React came naturally to manage an application as reactive as a Deck Builder.

Initially, I wanted to do all the rendering on the server side with SSR (Server Side Rendering). But then, I preferred a more interactive interface that responds live to changes from the backend. This provides a more immersive experience but has the disadvantage of needing to structure the backend and frontend to synchronize state changes.

Overall, the front end is structured as follows:

A list of global states to dynamically manage different interface states. Are we in creating or updating mode? The number of cards in the deck... There is no router. Any interface change is done by checking the value of a global state: is_updating_mode, is_create_mode... This has the advantage of controlling the interface at a very precise level but has the disadvantage of complicating the logic. To manage states, I don't use a state manager, but if I were to use a library, it would be Zustand.

A component part, which defines the different elements of the interface.

An API fetch part, which aims to fetch the two APIs used: the Magic API and the backend API. Fetching data is generally done by triggering an event or a state of the application. The application states define which data we will request. For example, when we click on save the deck, if we are in update_mode, then we will query /update_deck, but if we are in create_mode, then we will query /create_deck



# Backend

The backend part is also very simple. It uses a routing system (Altorouter) to manage the different API accesses and communicates data via JSON.

The API is very primitive and is divided as follows.


| Api Action    | Description                       | Action Url         |
|---------------|-----------------------------------|--------------------|
| create        | Save the new deck in db           | /api/create        |
| update_deck   | update the selected deck in db    | /api/update_deck   |
| deck_list     | return a list of all deck from db | /api/deck_list     |
| edit_deck     | return cards from deck            | /api/edit_deck     |
| secret_delete | Delete everything from db         | /api/secret_delete |

# DB


The database I use to persist Magic API data is SQLite3. There are two important tables: the "cards" table and the "deck" table. The "cards" table contains the game's cards and their attributes (mana, power...). Each card in the "cards" table contains the ID of the deck to which it belongs. This allows for the connection between the deck and its cards. The deck itself contains just the deck's name and the number of cards in the deck.

The "cards" table

| name | manaCost | cmc | type | text | power | toughness | imageUrl | flavor | id | id_deck | id_card |
|------|----------|-----|------|-----:|-------|-----------|----------|--------|----|---------|---------|
|      |          |     |      |      |       |           |          |        |    |         |         |

La table Deck

| Name | cards_numbers | id |
|------|---------------|----|
|      |               |    |


# Features

## Common Features

These functionalities persist between the view mode and the editing mode.

- Card List
- Pagination
- Search

## View mode


This configuration allows browsing through all the cards but does not enable building a deck. Pagination can be used to navigate through the cards. Alternatively, the search bar can be used to search by name.

When the editing_mode state is false, we are in view mode by default.

## Editing Mode

This is the main functionality of the deck builder. It encompasses several features:

- Add card
- Change Deck Name
- Save Deck
- Mana Avg
- Discard


This mode has two states: the create_mode or update_mode. Depending on their states, the functionalities of the editing mode will behave differently.

For example, if

```javascript
update_mode = true;
```

In this case, the "save" button will fetch

```
/api/update_deck

```
 instead of

```
/api/create
```


## Add  Card
This feature allows adding a card to a deck or removing it. You cannot add more than 30 cards to the deck.

## Change Deck Name
This feature allows changing the name of the deck.

## Save Deck
This feature allows saving the modifications made to the deck or creating a new deck.

## Mana Avg
This feature calculates the average mana of the deck while filtering out land cards.

## Discard
This feature resets all states. If the data has not been saved, it will not be recorded.

# Common Features
These features persist between the view mode and the editing mode.
- Card List
- Pagination
- Search

## Card List
Lists the cards and visually indicates whether they belong to the deck or not.


## Pagination
Allows navigation between different cards from the Magic API.

## Search
Enables searching by name in the Magic API.

# Components
The interface is divided into several components to represent the different states of the application.


# Table of Components and Attributes:

| Component        | Associated Features                    | Request Data                                              | Use State                         | Changed State                                                                   | Component Childs                  |
|------------------|----------------------------------------|-----------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------|-----------------------------------|
| NewDeckButton    | Create New Deck                        | none                                                      | none                              | create_deck_mode create_mode is_update_mode new_deck                            | none                              |
| DeckStats        | Calculate Avg Mana Count Cards in Deck | none                                                      | avg_cmc cards_number_deck         |                                                                                 | none                              |
| BtnHeaderBack    | Discard Changes                        | api/deck_list                                             | none                              | editing_mode create_deck_mode is_update_mode cards roll_options_toggle new_deck | none                              |
| SaveBtn          | Save Deck Discard Changes              | /api/create or /api/update_deck                           | none                              | Same As BtnHeaderBack                                                           | none                              |
| Deck_Button      | Toggle Options                         | none                                                      | new_deck.name roll_options_toggle | roll_options_toggle                                                             | none                              |
| Selected         | Selected Card                          | none                                                      | card.is_selected                  | none                                                                            | none                              |
| Roll_Options     | Save Deck Name                         | none                                                      | none                              | new_deck                                                                        | none                              |
| Card_Container   | none                                   | none                                                      | card.name                         | none                                                                            | none                              |
| Deck_Editing_Bar | none                                   | none                                                      | roll_options_toggle card          | none                                                                            | DeckStats NewDeckButton Deck_List |
| Deck_List        | none                                   | none                                                      | deck_list                         | none                                                                            | Deck_Button                       |
| Pagination       | Pagination                             | /cards?page=(pagination + 1) /cards?page=(pagination - 1) | none                              | cards pagination                                                                | none                              |


# Table of States

| State               | Type   | Description                                               |
|---------------------|--------|-----------------------------------------------------------|
| cards               | Json   | Used to hold all the cards from the current pagination    |
| filtering_cards     | Json   | Used to hold filtering cards in context                   |
| create_deck_mode    | Bool   | Used to set the application in creating mode              |
| editing_mode        | Bool   | Used to set the application in editing mode               |
| current_deck        | Json   | Hold the current deck in use                              |
| new_deck            | Json   | Used to hold the state of the deck                        |
| deck_list           | Json   | Used to hold the list of all decks in DB                  |
| avg_cmc             | Number | Used to hold the state of the avg cmc of the current deck |
| is_update_mode      | Bool   | Used to set the application in update mode                |
| pagination          | Number | Used to hold the current pagination number                |
| roll_options_toggle | Bool   | Used to toggle the options of the deck                    |
| deck_name           | String | Used to hold the name of the deck                         |
| search_val          | String | Used to hold the value of the search bar                  |
| Cards_number_deck   | Number | Used to hold the number of cards in a deck                |


# Note

I focused on developing the functionalities rather than having the cleanest code.

After this phase where I outline the features, I take the time to really think about how to structure my code. It's also in this phase that I deeply debug and make the code more robust.

The code presented is therefore a prototype.

##  Misc

I always code a debugger within the scope of my mouse pointer. It's an essential tool for me.

The second essential tool is a profiler. I always measure the speed of my code. But I conduct a thorough analysis when I see a bottleneck.

For PHP, I use PHPStorm for debugging and profiling, and for JavaScript, I use Chrome's development tool.
