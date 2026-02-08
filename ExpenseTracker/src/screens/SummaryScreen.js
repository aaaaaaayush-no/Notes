import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useExpenses } from '../contexts/ExpenseContext';
import { useApp } from '../contexts/AppContext';
import SummaryCard from '../components/SummaryCard';
import MonthSelector from '../components/MonthSelector';
import {
  getCurrentMonthKey,
  filterExpensesByMonth,
} from '../utils/helpers';

export default function SummaryScreen() {
  const { expenses } = useExpenses();
  const { members } = useApp();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());

  const monthlyExpenses = useMemo(
    () => filterExpensesByMonth(expenses, currentMonth),
    [expenses, currentMonth]
  );

  const navigateMonth = (direction) => {
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
  };

  return (
    <View style={styles.container}>
      <MonthSelector
        currentMonth={currentMonth}
        onPrev={() => navigateMonth(-1)}
        onNext={() => navigateMonth(1)}
      />
      <ScrollView>
        <SummaryCard expenses={monthlyExpenses} members={members} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
