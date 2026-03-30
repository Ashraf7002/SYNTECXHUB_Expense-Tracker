document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("transactionForm");
  const amountInput = document.getElementById("amount");
  const typeSelect = document.getElementById("type");
  const categorySelect = document.getElementById("category");
  const dateInput = document.getElementById("date");

  const incomeCard = document.querySelector(".income p");
  const expenseCard = document.querySelector(".expense p");
  const balanceCard = document.querySelector(".balance p");

  const filterCategory = document.getElementById("filterCategory");
  const filterDate = document.getElementById("filterDate");
  const filterBtn = document.getElementById("filterBtn");

  const themeToggle = document.getElementById("themeToggle");
  const tableBody = document.querySelector("#transactionTable tbody");

  const ctx = document.getElementById("expenseChart");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let chart;

  // THEME LOAD
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerText = "☀ Light Mode";
  }

  function updateSummary() {
    let income = 0, expense = 0;
    transactions.forEach(t =>
      t.type === "Income" ? income += t.amount : expense += t.amount
    );
    incomeCard.innerText = "₹" + income;
    expenseCard.innerText = "₹" + expense;
    balanceCard.innerText = "₹" + (income - expense);
  }

  function renderTable(list = transactions) {
    tableBody.innerHTML = "";
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No transactions</td></tr>`;
      return;
    }
    list.forEach(t => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.date}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
        <td>₹${t.amount}</td>
        <td><button onclick="deleteTransaction(${t.id})">❌</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  window.deleteTransaction = function (id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    refresh();
  };

  function updateChart() {
    let income = 0, expense = 0;
    transactions.forEach(t =>
      t.type === "Income" ? income += t.amount : expense += t.amount
    );

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Income", "Expense"],
        datasets: [{
          data: [income, expense],
          backgroundColor: ["green", "red"]
        }]
      }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    transactions.push({
      id: Date.now(),
      amount: Number(amountInput.value),
      type: typeSelect.value,
      category: categorySelect.value,
      date: dateInput.value
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    form.reset();
    refresh();
  });

  filterBtn.addEventListener("click", function () {
    let filtered = transactions;

    if (filterCategory.value !== "All") {
      filtered = filtered.filter(t => t.category === filterCategory.value);
    }

    if (filterDate.value) {
      filtered = filtered.filter(t => t.date === filterDate.value);
    }

    renderTable(filtered);
  });

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.innerText = isDark ? "☀ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  function refresh() {
    renderTable();
    updateSummary();
    updateChart();
  }

  refresh();
});
