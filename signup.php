<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <link rel="stylesheet" href="static/css/login-style.css">
</head>
<body class="gradient-background">


<!-- Login container -->
<div class="login-container">

    <!-- Logo en titel -->
    <div class="logo-section">
        <h1>ZenEnergy</h1>
        <img src="static/images/bolt.png" alt="Logo" class="logo" />
    </div>

    <!-- Signup box -->
    <div class="login-box">
        <h2>Sign up</h2>

        <!-- Signup formulier -->
        <form method="POST" action="database/signup.php">

            <!-- Gebruikersnaam invoerveld -->
            <label>Username</label>
            <input type="text" name="username" placeholder="Type a username" required>

            <!-- Wachtwoord invoerveld -->
            <label>Password</label>
            <input type="password" name="password" placeholder="Type a password" required>

            <!-- Signup knop -->
            <button type="submit">Sign up</button>
        </form>

        <!-- Link naar login pagina -->
        <p class="signup-text">
            Already have an account? <a href="login.php">Log in</a>
        </p>
    </div>
</div>

