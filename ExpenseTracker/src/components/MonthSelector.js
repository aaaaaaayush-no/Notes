import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMonthLabel } from '../utils/helpers';

export default function MonthSelector({ currentMonth, onPrev, onNext }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPrev}>
        <Ionicons name="chevron-back" size={24} color="#6C5CE7" />
      </TouchableOpacity>

      <View style={styles.labelContainer}>
        <Ionicons name="calendar-outline" size={18} color="#6C5CE7" />
        <Text style={styles.label}>{getMonthLabel(currentMonth)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Ionicons name="chevron-forward" size={24} color="#6C5CE7" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0edff',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});
