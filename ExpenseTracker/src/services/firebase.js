import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  update,
  onValue,
  off,
  query,
  orderByChild,
} from 'firebase/database';

// Firebase configuration - Replace with your own Firebase project config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId: 'YOUR_PROJECT',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

let app;
let database;

export function initializeFirebase(config) {
  try {
    const finalConfig = config || firebaseConfig;
    app = initializeApp(finalConfig);
    database = getDatabase(app);
    return true;
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    return false;
  }
}

export function getDb() {
  return database;
}

// Expense operations
export function subscribeToExpenses(groupId, callback) {
  if (!database) return null;
  const expensesRef = ref(database, `groups/${groupId}/expenses`);
  const expensesQuery = query(expensesRef, orderByChild('date'));
  onValue(expensesQuery, (snapshot) => {
    const data = snapshot.val();
    const expenses = data
      ? Object.entries(data).map(([id, expense]) => ({ id, ...expense }))
      : [];
    callback(expenses);
  });
  return expensesRef;
}

export function addExpense(groupId, expense) {
  if (!database) return Promise.resolve(null);
  const expensesRef = ref(database, `groups/${groupId}/expenses`);
  return push(expensesRef, expense);
}

export function updateExpense(groupId, expenseId, expense) {
  if (!database) return Promise.resolve();
  const expenseRef = ref(database, `groups/${groupId}/expenses/${expenseId}`);
  return update(expenseRef, expense);
}

export function deleteExpense(groupId, expenseId) {
  if (!database) return Promise.resolve();
  const expenseRef = ref(database, `groups/${groupId}/expenses/${expenseId}`);
  return remove(expenseRef);
}

// Group operations
export function createGroup(groupId, groupData) {
  if (!database) return Promise.resolve();
  const groupRef = ref(database, `groups/${groupId}`);
  return set(groupRef, groupData);
}

export function subscribeToGroup(groupId, callback) {
  if (!database) return null;
  const groupRef = ref(database, `groups/${groupId}/info`);
  onValue(groupRef, (snapshot) => {
    callback(snapshot.val());
  });
  return groupRef;
}

export function unsubscribe(refToUnsubscribe) {
  if (refToUnsubscribe) {
    off(refToUnsubscribe);
  }
}
