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
    date, 
    AVG(zonnepaneelspanning) AS zonnepaneelspanning,
    AVG(zonnepaneelstroom) AS zonnepaneelstroom,
    AVG(waterstofproductie) AS waterstofproductie,
    AVG(stroomverbruik_woning) AS stroomverbruik_woning,
    AVG(luchtdruk) AS luchtdruk,
    AVG(luchtvochtigheid) AS luchtvochtigheid,
    AVG(co2_concentratie_binnen) AS co2_concentratie_binnen,
    AVG(binnentemperatuur) AS binnentemperatuur,
    AVG(buitentemperatuur) AS buitentemperatuur

FROM energy_data
WHERE date >=CURDATE() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date DESC
";

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
