document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('get_home_data.php');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Log data for debugging
    console.log('Fetched data:', data);
    if (data.error) {
      console.error('Error:', data.error);
      return;
    }

    // Helper function to create chart only if canvas exists
    const createChartIfExists = (id, config) => {
      const canvas = document.getElementById(id);
      if (canvas) {
        console.log(`Creating chart for ${id}`);
        new Chart(canvas, config);
      } else {
        console.warn(`Canvas with ID '${id}' not found. Skipping chart creation.`);
      }
    };

    const latestData = data[data.length - 1]; // alleen data voor gauges

    // functie voor lijngrafiek
    function createLineChart(id, label, labels, dataPoints, color) {
        const canvas = document.getElementById(id);
        if (!canvas) return;
      
        new Chart(canvas, {
          type: 'line',
          data: {
            labels: labels, // tijdstempels
            datasets: [{
              label: label,
              data: dataPoints,
              borderColor: color,
              fill: false,
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
    function createBarChart(id, label, labels, dataPoints, color) {
        const canvas = document.getElementById(id);
        if (!canvas) return;
      
        new Chart(canvas, {
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
      const labels = data.map(entry => entry.datetime.split(' ')[1].slice(0, 5)); // verwijderd dag en houd alleen de tijd (00:00)
      createBarChart('waterstofProductieChart', 'Waterstofproductie (L/u)', labels, data.map(entry => entry.waterstofproductie), '#00BCD4');
      createBarChart('co2Chart', 'CO2-concentratie binnen (ppm)', labels, data.map(entry => entry.co2_concentratie_binnen), data.map(entry => entry.co2_concentratie_binnen > 1000 ? '#F44336' : '#8BC34A'));
      createBarChart('waterstofVerbruikAutoChart', 'Waterstofverbruik auto (%)', labels, data.map(entry => entry.waterstofverbruik_auto), data.map(entry => entry.waterstofverbruik_auto > 50 ? '#F44336' : '#8BC34A'));

    // Car charts (accuGaugeChart, waterstofopslagAutoChart, waterstofVerbruikAutoChart)
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

      // Waterstofverbruik Auto Chart
      if (typeof latestData.waterstofverbruik_auto !== 'undefined') {
        createBarChart('waterstofVerbruikAutoChart', 'Waterstofverbruik auto (%)', data.waterstofverbruik_auto, data.waterstofverbruik_auto > 50 ? '#F44336' : '#8BC34A');
      } else {
        console.warn('waterstofverbruik_auto data missing');
      }
    }

    if (!window.location.pathname.includes('car.php')) {
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
      }
      
    // Index.php charts
    if (!window.location.pathname.includes('car.php')) {
      // Accu Gauge Chart
      if (typeof data.accuniveau !== 'undefined') {
        createChartIfExists('accuGaugeChart', {
          type: 'doughnut',
          data: {
            labels: ['Huidig niveau', 'Leeg'],
            datasets: [{
              data: [data.accuniveau, 100 - data.accuniveau],
              backgroundColor: [data.accuniveau > 20 ? '#4CAF50' : '#FF6347', '#E0E0E0'],
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
      if (typeof data.waterstofopslag_auto !== 'undefined') {
        createChartIfExists('waterstofopslagAutoChart', {
          type: 'doughnut',
          data: {
            labels: ['H₂ opgeslagen', 'Leeg'],
            datasets: [{
              data: [data.waterstofopslag_auto, 100 - data.waterstofopslag_auto],
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

      // Waterstofopslag Woning Chart
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
});