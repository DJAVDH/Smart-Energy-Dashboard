<?php
// Database connection
$host = 'localhost';
$user = 'root'; // Change if your MySQL user is different
$pass = ''; // Change if your MySQL password is set
$db = 'energy';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read JSON file
$jsonData = json_decode(file_get_contents('energy_data.json'), true);

if ($jsonData === null) {
    die("Error reading JSON: " . json_last_error_msg());
}

// Prepare insert statement
$stmt = $conn->prepare("
    INSERT INTO energy_data (
        zonnepaneelspanning, zonnepaneelstroom, waterstofproductie,
        stroomverbruik_woning, waterstofverbruik_auto, buitentemperatuur,
        binnentemperatuur, luchtdruk, luchtvochtigheid, accuniveau,
        co2_concentratie_binnen, waterstofopslag_woning, waterstofopslag_auto,
        date, time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Check if prepare failed
if ($stmt === false) {
    die("Prepare failed: " . $conn->error);
}

// Loop through JSON data
foreach ($jsonData as $row) {
    // Ensure all fields exist, default to NULL if missing
    $zonnepaneelspanning = isset($row['zonnepaneelspanning']) ? floatval($row['zonnepaneelspanning']) : null; // is the value present in data? if yes, convert to float, if no, set to null
    $zonnepaneelstroom = isset($row['zonnepaneelstroom']) ? floatval($row['zonnepaneelstroom']) : null;
    $waterstofproductie = isset($row['waterstofproductie']) ? floatval($row['waterstofproductie']) : null;
    $stroomverbruik_woning = isset($row['stroomverbruik_woning']) ? floatval($row['stroomverbruik_woning']) : null;
    $waterstofverbruik_auto = isset($row['waterstofverbruik_auto']) ? floatval($row['waterstofverbruik_auto']) : null;
    $buitentemperatuur = isset($row['buitentemperatuur']) ? floatval($row['buitentemperatuur']) : null;
    $binnentemperatuur = isset($row['binnentemperatuur']) ? floatval($row['binnentemperatuur']) : null;
    $luchtdruk = isset($row['luchtdruk']) ? floatval($row['luchtdruk']) : null;
    $luchtvochtigheid = isset($row['luchtvochtigheid']) ? floatval($row['luchtvochtigheid']) : null;
    $accuniveau = isset($row['accuniveau']) ? floatval($row['accuniveau']) : null;
    $co2_concentratie_binnen = isset($row['co2_concentratie_binnen']) ? floatval($row['co2_concentratie_binnen']) : null;
    $waterstofopslag_woning = isset($row['waterstofopslag_woning']) ? floatval($row['waterstofopslag_woning']) : null;
    $waterstofopslag_auto = isset($row['waterstofopslag_auto']) ? floatval($row['waterstofopslag_auto']) : null;
    $date = isset($row['date']) ? $row['date'] : null;
    $time = isset($row['time']) ? $row['time'] : null;

    // Bind parameters
    $stmt->bind_param(
        'ddddddddddddsss', // double for float values, s for string values. 
        $zonnepaneelspanning,
        $zonnepaneelstroom,
        $waterstofproductie,
        $stroomverbruik_woning,
        $waterstofverbruik_auto,
        $buitentemperatuur,
        $binnentemperatuur,
        $luchtdruk,
        $luchtvochtigheid,
        $accuniveau,
        $co2_concentratie_binnen,
        $waterstofopslag_woning,
        $waterstofopslag_auto,
        $date,
        $time
    );

    // Execute and check for errors
    if (!$stmt->execute()) {
        echo "Error inserting row: " . $stmt->error . "<br>";
    }
}

$stmt->close();
$conn->close();
echo "JSON imported into database successfully!";
?>