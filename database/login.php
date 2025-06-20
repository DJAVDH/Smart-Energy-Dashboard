<?php
session_start();
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Use prepared statement to avoid SQL injection
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        // Assuming passwords are hashed
        if (password_verify($password, $row["password"])) {
            $_SESSION["user_id"] = $row["id"];
            header("Location: ../index.php"); // or wherever you wanna go
            exit;
        } else {
            echo "Wrong password ya goof.";
        }
    } else {
        echo "Username doesn’t exist bruh.";
    }

    $stmt->close();
    $conn->close();
}
