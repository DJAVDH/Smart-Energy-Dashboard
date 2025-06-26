import { createLineChart, createBarChart } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');
    
    filterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (!startDate || !endDate) {
            console.warn('Please select both start and end dates');
            return;
        }

        try {
            const response = await fetch('get_filtered_data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `start_date=${startDate}&end_date=${endDate}`
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data.error) {
                console.warn(data.error);
                return;
            }

            // Format labels to show date and time
            const labels = data.map(entry => {
                const [date, time] = entry.datetime.split(' ');
                return `${date} ${time.slice(0, 5)}`;
            });

            // Create charts
            createLineChart('zonnepaneelSpanningChart', 'Zonnepaneelspanning (V)', labels, data.map(entry => entry.zonnepaneelspanning), '#2196F3');
            createLineChart('zonnepaneelStroomChart', 'Zonnepaneelstroom (A)', labels, data.map(entry => entry.zonnepaneelstroom), '#4CAF50');
            createBarChart('waterstofProductieChart', 'Waterstofproductie (L/u)', labels, data.map(entry => entry.waterstofproductie), '#00BCD4');
            createLineChart('stroomverbruikWoningChart', 'Stroomverbruik woning (kW)', labels, data.map(entry => entry.stroomverbruik_woning), '#FFC107');
            createLineChart('luchtdrukChart', 'Luchtdruk (hPa)', labels, data.map(entry => entry.luchtdruk), '#9C27B0');
            createLineChart('luchtvochtigheidChart', 'Luchtvochtigheid (%)', labels, data.map(entry => entry.luchtvochtigheid), '#03A9F4');
            createBarChart('co2Chart', 'CO2-concentratie binnen (ppm)', labels, data.map(entry => entry.co2_concentratie_binnen), data.map(entry => entry.co2_concentratie_binnen > 1000 ? '#F44336' : '#8BC34A'));
            createBarChart('waterstofVerbruikAutoChart', 'Waterstofverbruik auto (%)', labels, data.map(entry => entry.waterstofverbruik_auto), data.map(entry => entry.waterstofverbruik_auto > 50 ? '#F44336' : '#8BC34A'));
            createBarChart('binnentemperatuurChart', 'Gem. binnentemperatuur (°C)', labels, data.map(entry => entry.binnentemperatuur), '#FF9800');
            createBarChart('buitentemperatuurChart', 'Gem. buitentemperatuur (°C)', labels, data.map(entry => entry.buitentemperatuur), '#FF9800');

        } catch (error) {
            console.error('Error fetching or processing filtered data:', error);
        }
    });
});