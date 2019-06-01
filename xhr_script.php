<?php

require 'database_connect.php';

$action = $_GET['action'];
$object = $_GET['object'];
$username = $_GET['username'];
$object = json_decode($object);

if ($action == "getHighScores") {

    $sql="SELECT * FROM `gry_web_highscores` ";

    $result = mysqli_query($database,$sql);

    $highScoresArray= mysqli_fetch_all($result,MYSQLI_ASSOC);


    $resultObject = new stdClass();
    $resultObject->name = "getHigHscoresObject";
    $resultObject->message = "Pomyślnie pobrano highScoresy";
    $resultObject->highScoresArray = $highScoresArray;

    echo json_encode($resultObject);

}

if ($action == "addHighScores") {

    $now = date("Y-m-d H:i:s");

    $sql="INSERT INTO `gry_web_highscores` VALUES (NULL,$object->player_name,$object->player_score,$now)";

    $result = mysqli_query($database,$sql);

    $resultObject = new stdClass();
    $resultObject->name = "addHigHscoresObject";
    $resultObject->message = "Pomyślnie dodano highScoresy";
    echo json_encode($resultObject);

}
