<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Energy Dashboard</title>
  <link rel="stylesheet" href="static/css/filterstyle.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body>
  <div class="layout-container">
    <!-- Sidebar -->
    <div class="sidebar-nav">
      <div class="sidebar-logo-section">
        <h1>ZenEnergy</h1>
        <img src="static/images/bolt.png" alt="Logo" class="sidebar-logo" />
      </div>
      <nav class="sidebar-links">
        <a href="index.php">
          <img src="static/images/home.png" alt="icon" class="sidebar-icon" />
          Home Overview
        </a>
        <a href="car.php">
          <img src="static/images/car.png" alt="icon" class="sidebar-icon" />
          Car Overview
        </a>
        <a href="settings.php">
          <img src="static/images/settings.png" alt="icon" class="sidebar-icon" />
          Settings
        </a>
        <a href="filter.php">
          <img src="static/images/filter.png" alt="icon" class="sidebar-icon" />
          Filter
        </a>
      </nav>
    </div>

    <!-- Main panel -->
    <div class="main-panel">
      <!-- Header dashboard title and icons -->
      <div class="dashboard-header-row">
        <span class="dashboard-title-label">
          Energy Dashboard
        </span>
        <span class="dashboard-header-icons">
          <a href="login.php">
            <img src="static/images/profile.png" alt="Profiel" class="dashboard-header-icon" />
          </a>
          <a href="settings.php">
            <img src="static/images/settings.png" alt="Instellingen" class="dashboard-header-icon" />
          </a>
        </span>
      </div>

      <!-- Filter -->
      <form class="filter-bar" id="filter-form">
        <div class="form-group">
          <label for="start-date">From:</label>
          <input type="date" id="start-date" name="start-date" />
        </div>
        <div class="form-group">
          <label for="end-date">To:</label>
          <input type="date" id="end-date" name="end-date" />
        </div>
        <button type="submit" class="apply-button">Apply Filter</button>
      </form>

      <!-- Charts container -->
      <div class="charts-container">
        <div class="chart-card">
          <canvas id="zonnepaneelSpanningChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="zonnepaneelStroomChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="waterstofProductieChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="stroomverbruikWoningChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="luchtdrukChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="luchtvochtigheidChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="co2Chart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="waterstofVerbruikAutoChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="binnentemperatuurChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="buitentemperatuurChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="charts.js"></script>
  <script type="module" src="filter_charts.js"></script>
</body>
</html>