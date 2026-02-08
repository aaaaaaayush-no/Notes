import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  formatCurrency,
  getPersonColor,
  calculateMonthlyTotals,
  calculateSettlements,
} from '../utils/helpers';

export default function SummaryCard({ expenses, members }) {
  const { total, byPerson } = calculateMonthlyTotals(expenses);
  const settlements = calculateSettlements(byPerson, members.length);

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No expenses this month</Text>
        <Text style={styles.emptySubtext}>
          Tap the + button to add your first expense
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Total */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Monthly Total</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        <Text style={styles.expenseCount}>
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Per Person Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Per Person</Text>
        {members.map((member) => {
          const spent = byPerson[member] || 0;
          const percentage = total > 0 ? (spent / total) * 100 : 0;
          const color = getPersonColor(member, members);
          return (
            <View key={member} style={styles.personRow}>
              <View style={styles.personInfo}>
                <View style={[styles.personDot, { backgroundColor: color }]} />
                <Text style={styles.personName}>{member}</Text>
              </View>
              <View style={styles.personAmountContainer}>
                <Text style={styles.personAmount}>{formatCurrency(spent)}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { width: `${percentage}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Settlements */}
      {settlements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settlements</Text>
          {settlements.map((settlement, index) => (
            <View key={index} style={styles.settlementRow}>
              <View style={styles.settlementContent}>
                <Text style={styles.settlementFrom}>{settlement.from}</Text>
                <Ionicons name="arrow-forward" size={16} color="#6C5CE7" />
                <Text style={styles.settlementTo}>{settlement.to}</Text>
              </View>
              <Text style={styles.settlementAmount}>
                {formatCurrency(settlement.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#aaa',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: '#d4cfff',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  expenseCount: {
    fontSize: 13,
    color: '#d4cfff',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  personDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  personAmountContainer: {
    flex: 1,
    marginLeft: 12,
  },
  personAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    marginBottom: 4,
  },
  barContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
  settlementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  settlementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settlementFrom: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  settlementTo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00b894',
  },
  settlementAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});
