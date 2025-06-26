const charts = {} // object om alle charts in op te slaan

// functie voor lijn-grafieken
export function createLineChart(id, label, labels, dataPoints, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return; // als er geen canvas met id is, word dat gelogt en wordt de chart niet gemaakt

  if (charts[id]) { // als er al een chart met dit id bestaat, word deze eerst verwijderd
    charts[id].destroy();
  }

  charts[id] = new Chart(canvas, { // charts.js functies
    type: 'line',
    data: {
      labels: labels, // tijdstempels
      datasets: [{
        label: label,
        data: dataPoints,
        borderColor: color,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// functie voor bar grafiek
export function createBarChart(id, label, labels, dataPoints, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return; // als er geen canvas met id is, word dat gelogt en wordt de chart niet gemaakt

  if (charts[id]) { // als er al een chart met dit id bestaat, word deze eerst verwijderd
    charts[id].destroy();
  }

  charts[id] = new Chart(canvas, { // charts.js functies
    type: 'bar',
    data: {
      labels: labels, // tijdstempels
      datasets: [{
        label: label,
        data: dataPoints,
        backgroundColor: color
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// const voor het maken van de grafieken
const createChartIfExists = (id, config) => {
  const canvas = document.getElementById(id);

  // als er geen canvas met id is, word dat gelogt en wordt de chart niet gemaakt
  if (!canvas){
    console.warn(`Canvas met ID '${id}' niet gevonden. Chart wordt niet gemaakt.`);
    return;
  }

  // als er al een chart met dit id bestaat, word deze eerst verwijderd en daarna de nieuwe chart gemaakt
  if(charts[id]){
    charts[id].destroy();
    console.log('Verwijderde bestaande chart:', id);
  }

  // maak de nieuwe chart met de gegeven config
  charts[id] = new Chart(canvas, config);
  console.log('Gemaakte chart:', id);
};
  
export async function loadHomeData() {
  const chartContainers = document.querySelectorAll('.chart-container');
  chartContainers.forEach(container => {
    container.style.display = 'block';
    document.getElementById('year-msg').style.display = 'none';

  });
  try {
    const response = await fetch('get_home_data.php');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // consoles voor debugging en beter overzicht
    console.log("waterstofproductie:", data.map(entry => entry.waterstofproductie));
    console.log("co2_concentratie_binnen:", data.map(entry => entry.co2_concentratie_binnen));
    console.log("waterstofverbruik_auto:", data.map(entry => entry.waterstofverbruik_auto));
    console.log("accuniveau:", data.map(entry => entry.accuniveau));
    console.log("waterstofopslag_auto:", data.map(entry => entry.waterstofopslag_auto));
    console.log("waterstofverbruik_auto:", data.map(entry => entry.waterstofverbruik_auto));
    console.log("waterstofopslag_woning:", data.map(entry => entry.waterstofopslag_woning));
    console.log("zonnepaneelspanning:", data.map(entry => entry.zonnepaneelspanning));
    console.log("zonnepaneelstroom:", data.map(entry => entry.zonnepaneelstroom));
    console.log("stroomverbruik_woning:", data.map(entry => entry.stroomverbruik_woning));
    console.log("luchtdruk:", data.map(entry => entry.luchtdruk));
    console.log("luchtvochtigheid:", data.map(entry => entry.luchtvochtigheid));
    console.log("datetime:", data.map(entry => entry.datetime));

    const latestData = data[data.length - 1]; // alleen data voor gauges, dit pakt maar 1 data ipv 5
    
    const labels = data.map(entry => entry.datetime.split(' ')[1].slice(0, 5)); // verwijderd dag en houd alleen de tijd (00:00)
    createBarChart('waterstofProductieChart', 'Waterstofproductie (L/u)', labels, data.map(entry => entry.waterstofproductie), '#00BCD4');
    createBarChart('co2Chart', 'CO2-concentratie binnen (ppm)', labels, data.map(entry => entry.co2_concentratie_binnen), data.map(entry => entry.co2_concentratie_binnen > 1000 ? '#F44336' : '#8BC34A'));
    createBarChart('waterstofVerbruikAutoChart', 'Waterstofverbruik auto (%)', labels, data.map(entry => entry.waterstofverbruik_auto), data.map(entry => entry.waterstofverbruik_auto > 50 ? '#F44336' : '#8BC34A'));
    createBarChart('binnentemperatuurChart', 'Binnentemperatuur (°C)', labels, data.map(entry => entry.binnentemperatuur), '#FF9800');
    createBarChart('buitentemperatuurChart', 'Buitentemperatuur (°C)', labels, data.map(entry => entry.buitentemperatuur), '#FF9800');

    // Car charts (accuGaugeChart, waterstofopslagAutoChart)
    if (window.location.pathname.includes('car.php')) {
      // Accu Gauge Chart
      if (latestData && typeof latestData.accuniveau !== 'undefined') {
        createChartIfExists('accuGaugeChart', {
          type: 'doughnut',
          data: {
            labels: ['Huidig niveau', 'Leeg'],
            datasets: [{
              data: [latestData.accuniveau, 100 - latestData.accuniveau],
              backgroundColor: [latestData.accuniveau > 20 ? '#4CAF50' : '#FF6347', '#E0E0E0'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            rotation: -90,
            circumference: 180,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Accuniveau',
                font: { size: 20 },
                color: '#ffffff'
              }
            }
          }
        });
      } else {
        console.warn('accuniveau data missing');
      }

      // Waterstofopslag Auto Chart
      if (typeof latestData.waterstofopslag_auto !== 'undefined') {
        createChartIfExists('waterstofopslagAutoChart', {
          type: 'doughnut',
          data: {
            labels: ['H₂ opgeslagen', 'Leeg'],
            datasets: [{
              data: [latestData.waterstofopslag_auto, 100 - latestData.waterstofopslag_auto],
              backgroundColor: ['#009688', '#E0E0E0'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            rotation: -90,
            circumference: 180,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Waterstofopslag auto',
                font: { size: 20 },
                color: '#ffffff'
              }
            }
          }
        });
      } else {
        console.warn('waterstofopslag_auto data missing');
      }
    }

    if (!window.location.pathname.includes('car.php')) { // Alleen voor index.php. als window.location.pathname niet car.php bevat: voer dit uit
        // Check of we meerdere datapunten hebben
      if (Array.isArray(data)) {
          // Toon lijn-grafieken
          createLineChart('zonnepaneelSpanningChart', 'Zonnepaneelspanning (V)', labels, data.map(entry => entry.zonnepaneelspanning), '#2196F3');
          createLineChart('zonnepaneelStroomChart', 'Zonnepaneelstroom (A)', labels, data.map(entry => entry.zonnepaneelstroom), '#4CAF50');
          createLineChart('stroomverbruikWoningChart', 'Stroomverbruik woning (kW)', labels, data.map(entry => entry.stroomverbruik_woning), '#FFC107');
          createLineChart('luchtdrukChart', 'Luchtdruk (hPa)', labels, data.map(entry => entry.luchtdruk), '#9C27B0');
          createLineChart('luchtvochtigheidChart', 'Luchtvochtigheid (%)', labels, data.map(entry => entry.luchtvochtigheid), '#03A9F4');
          createLineChart('buitentemperatuurChart', 'Buitentemperatuur (°C)', labels, data.map(entry => entry.buitentemperatuur), '#FF9800');
        }

        if (latestData && typeof latestData.waterstofopslag_woning !== 'undefined') {
          createChartIfExists('waterstofopslagChart', {
            type: 'doughnut',
            data: {
              labels: ['H₂ opgeslagen', 'Leeg'],
              datasets: [{
                data: [latestData.waterstofopslag_woning, 100 - latestData.waterstofopslag_woning],
                backgroundColor: ['#009688', '#E0E0E0'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              rotation: -90,
              circumference: 180,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Waterstofopslag woning',
                  font: { size: 20 },
                  color: '#ffffff'
                }
              }
            }
          });
        } else {
          console.warn('waterstofopslag_woning data missing');
        }
    }
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

export async function loadMonthlyData() {
  const chartContainers = document.querySelectorAll('.chart-container');
  chartContainers.forEach(container => {
    container.style.display = 'block';
    document.getElementById('year-msg').style.display = 'none';

  });
  try {
    const response = await fetch('get_month_data.php');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const monthlyData = await response.json();

    if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
      console.warn('No monthly data available');
      return;
    }

    // labels voor de maandelijkse grafieken
    const labels = monthlyData.map(entry => entry.date);

    createLineChart('zonnepaneelSpanningChart', 'Gem. zonnepaneelspanning (V)', labels, monthlyData.map(e => e.zonnepaneelspanning), '#3F51B5');
    createLineChart('zonnepaneelStroomChart', 'Gem. zonnepaneelstroom (A)', labels, monthlyData.map(e => e.zonnepaneelstroom), '#4CAF50');
    createBarChart('waterstofProductieChart', 'Gem. waterstofproductie (L/u)', labels, monthlyData.map(e => e.waterstofproductie), '#00BCD4');
    createLineChart('stroomverbruikWoningChart', 'Gem. stroomverbruik woning (kW)', labels, monthlyData.map(e => e.stroomverbruik_woning), '#FF9800');
    createLineChart('luchtdrukChart', 'Gem. luchtdruk (hPa)', labels, monthlyData.map(e => e.luchtdruk), '#9C27B0');
    createLineChart('luchtvochtigheidChart', 'Gem. luchtvochtigheid (%)', labels, monthlyData.map(e => e.luchtvochtigheid), '#03A9F4');
    createBarChart('co2Chart', 'Gem. CO₂ binnen (ppm)', labels, monthlyData.map(e => e.co2_concentratie_binnen), '#8BC34A');
    createBarChart('waterstofVerbruikAutoChart', 'Gem. waterstofverbruik auto (%)', labels, monthlyData.map(e => e.waterstofverbruik_auto), '#F44336');
    createBarChart('binnentemperatuurChart', 'Gem. binnentemperatuur (°C)', labels, monthlyData.map(e => e.binnentemperatuur), '#FF9800');
    createBarChart('buitentemperatuurChart', 'Gem. buitentemperatuur (°C)', labels, monthlyData.map(e => e.buitentemperatuur), '#FF9800');
  } catch (error) {
    console.error('Error fetching monthly data:', error);
  }
}

export async function loadYearData() {
  // 1. Verwijder alle bestaande charts
  for (let id in charts) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
      console.log(`Chart met ID '${id}' vernietigd.`);
    }
  }

  // 2. Verberg alle grafiekcontainers
  const chartContainers = document.querySelectorAll('.chart-container');
  chartContainers.forEach(container => {
    container.style.display = 'none';
  });

  // 3. Toon een melding dat er geen jaargegevens zijn
  // alert("Niet genoeg gegevens voor een jaaroverzicht.");
  document.getElementById('year-msg').style.display = 'block';
}