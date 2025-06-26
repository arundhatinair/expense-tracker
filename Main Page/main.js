const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const chartCanvas = document.getElementById('expense-chart');

let expenses = JSON.parse(localStorage.getItem('expenses') || '{}');

const today = new Date().toISOString().split('T')[0];
document.getElementById('expense-date').value = today;

form.addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('expense-date').value;
  const category = document.getElementById('expense-category').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  if (!expenses[date]) expenses[date] = [];
  expenses[date].push({ category, amount });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  form.reset();
  document.getElementById('expense-date').value = date;
  renderExpenses(date);
});

function renderExpenses(date) {
  const dayExpenses = expenses[date] || [];
  expenseList.innerHTML = '';
  const categoryTotals = {};
  let totalAmount = 0;

  dayExpenses.forEach(({ category, amount }) => {
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    totalAmount += amount;
  });

  for (const category in categoryTotals) {
    const amount = categoryTotals[category];
    const percentage = ((amount / totalAmount) * 100).toFixed(1);
    expenseList.innerHTML += `<div><span>${getIcon(category)} ${category}</span><span>₹${amount.toFixed(2)} (${percentage}%)</span></div>`;
  }

  renderChart(categoryTotals);
}

function renderChart(categoryTotals) {
  const categories = Object.keys(categoryTotals);
  const amounts = categories.map(cat => categoryTotals[cat]);
  const colors = ['#b0d7ff', '#a3d9b1', '#f9c5d1', '#ffe7a0', '#d6baff', '#ffd6e0'];

  if (window.expenseChart) window.expenseChart.destroy();

  window.expenseChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
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

renderExpenses(today);
