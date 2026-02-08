import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getPersonColor } from '../utils/helpers';

export default function PersonFilter({ members, selectedPerson, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          selectedPerson === 'All' && styles.chipSelected,
        ]}
        onPress={() => onSelect('All')}
      >
        <Text
          style={[
            styles.chipText,
            selectedPerson === 'All' && styles.chipTextSelected,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {members.map((member) => {
        const color = getPersonColor(member, members);
        const isSelected = selectedPerson === member;
        return (
          <TouchableOpacity
            key={member}
            style={[
              styles.chip,
              isSelected && { backgroundColor: color, borderColor: color },
            ]}
            onPress={() => onSelect(member)}
          >
            <Text
              style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}
            >
              {member}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 48,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  chipTextSelected: {
    color: '#fff',
  },
});
