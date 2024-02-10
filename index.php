<?php
/**
 *  An example CORS-compliant method.  It will allow any GET, POST, or OPTIONS requests from any
 *  origin.
 *
 *  In a production environment, you probably want to be more restrictive, but this gives you
 *  the general idea of what is involved.  For the nitty-gritty low-down, read:
 *
 *  - https://developer.mozilla.org/en/HTTP_access_control
 *  - https://fetch.spec.whatwg.org/#http-cors-protocol
 *
 */
function cors() {

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}

cors();

//if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
//    return "hello";
//}

define("ABSPATH", __DIR__ . "/");

require_once ABSPATH . "AltoRouter.php";

$json_data = file_get_contents("php://input");

$router = new AltoRouter();

$router->map('GET', '/', function () {
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $statement = $sqlite3->prepare("SELECT * FROM cards");
    $result = $statement->execute();

    $cards_arr = [];
    while ($cards_row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($cards_arr, $cards_row);
    }

    $json_cards = json_encode($cards_arr);

    header('Content-Type: application/json; charset=utf-8');
    echo $json_cards;
});

$router->map('POST', '/api/create', function () {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);
    $deck_name = $data["name"];
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $statement = $sqlite3->prepare("INSERT INTO Deck (name) VALUES(:na)");
    $statement->bindParam(":na", $deck_name, SQLITE3_TEXT);
    $statement->execute();

    $statement = $sqlite3->prepare("SELECT id FROM Deck ORDER BY id DESC LIMIT 1");
    $result = $statement->execute();
    $row_id = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($row_id, $row);
    }

    $row_id = $row_id[0];
    $row_id = $row_id["id"];

    $cards = $data["cards"];

    for ($idx = 0; $idx < count($cards); $idx++) {
        $card_id = $cards[$idx];
        $card_id = $card_id["id"];
        $statement = $sqlite3->prepare("INSERT INTO deck_composition (deck_id, card_id) VALUES (:deck_id, :card_id)");
        $statement->bindParam(":deck_id", $row_id, SQLITE3_TEXT);
        $statement->bindParam(":card_id", $card_id, SQLITE3_TEXT);
        $result = $statement->execute();
    }



    echo "Success";
});

$router->map('GET', '/api/deck_list', function () {
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $statement = $sqlite3->prepare("SELECT * FROM Deck");
    $result = $statement->execute();

    $deck_arr = [];
    while ($deck_row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($deck_arr, $deck_row);
    }

    $json_deck = json_encode($deck_arr);

    header('Content-Type: application/json; charset=utf-8');
    echo $json_deck;
});

$router->map('GET', '/api/edit_deck', function () {
    $id = $_GET["id"];
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $statement = $sqlite3->prepare("SELECT * FROM  cards INNER JOIN deck_composition ON cards.id = deck_composition.card_id WHERE deck_composition.deck_id = :id");
    $statement->bindParam(":id", $id, SQLITE3_TEXT);
    $result = $statement->execute();

    $deck_arr = [];
    while ($deck_row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($deck_arr, $deck_row);
    }

    $json_deck = json_encode($deck_arr);

    header('Content-Type: application/json; charset=utf-8');
    echo $json_deck;
});

$match = $router->match();
$match["target"]();


