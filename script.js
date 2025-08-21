
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const categoryFilter = document.getElementById("categoryFilter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = `₹${total}`;
  money_plus.innerText = `+₹${income}`;
  money_minus.innerText = `-₹${expense}`;
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const li = document.createElement("li");

  li.classList.add(transaction.amount < 0 ? "minus" : "plus");
  li.innerHTML = `
    ${transaction.text} <small>(${transaction.category})</small> <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(li);
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function populateCategoryFilter() {
  const uniqueCategories = [...new Set(transactions.map(t => t.category))];
  categoryFilter.innerHTML = `<option value="all">All</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerText = cat;
    categoryFilter.appendChild(option);
  });
}

function init() {
  list.innerHTML = "";
  const selectedCategory = categoryFilter.value;
  const filteredTransactions = selectedCategory === "all" ? transactions : transactions.filter(t => t.category === selectedCategory);
  filteredTransactions.forEach(addTransactionDOM);
  updateValues();
  populateCategoryFilter();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "" || category.value.trim() === "") return;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = "";
  amount.value = "";
  category.value = "";
});

categoryFilter.addEventListener("change", init);

init();
