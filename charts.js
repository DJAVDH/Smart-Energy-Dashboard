let accuChartInstance = null;
// chartjs plugin

async function createAccuChart() {
    // try voor als er error is
    try {
        const response = await fetch('energy_data/get_home_data.php'); // haal de data op van de PHP file
        if (!response.ok) { // als de response niet ok is dan komt er een error
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // data wacht op response en zet die om naar json

        // als er error is komt er een foutmelding
        if (data.error){
            console.error('Fout in PHP-script: ', data.error);
            document.getElementById('accuGaugeChart').outerHTML = '<p style="color: red; text-align: center;">Kon accudata niet laden: ' + data.error + '</p>';
            return;
        }

        const accuniveau = data.accuniveau; // haal het accuniveau uit de data

        if (accuniveau === null || accuniveau === undefined) { // als accuniveau niet bestaat of null is
            console.warn("Geen geldig accuniveau gevonden in de data:", data);
            document.getElementById('accuGaugeChart').outerHTML = '<p style="color: red; text-align: center;">Geen accudata beschikbaar.</p>';
            return;
        }
        console.log("Accuniveau gekregen: ", accuniveau); // laat accu zien in console

        //data voorbereiden voor gauge chart
        const percentageVol = accuniveau;
        const percentageLeeg = 100 - accuniveau;

        const ctx = document.getElementById('accuGaugeChart').getContext('2d');

        // als er al een chart is, vernietig deze
        if (accuChartInstance) {
            accuChartInstance.destroy();
        }

        // maak de gauge chart aan
        accuChartInstance = new Chart(ctx, { 
            type : 'doughnut',
            data : {
                labels: ['Huidig niveau', 'resterend'],
                datasets: [{
                    data: [percentageVol, percentageLeeg],
                    backgroundColor: [
                        percentageVol > 20 ? '#4CAF50' : '#FF6347',
                        '#E0E0E0'
                    ],
                    borderWidth: 0,
                    borderColor: 'transparent'
                }]
            },
            options :{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                rotation: -90,
                circumference: 180, // helft van de cirkel
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: {
                      display: true,
                      text: 'Accuniveau',
                      font: {
                        size: 35,
                        weight: 'bold'
                      },
                      color: '#ffffff'
                    },
                    doughnutlabel: {
                      labels: [
                        {
                          text: percentageVol.toFixed(0) + '%',
                          font: {
                            size: 50,
                            weight: 'bold'
                          },
                          color: '#333'
                        },
                        {
                          text: 'Accu Niveau',
                          font: {
                            size: 20
                          },
                          color: '#666'
                        }
                      ]
                    }
                  }
            }
        });

    } // als try niet lukt en hij vangt een error, laat hij een foutmelding zien
    catch (error){
        console.error("Fout bij het laden of tekenen van de accugrafiek:", error);
        document.getElementById('accuGaugeChart').outerHTML = '<p style="color: red; text-align: center;">Kon de accudata niet laden. Controleer de console (F12) voor details.</p>';
    }
}
document.addEventListener('DOMContentLoaded', createAccuChart);
