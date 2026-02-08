import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CATEGORIES,
  formatCurrency,
  formatDate,
  getPersonColor,
} from '../utils/helpers';

export default function ExpenseItem({ expense, members, onEdit, onDelete }) {
  const category = CATEGORIES.find((c) => c.id === expense.category) || CATEGORIES[CATEGORIES.length - 1];
  const personColor = getPersonColor(expense.paidBy, members);

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(expense.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, { borderLeftColor: personColor }]}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <View style={[styles.categoryDot, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon} size={14} color="#fff" />
            </View>
            <Text style={styles.description} numberOfLines={1}>
              {expense.description}
            </Text>
          </View>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.metaRow}>
            <View style={[styles.personBadge, { backgroundColor: personColor + '20' }]}>
              <Text style={[styles.personText, { color: personColor }]}>
                {expense.paidBy}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(expense.date)}</Text>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEdit(expense)}
            >
              <Ionicons name="pencil" size={16} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={16} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 8,
  },
  categoryDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  personBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  personText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  categoryLabel: {
    fontSize: 11,
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
});
