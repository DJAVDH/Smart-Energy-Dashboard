<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Energy Dashboard</title>
  
  <link rel="stylesheet" href="static/css/filterstyle.css" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@400&display=swap" rel="stylesheet">
</head>
<body>

  <div class="sidebar">
    <div class="logo-section">
      <h1>ZenEnergy</h1> 
      <img src="static/images/bolt.png" alt="Logo" class="logo" />
    </div>
    <nav class="nav-links">
      <a href="index.php">
        <img src="static/images/home.png" alt="icon" class="icon" />
        Home Overview
      </a>
      <a href="car.php">
        <img src="static/images/car.png" alt="icon" class="icon" />
        Car Overview
      </a>
      <a href="settings.php">
        <img src="static/images/settings.png" alt="icon" class="icon" />
        Settings
      </a>
      <a href="filter.php">
        <img src="static/images/filter.png" alt="icon" class="icon" />
        Filter
      </a>
    </nav>
  </div>

  <main class="main-content">
      <header class="header">
        <img src="static/images/profile.png" alt="User" class="dashboard-header-icon">
        <img src="static/images/settings.png" alt="Settings" class="dashboard-header-icon">
      </header>

      <div class="filter-section">
          <h1>Filter by date</h1>
          <form class="filter-form">
              <div class="form-group">
                  <label for="start-date">From:</label>
                  <input type="date" id="start-date" name="start-date">
              </div>
              <div class="form-group">
                  <label for="end-date">To:</label>
                  <input type="date" id="end-date" name="end-date">
              </div>
              <button type="submit" class="apply-button">
                  Apply Filter
              </button>
          </form>
      </div>
  </main>

</body>
</html>
