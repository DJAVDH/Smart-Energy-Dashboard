<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'energy';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Updated SQL query to include waterstofopslag_auto and waterstofverbruik_auto
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
    waterstofopslag_woning,
    waterstofopslag_auto,
    waterstofverbruik_auto
FROM energy_data
ORDER BY date DESC, time DESC
LIMIT 1";

$result = $conn->query($sql);
$data = [];

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    foreach ($data as $key => $value) {
        $data[$key] = is_numeric($value) ? (float)$value : $value;
    }
} else {
    $data = ['error' => 'No data found'];
}

$conn->close();
echo json_encode($data, JSON_PRETTY_PRINT);
?>