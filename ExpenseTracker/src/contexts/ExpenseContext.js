import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  subscribeToExpenses,
  addExpense as fbAddExpense,
  updateExpense as fbUpdateExpense,
  deleteExpense as fbDeleteExpense,
  unsubscribe,
} from '../services/firebase';
import {
  cacheExpenses,
  getCachedExpenses,
  addToOfflineQueue,
} from '../services/localStorage';
import { generateId } from '../utils/helpers';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  loading: true,
  error: null,
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ExpenseProvider({ children, groupId, isFirebaseConnected }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    let expensesRef = null;

    async function loadExpenses() {
      if (isFirebaseConnected && groupId) {
        expensesRef = subscribeToExpenses(groupId, (expenses) => {
          dispatch({ type: 'SET_EXPENSES', payload: expenses });
          cacheExpenses(expenses);
        });
      } else {
        // Load from local cache
        const cached = await getCachedExpenses();
        dispatch({ type: 'SET_EXPENSES', payload: cached });
      }
    }

    loadExpenses();

    return () => {
      if (expensesRef) unsubscribe(expensesRef);
    };
  }, [groupId, isFirebaseConnected]);

  const addExpense = useCallback(
    async (expense) => {
      const newExpense = {
        ...expense,
        createdAt: new Date().toISOString(),
      };

      if (isFirebaseConnected && groupId) {
        try {
          await fbAddExpense(groupId, newExpense);
        } catch (error) {
          // Add locally and queue for sync
          const localId = generateId();
          dispatch({ type: 'ADD_EXPENSE', payload: { id: localId, ...newExpense } });
          await addToOfflineQueue({ type: 'add', data: newExpense });
        }
      } else {
        const localId = generateId();
        const localExpense = { id: localId, ...newExpense };
        dispatch({ type: 'ADD_EXPENSE', payload: localExpense });
        const updated = [...state.expenses, localExpense];
        await cacheExpenses(updated);
        await addToOfflineQueue({ type: 'add', data: newExpense });
      }
    },
    [groupId, isFirebaseConnected, state.expenses]
  );

  const editExpense = useCallback(
    async (expenseId, data) => {
      if (isFirebaseConnected && groupId) {
        try {
          await fbUpdateExpense(groupId, expenseId, data);
        } catch (error) {
          dispatch({ type: 'UPDATE_EXPENSE', payload: { id: expenseId, data } });
          await addToOfflineQueue({ type: 'update', id: expenseId, data });
        }
      } else {
        dispatch({ type: 'UPDATE_EXPENSE', payload: { id: expenseId, data } });
        const updated = state.expenses.map((exp) =>
          exp.id === expenseId ? { ...exp, ...data } : exp
        );
        await cacheExpenses(updated);
        await addToOfflineQueue({ type: 'update', id: expenseId, data });
      }
    },
    [groupId, isFirebaseConnected, state.expenses]
  );

  const removeExpense = useCallback(
    async (expenseId) => {
      if (isFirebaseConnected && groupId) {
        try {
          await fbDeleteExpense(groupId, expenseId);
        } catch (error) {
          dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
          await addToOfflineQueue({ type: 'delete', id: expenseId });
        }
      } else {
        dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
        const updated = state.expenses.filter((exp) => exp.id !== expenseId);
        await cacheExpenses(updated);
        await addToOfflineQueue({ type: 'delete', id: expenseId });
      }
    },
    [groupId, isFirebaseConnected, state.expenses]
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses: state.expenses,
        loading: state.loading,
        error: state.error,
        addExpense,
        editExpense,
        removeExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
