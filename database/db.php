<?php
$host = "localhost";
$user = "root"; // default for XAMPP
$pass = "";     // default is empty unless you changed it
$dbname = "zen";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>