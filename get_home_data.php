<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$user = 'root'; // Change if your MySQL user is different
$pass = ''; // Change if your MySQL password is set
$db = 'energy';

// ----- Accuniveau ophalen ------
// Maak verbinding met de database en anders niet
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} // selecteer accuniveau van data en order het van het laatste resultaat..
$sql = "SELECT accuniveau FROM energy_data ORDER BY date DESC, time DESC LIMIT 1";
$result = $conn->query($sql); // slaat het result van de query op

$accuniveau = null;

// Controleer of er resultaten zijn
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $accuniveau = (float)$row['accuniveau']; // Zorg ervoor dat accuniveau een float is
}

// sluit database verbinding
$conn->close();
//stuur accuniveau data als JSON terug
echo json_encode(['accuniveau' => $accuniveau], JSON_PRETTY_PRINT);
