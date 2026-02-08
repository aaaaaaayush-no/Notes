const {
  formatCurrency,
  formatDate,
  getMonthKey,
  getMonthLabel,
  getCurrentMonthKey,
  filterExpensesByMonth,
  filterExpensesByPerson,
  calculateMonthlyTotals,
  calculateSettlements,
  generateId,
  generateGroupCode,
  exportToCSV,
  getPersonColor,
  CATEGORIES,
  PERSON_COLORS,
} = require('../src/utils/helpers');

describe('formatCurrency', () => {
  test('formats number to dollar string', () => {
    expect(formatCurrency(10)).toBe('$10.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(99.9)).toBe('$99.90');
    expect(formatCurrency(1234.56)).toBe('$1234.56');
  });
});

describe('formatDate', () => {
  test('formats date string', () => {
    expect(formatDate('2025-01-15')).toBe('Jan 15, 2025');
    expect(formatDate('2025-12-25')).toBe('Dec 25, 2025');
  });
});

describe('getMonthKey', () => {
  test('returns YYYY-MM format', () => {
    expect(getMonthKey('2025-01-15')).toBe('2025-01');
    expect(getMonthKey('2025-12-01')).toBe('2025-12');
  });
});

describe('getMonthLabel', () => {
  test('returns readable month label', () => {
    expect(getMonthLabel('2025-01')).toBe('January 2025');
    expect(getMonthLabel('2025-12')).toBe('December 2025');
  });
});

describe('getCurrentMonthKey', () => {
  test('returns current month key', () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    expect(getCurrentMonthKey()).toBe(expected);
  });
});

describe('filterExpensesByMonth', () => {
  const expenses = [
    { id: '1', date: '2025-01-15', amount: '10', paidBy: 'Alice' },
    { id: '2', date: '2025-01-20', amount: '20', paidBy: 'Bob' },
    { id: '3', date: '2025-02-10', amount: '30', paidBy: 'Alice' },
  ];

  test('filters expenses by month', () => {
    expect(filterExpensesByMonth(expenses, '2025-01')).toHaveLength(2);
    expect(filterExpensesByMonth(expenses, '2025-02')).toHaveLength(1);
    expect(filterExpensesByMonth(expenses, '2025-03')).toHaveLength(0);
  });
});

describe('filterExpensesByPerson', () => {
  const expenses = [
    { id: '1', date: '2025-01-15', amount: '10', paidBy: 'Alice' },
    { id: '2', date: '2025-01-20', amount: '20', paidBy: 'Bob' },
    { id: '3', date: '2025-02-10', amount: '30', paidBy: 'Alice' },
  ];

  test('returns all when person is All', () => {
    expect(filterExpensesByPerson(expenses, 'All')).toHaveLength(3);
  });

  test('returns all when person is null', () => {
    expect(filterExpensesByPerson(expenses, null)).toHaveLength(3);
  });

  test('filters by person', () => {
    expect(filterExpensesByPerson(expenses, 'Alice')).toHaveLength(2);
    expect(filterExpensesByPerson(expenses, 'Bob')).toHaveLength(1);
  });
});

describe('calculateMonthlyTotals', () => {
  test('calculates totals correctly', () => {
    const expenses = [
      { amount: '10.50', paidBy: 'Alice' },
      { amount: '20.00', paidBy: 'Bob' },
      { amount: '15.25', paidBy: 'Alice' },
    ];
    const result = calculateMonthlyTotals(expenses);
    expect(result.total).toBeCloseTo(45.75);
    expect(result.byPerson.Alice).toBeCloseTo(25.75);
    expect(result.byPerson.Bob).toBeCloseTo(20.00);
  });

  test('handles empty expenses', () => {
    const result = calculateMonthlyTotals([]);
    expect(result.total).toBe(0);
    expect(result.byPerson).toEqual({});
  });
});

describe('calculateSettlements', () => {
  test('calculates who owes whom', () => {
    const byPerson = { Alice: 100, Bob: 50 };
    const settlements = calculateSettlements(byPerson, 2);
    expect(settlements).toHaveLength(1);
    expect(settlements[0].from).toBe('Bob');
    expect(settlements[0].to).toBe('Alice');
    expect(settlements[0].amount).toBe(25);
  });

  test('handles equal spending', () => {
    const byPerson = { Alice: 50, Bob: 50 };
    const settlements = calculateSettlements(byPerson, 2);
    expect(settlements).toHaveLength(0);
  });

  test('handles three people', () => {
    const byPerson = { Alice: 90, Bob: 60, Carol: 0 };
    const settlements = calculateSettlements(byPerson, 3);
    const totalSettled = settlements.reduce((s, t) => s + t.amount, 0);
    // Each person should pay 50. Alice overpaid 40, Bob overpaid 10, Carol owes 50.
    expect(totalSettled).toBeCloseTo(50);
  });

  test('returns empty for no persons', () => {
    expect(calculateSettlements({}, 0)).toEqual([]);
  });
});

describe('generateId', () => {
  test('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
});

describe('generateGroupCode', () => {
  test('generates 6-character code', () => {
    const code = generateGroupCode();
    expect(code).toHaveLength(6);
    expect(/^[A-Z0-9]+$/.test(code)).toBe(true);
  });

  test('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateGroupCode()));
    expect(codes.size).toBeGreaterThan(90); // Should be mostly unique
  });
});

describe('getPersonColor', () => {
  test('returns consistent color for person', () => {
    const members = ['Alice', 'Bob', 'Carol'];
    const color1 = getPersonColor('Alice', members);
    const color2 = getPersonColor('Alice', members);
    expect(color1).toBe(color2);
    expect(color1).toBe(PERSON_COLORS[0]);
  });

  test('wraps around colors', () => {
    const members = Array.from({ length: 20 }, (_, i) => `Person${i}`);
    const color = getPersonColor('Person0', members);
    expect(color).toBe(PERSON_COLORS[0]);
  });
});

describe('exportToCSV', () => {
  test('exports expense data as CSV', () => {
    const expenses = [
      { date: '2025-01-15', description: 'Lunch', category: 'food', amount: '12.50', paidBy: 'Alice' },
      { date: '2025-01-16', description: 'Gas', category: 'transport', amount: '30.00', paidBy: 'Bob' },
    ];
    const csv = exportToCSV(expenses, 'January 2025');
    expect(csv).toContain('Date,Description,Category,Amount,Paid By');
    expect(csv).toContain('Lunch');
    expect(csv).toContain('Gas');
    expect(csv).toContain('Summary for January 2025');
    expect(csv).toContain('Total: $42.50');
  });
});

describe('CATEGORIES', () => {
  test('has expected categories', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    expect(CATEGORIES.find(c => c.id === 'food')).toBeTruthy();
    expect(CATEGORIES.find(c => c.id === 'other')).toBeTruthy();
    CATEGORIES.forEach(cat => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('icon');
      expect(cat).toHaveProperty('color');
    });
  });
});
