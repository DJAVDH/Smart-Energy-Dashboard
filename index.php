<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Energy Dashboard</title>
  <link rel="stylesheet" href="static/css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>

<body>

  <!-- Hoofdcontainer voor de pagina-indeling -->
  <div class="layout-container">
    <!-- Zijbalk navigatie -->
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
        <a href="#">
          <img src="static/images/settings.png" alt="icon" class="sidebar-icon" />
          Settings
        </a>
        <a href="filter.php">
          <img src="static/images/filter.png" alt="icon" class="sidebar-icon" />
          Filter
        </a>
      </nav>
    </div>

    <!-- Hoofdcontent rechts van de zijbalk -->
    <div class="main-panel">
      <!-- Titelbalk met dashboard titel en knoppen -->
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

      <!-- Rij met periodebalk en overzichtsinfo -->
      <div class="period-info-row">
        <!-- Periodebalk met knoppen -->
        <div class="period-selector-bar">
          <button class="period-btn period-btn-today active" data-period="day">Today</button>
          <button class="period-btn period-btn-month" data-period="month">Month</button>
          <button class="period-btn period-btn-year" data-period="year">Year</button>
        </div>
        <!-- Overzicht en datum -->
        <div class="overview-info">
          <span class="overview-title">Home Overview</span>
          <span class="overview-date" id="overview-date"></span>
        </div>
      </div>
      <!-- Grafieken voor home -->
      <section class="home-panel">
        <div class="chart-container">
          <h3 style="color: white;">Zonnepaneelspanning (V)</h3>
          <div class="canvas-wrapper">
            <canvas id="zonnepaneelSpanningChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="color: white;">Zonnepaneelstroom (A)</h3>
          <div class="canvas-wrapper">
            <canvas id="zonnepaneelStroomChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="color: white;">Waterstofproductie (L/u)</h3>
          <div class="canvas-wrapper">
            <canvas id="waterstofProductieChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="color: white;">Stroomverbruik woning (kW)</h3>
          <div class="canvas-wrapper">
            <canvas id="stroomverbruikWoningChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="color: white;">Luchtdruk (hPa)</h3>
          <div class="canvas-wrapper">
            <canvas id="luchtdrukChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="color: white;">luchtvochtigheid (%)</h3>
          <div class="canvas-wrapper">
            <canvas id="luchtvochtigheidChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="color: white;">CO2-concentratie (ppm)</h3>
          <div class="canvas-wrapper">
            <canvas id="co2Chart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <div class="canvas-wrapper">
            <canvas id="waterstofopslagChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <div class="canvas-wrapper">
            <canvas id="binnentemperatuurChart"></canvas>
          </div>
        </div>
      </section>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script type="module" src="charts.js"></script>
  <script type="module" src="js/toggle.js"></script>
</body>

</html>