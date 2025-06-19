fetch('/energy/database/get_auto.php')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Raw JSON data:', data); // Debug: Log raw JSON
    // Filter data to keep only hourly points (e.g., 00:00:00, 01:00:00)
    const filteredData = data.filter(item => item.TIME.endsWith('00:00'));
    console.log('Filtered data:', filteredData); // Debug: Log filtered data
    const labels = filteredData.map(item => item.TIME || ''); // Use TIME
    const waterstofverbruik = filteredData.map(item => parseFloat(item.waterstofverbruik_auto) || 0); // Numeric values
    console.log('Labels (TIME):', labels); // Debug: Log time labels
    console.log('Waterstofverbruik Auto:', waterstofverbruik); // Debug: Log values

    const ctx = document.getElementById('accuniveauChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hydrogen Consumption (Auto)',
          data: waterstofverbruik,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.1,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Time' },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              maxTicksLimit: 4 // Further reduced for fewer ticks
            }
          },
          y: {
            title: { display: true, text: 'Hydrogen Consumption' },
            beginAtZero: true,
            suggestedMax: 1
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Consumption: ${context.parsed.y.toFixed(2)} at ${context.label}`;
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));