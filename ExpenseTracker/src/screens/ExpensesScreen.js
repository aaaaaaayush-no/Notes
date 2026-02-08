import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../contexts/ExpenseContext';
import { useApp } from '../contexts/AppContext';
import ExpenseItem from '../components/ExpenseItem';
import ExpenseForm from '../components/ExpenseForm';
import MonthSelector from '../components/MonthSelector';
import PersonFilter from '../components/PersonFilter';
import {
  getCurrentMonthKey,
  filterExpensesByMonth,
  filterExpensesByPerson,
} from '../utils/helpers';

export default function ExpensesScreen() {
  const { expenses, addExpense, editExpense, removeExpense } = useExpenses();
  const { members } = useApp();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());
  const [selectedPerson, setSelectedPerson] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const filteredExpenses = useMemo(() => {
    let filtered = filterExpensesByMonth(expenses, currentMonth);
    filtered = filterExpensesByPerson(filtered, selectedPerson);
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, currentMonth, selectedPerson]);

  const navigateMonth = useCallback(
    (direction) => {
      const [year, month] = currentMonth.split('-').map(Number);
      let newMonth = month + direction;
      let newYear = year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
    },
    [currentMonth]
  );

  const handleAddExpense = async (expense) => {
    await addExpense(expense);
    setShowAddForm(false);
  };

  const handleEditExpense = async (expense) => {
    const { id, ...data } = expense;
    await editExpense(editingExpense.id, data);
    setEditingExpense(null);
  };

  return (
    <View style={styles.container}>
      <MonthSelector
        currentMonth={currentMonth}
        onPrev={() => navigateMonth(-1)}
        onNext={() => navigateMonth(1)}
      />

      <PersonFilter
        members={members}
        selectedPerson={selectedPerson}
        onSelect={setSelectedPerson}
      />

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            members={members}
            onEdit={setEditingExpense}
            onDelete={removeExpense}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No expenses found</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddForm(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalContainer}>
          <ExpenseForm
            members={members}
            onSubmit={handleAddExpense}
            onCancel={() => setShowAddForm(false)}
          />
        </View>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        visible={!!editingExpense}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditingExpense(null)}
      >
        <View style={styles.modalContainer}>
          {editingExpense && (
            <ExpenseForm
              members={members}
              initialData={editingExpense}
              onSubmit={handleEditExpense}
              onCancel={() => setEditingExpense(null)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
});
