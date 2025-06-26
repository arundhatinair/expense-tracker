const expenses = JSON.parse(localStorage.getItem('expenses') || '{}');
const monthSelect = document.getElementById('month-select');
const chartCanvas = document.getElementById('monthly-chart');

const monthMap = {};

for (const date in expenses) {
  const month = date.slice(0, 7); // YYYY-MM
  if (!monthMap[month]) monthMap[month] = [];
  monthMap[month].push(...expenses[date]);
}

Object.keys(monthMap).forEach(m => {
  const option = document.createElement('option');
  option.value = m;
  option.textContent = new Date(m + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
  monthSelect.appendChild(option);
});

monthSelect.addEventListener('change', () => {
  renderMonth(monthSelect.value);
});

function renderMonth(month) {
  const data = monthMap[month] || [];
  const totals = {};
  let total = 0;

  data.forEach(({ category, amount }) => {
    totals[category] = (totals[category] || 0) + amount;
    total += amount;
  });

  const categories = Object.keys(totals);
  const values = categories.map(c => totals[c]);
  const colors = ['#b0d7ff', '#a3d9b1', '#f9c5d1', '#ffe7a0', '#d6baff', '#ffd6e0'];

  if (window.monthlyChart) window.monthlyChart.destroy();

  window.monthlyChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, categories.length)
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'Patrick Hand',
              size: 14
            }
          }
        }
      }
    }
  });
}

if (monthSelect.value) renderMonth(monthSelect.value);
else if (monthSelect.options.length > 0) {
  monthSelect.value = monthSelect.options[0].value;
  renderMonth(monthSelect.value);
}
