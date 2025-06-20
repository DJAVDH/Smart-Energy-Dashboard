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
$sql = "SELECT 
    date, time,
    zonnepaneelspanning,
    zonnepaneelstroom,
    waterstofproductie,
    stroomverbruik_woning,
    luchtdruk,
    luchtvochtigheid,
    accuniveau,
    co2_concentratie_binnen,
    waterstofopslag_woning
FROM energy_data
ORDER BY date DESC, time DESC
LIMIT 1";

$result = $conn->query($sql); // slaat het result van de query op

$data = [];

// Controleer of er resultaten zijn
if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    foreach ($data as $key => $value) {
        $data[$key] = is_numeric($value) ? (float)$value : $value;
    }
}

// sluit database verbinding
$conn->close();
//stuur accuniveau data als JSON terug
echo json_encode($data, JSON_PRETTY_PRINT);
