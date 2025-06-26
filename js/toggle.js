import { loadMonthlyData, loadHomeData, loadYearData} from "../charts.js";

// Zet de actieve periodeknop
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const selectedPeriod = this.getAttribute('data-period');
        if (selectedPeriod === 'month') {
          loadMonthlyData();
        } else if (selectedPeriod === 'day') {
          loadHomeData();
        } else {
          loadYearData();
        }
      });
    });

    // Zet de huidige datum in het overzicht
    const dateSpan = document.getElementById('overview-date');
    if (dateSpan) {
      const now = new Date();
      dateSpan.textContent = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    loadHomeData();

  });