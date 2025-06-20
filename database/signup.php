<?php
session_start();
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get user input safely
    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    // Basic validation
    if (strlen($username) < 3 || strlen($password) < 6) {
        die("Username must be at least 3 chars and password at least 6 chars, dumbass.");
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        die("Username already taken, pick a better one.");
    }
    $stmt->close();

    // Hash that damn password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashedPassword);

    if ($stmt->execute()) {
        // Optional: Log the user in immediately
        $_SESSION["user_id"] = $stmt->insert_id;
        header("Location: ../login.php"); // Redirect after signup
        exit;
    } else {
        die("Failed to create user. Database puked.");
    }

    $stmt->close();
    $conn->close();
} else {
    die("You can only POST to this endpoint. Stop hacking.");
}
?>
