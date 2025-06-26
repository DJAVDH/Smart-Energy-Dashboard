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

            // Hide all chart cards initially
            document.querySelectorAll('.chart-card').forEach(card => {
                card.classList.remove('active');
            });

            // Format labels to show day, month, and time (excluding year)
            const labels = data.map(entry => {
                const [date, time] = entry.datetime.split(' ');
                const [year, month, day] = date.split('-');
                return `${month}-${day} ${time.slice(0, 5)}`;
            });

            // Create charts and show their containers
            const chartConfigs = [
                { id: 'zonnepaneelSpanningChart', type: 'line', label: 'Zonnepaneelspanning (V)', data: data.map(entry => entry.zonnepaneelspanning), color: '#2196F3' },
                { id: 'zonnepaneelStroomChart', type: 'line', label: 'Zonnepaneelstroom (A)', data: data.map(entry => entry.zonnepaneelstroom), color: '#4CAF50' },
                { id: 'waterstofProductieChart', type: 'bar', label: 'Waterstofproductie (L/u)', data: data.map(entry => entry.waterstofproductie), color: '#00BCD4' },
                { id: 'stroomverbruikWoningChart', type: 'line', label: 'Stroomverbruik woning (kW)', data: data.map(entry => entry.stroomverbruik_woning), color: '#FFC107' },
                { id: 'luchtdrukChart', type: 'line', label: 'Luchtdruk (hPa)', data: data.map(entry => entry.luchtdruk), color: '#9C27B0' },
                { id: 'luchtvochtigheidChart', type: 'line', label: 'Luchtvochtigheid (%)', data: data.map(entry => entry.luchtvochtigheid), color: '#03A9F4' },
                { id: 'co2Chart', type: 'bar', label: 'CO2-concentratie binnen (ppm)', data: data.map(entry => entry.co2_concentratie_binnen), color: data.map(entry => entry.co2_concentratie_binnen > 1000 ? '#F44336' : '#8BC34A') },
                { id: 'waterstofVerbruikAutoChart', type: 'bar', label: 'Waterstofverbruik auto (%)', data: data.map(entry => entry.waterstofverbruik_auto), color: data.map(entry => entry.waterstofverbruik_auto > 50 ? '#F44336' : '#8BC34A') },
                { id: 'binnentemperatuurChart', type: 'bar', label: 'Gem. binnentemperatuur (°C)', data: data.map(entry => entry.binnentemperatuur), color: '#FF9800' },
                { id: 'buitentemperatuurChart', type: 'bar', label: 'Gem. buitentemperatuur (°C)', data: data.map(entry => entry.buitentemperatuur), color: '#FF9800' }
            ];

            chartConfigs.forEach(config => {
                const canvas = document.getElementById(config.id);
                if (canvas) {
                    if (config.type === 'line') {
                        createLineChart(config.id, config.label, labels, config.data, config.color);
                    } else {
                        createBarChart(config.id, config.label, labels, config.data, config.color);
                    }
                    // Show the chart card
                    canvas.closest('.chart-card').classList.add('active');
                }
            });

        } catch (error) {
            console.error('Error fetching or processing filtered data:', error);
        }
    });
});