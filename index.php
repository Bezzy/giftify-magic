<?php


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

define("ABSPATH", __DIR__ . "/");

require_once ABSPATH . "AltoRouter.php";
$json_data = file_get_contents("php://input");
$router = new AltoRouter();


$router->map('POST', '/api/create', function () {

    $lockFile = "lock.txt";
    file_put_contents($lockFile, "");

    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);
    $deck_name = $data["name"];
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $sqlite3->busyTimeout(5000);
    $statement = $sqlite3->prepare("INSERT INTO Deck (name) VALUES(:na)");
    $statement->bindParam(":na", $deck_name, SQLITE3_TEXT);
    $statement->execute();

    $statement = $sqlite3->prepare("SELECT id FROM Deck ORDER BY id DESC LIMIT 1");
    $result = $statement->execute();
    $deck_id = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($deck_id, $row);
    }

    $deck_id = $deck_id[0];
    $deck_id = $deck_id["id"];

    $cards = $data["cards"];

    for ($idx = 0; $idx < count($cards); $idx++) {
        $name = $cards[$idx]["name"];
        $mana_cost = $cards[$idx]["manaCost"];
        $cmc = $cards[$idx]["cmc"];
        $type = $cards[$idx]["type"];
        $text = $cards[$idx]["text"];
        $power = $cards[$idx]["power"];
        $toughness = $cards[$idx]["toughness"];
        $imageUrl = $cards[$idx]["imageUrl"];
        $id = $cards[$idx]["id"];
        $flavor = $cards[$idx]["flavor"];

        $statement = $sqlite3->prepare("INSERT INTO cards (name, manaCost, cmc, type, text, power, toughness, imageUrl, id, deck_id) VALUES (:name, :manaCost, :cmc, :type, :text, :power, :toughness, :imageUrl, :id, :deck_id)");
        $statement->bindParam(":name", $name, SQLITE3_TEXT);
        $statement->bindParam(":manaCost", $mana_cost, SQLITE3_TEXT);
        $statement->bindParam(":cmc", $cmc, SQLITE3_TEXT);
        $statement->bindParam(":type", $type, SQLITE3_TEXT);
        $statement->bindParam(":text", $text, SQLITE3_TEXT);
        $statement->bindParam(":power", $power, SQLITE3_INTEGER);
        $statement->bindParam(":toughness", $toughness, SQLITE3_INTEGER);
        $statement->bindParam(":imageUrl", $imageUrl, SQLITE3_TEXT);
        $statement->bindParam(":id", $id, SQLITE3_TEXT);
        $statement->bindParam(":deck_id", $deck_id, SQLITE3_INTEGER);
        $result = $statement->execute();
    }


    unlink($lockFile);
    $sqlite3->close();
    unset($sqlite3);



    echo "Success";
});

$router->map('POST', '/api/update_deck', function () {

    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $sqlite3->busyTimeout(5000);

    $deck_id = $data["id"];
    $statement = $sqlite3->prepare("DELETE FROM cards WHERE deck_id=:id");
    $statement->bindParam(":id", $deck_id, SQLITE3_TEXT);
    $statement->execute();


    $deck_name = $data["name"];

    $statement = $sqlite3->prepare("UPDATE Deck SET Name=:name WHERE id=:id");
    $statement->bindParam(":name", $deck_name, SQLITE3_TEXT);
    $statement->bindParam(":id", $deck_id, SQLITE3_TEXT);
    $statement->execute();

    $cards = $data["cards"];

    for ($idx = 0; $idx < count($cards); $idx++) {
        $name = $cards[$idx]["name"];
        $mana_cost = $cards[$idx]["manaCost"];
        $cmc = $cards[$idx]["cmc"];
        $type = $cards[$idx]["type"];
        $text = $cards[$idx]["text"];
        $power = $cards[$idx]["power"];
        $toughness = $cards[$idx]["toughness"];
        $imageUrl = $cards[$idx]["imageUrl"];
        $id = $cards[$idx]["id"];
        $flavor = $cards[$idx]["flavor"];

        $statement = $sqlite3->prepare("INSERT INTO cards (name, manaCost, cmc, type, text, power, toughness, imageUrl, id, deck_id) VALUES (:name, :manaCost, :cmc, :type, :text, :power, :toughness, :imageUrl, :id, :deck_id)");
        $statement->bindParam(":name", $name, SQLITE3_TEXT);
        $statement->bindParam(":manaCost", $mana_cost, SQLITE3_TEXT);
        $statement->bindParam(":cmc", $cms, SQLITE3_TEXT);
        $statement->bindParam(":type", $type, SQLITE3_TEXT);
        $statement->bindParam(":text", $text, SQLITE3_TEXT);
        $statement->bindParam(":power", $power, SQLITE3_TEXT);
        $statement->bindParam(":toughness", $toughness, SQLITE3_TEXT);
        $statement->bindParam(":imageUrl", $imageUrl, SQLITE3_TEXT);
        $statement->bindParam(":id", $id, SQLITE3_TEXT);
        $statement->bindParam(":deck_id", $deck_id, SQLITE3_TEXT);
        $result = $statement->execute();
    }

    $sqlite3->close();
    unset($sqlite3);


    echo "Success";
});

$router->map('GET', '/api/secret_delete', function () {
    
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $statement = $sqlite3->prepare("DELETE FROM cards");
    $statement->execute();

    $statement = $sqlite3->prepare("DELETE FROM Deck");
    $statement->execute();

    echo "Success";
});

$router->map('GET', '/api/deck_list', function () {
    // usleep(500000);

    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $sqlite3->busyTimeout(5000);
    $statement = $sqlite3->prepare("SELECT * FROM Deck");
    $result = $statement->execute();

    $deck_arr = [];
    while ($deck_row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($deck_arr, $deck_row);
    }

    $json_deck = json_encode($deck_arr);

    header('Content-Type: application/json; charset=utf-8');

    $sqlite3->close();
    unset($sqlite3);
    
    echo json_encode($deck_arr);
});

$router->map('GET', '/api/edit_deck', function () {
    $id = $_GET["id"];
    $sqlite3 = new SQLite3(ABSPATH . "data/db.sqlite", SQLITE3_OPEN_READWRITE);
    $sqlite3->busyTimeout(5000);
    $statement = $sqlite3->prepare("SELECT * FROM  cards WHERE cards.deck_id = :id");
    $statement->bindParam(":id", $id, SQLITE3_TEXT);
    $result = $statement->execute();

    $deck_arr = [];
    while ($deck_row = $result->fetchArray(SQLITE3_ASSOC)) {
        array_push($deck_arr, $deck_row);
    }

    $json_deck = json_encode($deck_arr);

    header('Content-Type: application/json; charset=utf-8');

    $sqlite3->close();
    unset($sqlite3);
    
    echo $json_deck;
});

$router->map("GET", "/", function() {

});


$match = $router->match();
$match["target"]();


