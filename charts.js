// document haalt data van get_home_data.php, logt de data in de consoles en maakt grafieken op basis van de data

document.addEventListener('DOMContentLoaded', async () => { // wacht tot de data is geladen
  const response = await fetch('get_home_data.php'); // wacht op response van de server
  const data = await response.json(); 

  // laat data zien in console voor duidelijkheid
    console.log(`Tijd: ${data.date} ${data.time}`);
    console.log(`Accuniveau: ${data.accuniveau}%`);
    console.log(`Zonnepaneelspanning: ${data.zonnepaneelspanning} V`);
    console.log(`Zonnepaneelstroom: ${data.zonnepaneelstroom} A`);
    console.log(`Waterstofproductie: ${data.waterstofproductie} L/u`);
    console.log(`Stroomverbruik woning: ${data.stroomverbruik_woning} kW`);
    console.log(`Luchtdruk: ${data.luchtdruk} hPa`);
    console.log(`Luchtvochtigheid: ${data.luchtvochtigheid}%`);
    console.log(`CO2 binnen: ${data.co2_concentratie_binnen} ppm`);
    console.log(`Waterstofopslag woning: ${data.waterstofopslag_woning}%`);

// als data een error heeft, log de error
  if (data.error) {
      console.error("Fout:", data.error);
      return;
  }

  // ----- GRAFIEKEN -----
  // gauge grafiek voor accuniveau
  new Chart(document.getElementById('accuGaugeChart'), {
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

  // Zonnepaneelspanning (lijngrafiek)
  createSingleValueChart('zonnepaneelSpanningChart', 'Zonnepaneelspanning (V)', data.zonnepaneelspanning, '#2196F3');

  // Zonnepaneelstroom (lijngrafiek)
  createSingleValueChart('zonnepaneelStroomChart', 'Zonnepaneelstroom (A)', data.zonnepaneelstroom, '#4CAF50');

  // Waterstofproductie (bar grafiek)
  createBarChart('waterstofProductieChart', 'Waterstofproductie (L/u)', data.waterstofproductie, '#00BCD4');

  // Stroomverbruik woning (lijngrafiek)
  createSingleValueChart('stroomverbruikWoningChart', 'Stroomverbruik woning (kW)', data.stroomverbruik_woning, '#FFC107');

  // Luchtdruk (lijngrafiek)
  createSingleValueChart('luchtdrukChart', 'Luchtdruk (hPa)', data.luchtdruk, '#9C27B0');

  // Luchtvochtigheid (lijngrafiek)
  createSingleValueChart('luchtvochtigheidChart', 'Luchtvochtigheid (%)', data.luchtvochtigheid, '#03A9F4');

  // CO2-concentratie binnen (bargrafiek)
  createBarChart('co2Chart', 'CO2-concentratie binnen (ppm)', data.co2_concentratie_binnen, data.co2_concentratie_binnen > 1000 ? '#F44336' : '#8BC34A');

  // gauge grafiek voor waterstofopslag
  new Chart(document.getElementById('waterstofopslagChart'), {
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
          cutout: '60%', // hoeveel ruimte tussen de donut
          rotation: -90, // welke kant de donut begint
          circumference: 180, // hoe groot de donut, 360 is een hele cirkel
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

  // ------ Functies voor lijn-grafieken --------
  function createSingleValueChart(id, label, value, color) {
      new Chart(document.getElementById(id), {
          type: 'line', // type is lijngrafiek
          data: {
              labels: ['Nu'], // allen de nu waarde voor nu. moet nog veranderd worden..
              datasets: [{
                  label: label, //beschrijving
                  data: [value], // de waarde
                  borderColor: color, //kleur van de lijn
                  borderWidth: 2, // dikte van de lijn
                  fill: false, // niet onder de lijn vullen
                  tension: 0.3 // hoe smooth de lijn is
              }]
          },
          options: { // 
              responsive: true, // canvas past zich aan aan schermhoogte/breedte
              maintainAspectRatio: false, 
              plugins: {
                  legend: { display: false },
                    
              },
              scales: {
                  y: { beginAtZero: true }
              }
          }
      });
  }

    // ------ Functie voor bar-grafieken --------
  function createBarChart(id, label, value, color) {
      new Chart(document.getElementById(id), {
          type: 'bar',
          data: {
              labels: [label], // de label voor de x-as
              datasets: [{ // label, data en achtergrondkleur
                  label: label,
                  data: [value],
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
});