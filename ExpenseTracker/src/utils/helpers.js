export const CATEGORIES = [
  { id: 'food', label: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'rent', label: 'Rent', icon: 'home', color: '#4ECDC4' },
  { id: 'utilities', label: 'Utilities', icon: 'flash', color: '#FFE66D' },
  { id: 'entertainment', label: 'Entertainment', icon: 'game-controller', color: '#A8E6CF' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#DDA0DD' },
  { id: 'groceries', label: 'Groceries', icon: 'cart', color: '#98D8C8' },
  { id: 'health', label: 'Health', icon: 'medkit', color: '#F7DC6F' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#B0BEC5' },
];

export const PERSON_COLORS = [
  '#6C5CE7',
  '#00B894',
  '#E17055',
  '#0984E3',
  '#FDCB6E',
  '#E84393',
  '#00CEC9',
  '#D63031',
];

export function getPersonColor(personName, allPersons) {
  const index = allPersons.indexOf(personName);
  return PERSON_COLORS[index % PERSON_COLORS.length];
}

export function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export function getCurrentMonthKey() {
  const now = new Date();
  return getMonthKey(now);
}

export function filterExpensesByMonth(expenses, monthKey) {
  return expenses.filter((expense) => getMonthKey(expense.date) === monthKey);
}

export function filterExpensesByPerson(expenses, person) {
  if (!person || person === 'All') return expenses;
  return expenses.filter((expense) => expense.paidBy === person);
}

export function calculateMonthlyTotals(expenses) {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const byPerson = {};
  expenses.forEach((exp) => {
    const person = exp.paidBy;
    byPerson[person] = (byPerson[person] || 0) + parseFloat(exp.amount);
  });
  return { total, byPerson };
}

export function calculateSettlements(byPerson, totalPersons) {
  if (totalPersons === 0) return [];
  const persons = Object.keys(byPerson);
  const total = Object.values(byPerson).reduce((s, v) => s + v, 0);
  const equalShare = total / totalPersons;

  const balances = {};
  persons.forEach((p) => {
    balances[p] = (byPerson[p] || 0) - equalShare;
  });

  const settlements = [];
  const debtors = Object.entries(balances)
    .filter(([, b]) => b < -0.01)
    .sort((a, b) => a[1] - b[1]);
  const creditors = Object.entries(balances)
    .filter(([, b]) => b > 0.01)
    .sort((a, b) => b[1] - a[1]);

  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(-debtors[i][1], creditors[j][1]);
    if (amount > 0.01) {
      settlements.push({
        from: debtors[i][0],
        to: creditors[j][0],
        amount: Math.round(amount * 100) / 100,
      });
    }
    debtors[i][1] += amount;
    creditors[j][1] -= amount;
    if (Math.abs(debtors[i][1]) < 0.01) i++;
    if (Math.abs(creditors[j][1]) < 0.01) j++;
  }

  return settlements;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function generateGroupCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function exportToCSV(expenses, monthLabel) {
  const header = 'Date,Description,Category,Amount,Paid By\n';
  const rows = expenses
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((exp) =>
      `${formatDate(exp.date)},${exp.description},${exp.category || 'other'},${exp.amount},${exp.paidBy}`
    )
    .join('\n');
  const { total, byPerson } = calculateMonthlyTotals(expenses);
  const summary = `\n\nSummary for ${monthLabel}\nTotal: ${formatCurrency(total)}\n` +
    Object.entries(byPerson)
      .map(([person, amount]) => `${person}: ${formatCurrency(amount)}`)
      .join('\n');
  return header + rows + summary;
}
