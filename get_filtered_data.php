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

// Get date parameters from POST request
$start_date = isset($_POST['start_date']) ? $_POST['start_date'] : null;
$end_date = isset($_POST['end_date']) ? $_POST['end_date'] : null;

// Validate dates
if (!$start_date || !$end_date) {
    echo json_encode(['error' => 'Missing date parameters']);
    exit;
}

// Sanitize input
$start_date = $conn->real_escape_string($start_date);
$end_date = $conn->real_escape_string($end_date);

// Query filtered data at 2-hour intervals
$sql = "
SELECT 
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
FROM (
    SELECT 
        date,
        time,
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
        buitentemperatuur,
        ROW_NUMBER() OVER (PARTITION BY date, FLOOR(HOUR(time) / 4) ORDER BY time) AS rn
    FROM energy_data
    WHERE date BETWEEN '$start_date' AND '$end_date'
) t
WHERE rn = 1
ORDER BY date ASC, time ASC";

$result = $conn->query($sql);
$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ensure numeric values
        foreach ($row as $key => $value) {
            $row[$key] = is_numeric($value) ? (float)$value : $value;
        }
        $data[] = $row;
    }
} else {
    $data = ['error' => 'No data found for the selected date range'];
}

$conn->close();
echo json_encode($data, JSON_PRETTY_PRINT);
?>