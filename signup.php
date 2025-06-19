<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <link rel="stylesheet" href="static/css/login-style.css">
</head>
<body class="gradient-background">


  <div class="login-container">
       <div class="logo-section">
        <h1>ZenEnergy</h1>
        <img src="static/images/bolt.png" alt="Logo" class="logo" />
      </div>
     <div class="login-box">
         <h2>Sign up</h2>
      <form method="POST" action="database/signup.php">
        <label>Username</label>
        <input type="text" name="username" placeholder="Type your username" required>

        <label>Password</label>
        <input type="password" name="password" placeholder="Type your password" required>

        <button type="submit">Sign up</button>
</form>
      <p class="signup-text">
        Already have an account? <a href="login.php">Log in</a>
      </p>
    </div>
  </div>
</body>
</html>
