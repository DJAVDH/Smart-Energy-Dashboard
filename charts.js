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
        new Chart(canvas, config);
      } else {
        console.warn(`Canvas with ID '${id}' not found. Skipping chart creation.`);
      }
    };

    // Helper function for single-value line charts
    const createSingleValueChart = (id, label, value, color) => {
      if (typeof value === 'undefined') {
        console.warn(`${label} data missing`);
        return;
      }
      createChartIfExists(id, {
        type: 'line',
        data: {
          labels: ['Nu'],
          datasets: [{
            label: label,
            data: [value],
            borderColor: color,
            borderWidth: 2,
            fill: false,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    };

    // Helper function for bar charts
    const createBarChart = (id, label, value, color) => {
      if (typeof value === 'undefined') {
        console.warn(`${label} data missing`);
        return;
      }
      createChartIfExists(id, {
        type: 'bar',
        data: {
          labels: [label],
          datasets: [{
            label: label,
            data: [value],
            backgroundColor: color
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    };

    // Accu Gauge Chart (used in car.php and possibly index.php)
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

    // Waterstofopslag Auto Chart (used in car.php)
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

    // Charts for index.php (skip in car.php)
    if (!window.location.pathname.includes('car.php')) {
      // Zonnepaneelspanning Chart
      createSingleValueChart('zonnepaneelSpanningChart', 'Zonnepaneelspanning (V)', data.zonnepaneelspanning, '#2196F3');

      // Zonnepaneelstroom Chart
      createSingleValueChart('zonnepaneelStroomChart', 'Zonnepaneelstroom (A)', data.zonnepaneelstroom, '#4CAF50');

      // Waterstofproductie Chart
      createBarChart('waterstofProductieChart', 'Waterstofproductie (L/u)', data.waterstofproductie, '#00BCD4');

      // Stroomverbruik Woning Chart
      createSingleValueChart('stroomverbruikWoningChart', 'Stroomverbruik woning (kW)', data.stroomverbruik_woning, '#FFC107');

      // Luchtdruk Chart
      createSingleValueChart('luchtdrukChart', 'Luchtdruk (hPa)', data.luchtdruk, '#9C27B0');

      // Luchtvochtigheid Chart
      createSingleValueChart('luchtvochtigheidChart', 'Luchtvochtigheid (%)', data.luchtvochtigheid, '#03A9F4');

      // CO2-concentratie Binnen Chart
      createBarChart('co2Chart', 'CO2-concentratie binnen (ppm)', data.co2_concentratie_binnen, data.co2_concentratie_binnen > 1000 ? '#F44336' : '#8BC34A');

      // Buitentemperatuur Chart
      createSingleValueChart('buitentemperatuurChart', 'Buitentemperatuur (°C)', data.buitentemperatuur, '#FF9800');

      // Waterstofverbruik Auto Chart
      createBarChart('waterstofVerbruikAutoChart', 'Waterstofverbruik auto (%)', data.waterstofverbruik_auto, data.waterstofverbruik_auto > 50 ? '#F44336' : '#8BC34A');

      // Waterstofopslag Woning Chart
      if (typeof data.waterstofopslag_woning !== 'undefined') {
        createChartIfExists('waterstofopslagChart', {
          type: 'doughnut',
          data: {
            labels: ['H₂ opgeslagen', 'Leeg'],
            datasets: [{
              data: [data.waterstofopslag_woning, 100 - data.waterstofopslag_woning],
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