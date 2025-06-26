<?php
header('Content-Type: application/json');

// Database verbinding
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'energy';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Laatste 5 metingen ophalen
$sql = "SELECT 
    CONCAT(date, ' ', time) AS datetime,
    zonnepaneelspanning,
    zonnepaneelstroom,
    waterstofproductie,
    stroomverbruik_woning,
    luchtdruk,
    luchtvochtigheid,
    accuniveau,
    co2_concentratie_binnen,
    waterstofopslag_woning,
    waterstofopslag_auto,
    waterstofverbruik_auto,
    binnentemperatuur,
    buitentemperatuur
FROM energy_data
ORDER BY date DESC, time DESC
LIMIT 6";

$result = $conn->query($sql);
$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Zorg dat alles numeriek is als het kan
        foreach ($row as $key => $value) {
            $row[$key] = is_numeric($value) ? (float)$value : $value;
        }
        $data[] = $row;
    }
    // Draai om zodat oudste meting eerst is
    $data = array_reverse($data);
} else {
    $data = ['error' => 'No data found'];
}

$conn->close();
echo json_encode($data, JSON_PRETTY_PRINT);
