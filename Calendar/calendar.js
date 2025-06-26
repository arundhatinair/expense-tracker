const dateInput = document.getElementById('calendar-date');
const dailyList = document.getElementById('daily-expense-list');
const chartCanvas = document.getElementById('calendar-chart');

let expenses = JSON.parse(localStorage.getItem('expenses') || '{}');

const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
renderCalendarExpenses(today);

dateInput.addEventListener('change', e => {
  const selectedDate = e.target.value;
  renderCalendarExpenses(selectedDate);
});

function renderCalendarExpenses(date) {
  const data = expenses[date] || [];
  dailyList.innerHTML = '';

  const categoryTotals = {};
  let total = 0;

  data.forEach(({ category, amount }) => {
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    total += amount;
  });

  for (const cat in categoryTotals) {
    const amt = categoryTotals[cat];
    const percent = ((amt / total) * 100).toFixed(1);
    dailyList.innerHTML += `<div><span>${getIcon(cat)} ${cat}</span><span>₹${amt.toFixed(2)} (${percent}%)</span></div>`;
  }

  renderChart(categoryTotals);
}

function renderChart(categoryTotals) {
  const categories = Object.keys(categoryTotals);
  const values = categories.map(c => categoryTotals[c]);
  const colors = ['#b0d7ff', '#a3d9b1', '#f9c5d1', '#ffe7a0', '#d6baff', '#ffd6e0'];

  if (window.calendarChart) window.calendarChart.destroy();

  window.calendarChart = new Chart(chartCanvas, {
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

function getIcon(category) {
  switch(category) {
    case 'Food': return '🍱';
    case 'Transport': return '🚌';
    case 'Entertainment': return '🎮';
    case 'Health': return '💊';
    case 'Shopping': return '🛍️';
    case 'Other': return '✨';
    default: return '';
  }
}
