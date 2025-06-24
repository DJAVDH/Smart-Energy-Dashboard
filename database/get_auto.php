<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection settings
$servername = "localhost";
$username = "root"; // Replace with your MySQL username
$password = ""; // Replace with your MySQL password
$dbname = "energy";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch waterstofverbruik_auto, DATE, and TIME for 2025-06-14
$sql = "SELECT waterstofverbruik_auto, DATE, TIME FROM energy_data WHERE DATE = '2025-06-14' ORDER BY TIME ASC";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Output data as JSON
header('Content-Type: application/json');
echo json_encode($data);

// Close connection
$conn->close();
?>