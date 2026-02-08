import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../contexts/ExpenseContext';
import { useApp } from '../contexts/AppContext';
import {
  getCurrentMonthKey,
  getMonthLabel,
  filterExpensesByMonth,
  exportToCSV,
} from '../utils/helpers';
import MonthSelector from '../components/MonthSelector';

export default function SettingsScreen() {
  const { expenses } = useExpenses();
  const { user, members, groupId, isFirebaseConnected, logout, updateMembers } = useApp();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());
  const [newMember, setNewMember] = useState('');

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

  const monthlyExpenses = useMemo(
    () => filterExpensesByMonth(expenses, currentMonth),
    [expenses, currentMonth]
  );

  const handleExport = async () => {
    const label = getMonthLabel(currentMonth);
    const csv = exportToCSV(monthlyExpenses, label);
    try {
      await Share.share({
        message: csv,
        title: `Expenses - ${label}`,
      });
    } catch (error) {
      Alert.alert('Export Error', 'Could not share the report.');
    }
  };

  const handleAddMember = () => {
    Alert.prompt(
      'Add Member',
      'Enter the name of the new member:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (name) => {
            if (name && name.trim() && !members.includes(name.trim())) {
              updateMembers([...members, name.trim()]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleRemoveMember = (member) => {
    if (members.length <= 2) {
      Alert.alert('Cannot Remove', 'You need at least 2 members.');
      return;
    }
    Alert.alert(
      'Remove Member',
      `Remove ${member} from the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => updateMembers(members.filter((m) => m !== member)),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Leave Group',
      'This will clear all local data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="person" size={20} color="#6C5CE7" />
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue}>{user?.name || 'N/A'}</Text>
          </View>
          {groupId && (
            <View style={styles.row}>
              <Ionicons name="people" size={20} color="#6C5CE7" />
              <Text style={styles.rowLabel}>Group Code</Text>
              <Text style={styles.rowValue}>{groupId}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Ionicons
              name={isFirebaseConnected ? 'cloud-done' : 'cloud-offline'}
              size={20}
              color={isFirebaseConnected ? '#00b894' : '#e74c3c'}
            />
            <Text style={styles.rowLabel}>Sync</Text>
            <Text
              style={[
                styles.rowValue,
                { color: isFirebaseConnected ? '#00b894' : '#e74c3c' },
              ]}
            >
              {isFirebaseConnected ? 'Connected' : 'Local Only'}
            </Text>
          </View>
        </View>
      </View>

      {/* Members */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members</Text>
          <TouchableOpacity onPress={handleAddMember} style={styles.addBtn}>
            <Ionicons name="person-add" size={18} color="#6C5CE7" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {members.map((member) => (
            <View key={member} style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.memberName}>{member}</Text>
                {member === user?.name && (
                  <Text style={styles.youBadge}>You</Text>
                )}
              </View>
              {member !== user?.name && (
                <TouchableOpacity onPress={() => handleRemoveMember(member)}>
                  <Ionicons name="close-circle" size={22} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Export */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Report</Text>
        <MonthSelector
          currentMonth={currentMonth}
          onPrev={() => navigateMonth(-1)}
          onNext={() => navigateMonth(1)}
        />
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.exportButtonText}>
            Export {getMonthLabel(currentMonth)} ({monthlyExpenses.length} expenses)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Leave Group & Clear Data</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  addBtn: {
    padding: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  youBadge: {
    fontSize: 11,
    color: '#6C5CE7',
    fontWeight: '600',
    backgroundColor: '#f0edff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e74c3c',
    gap: 8,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 15,
    fontWeight: '600',
  },
});
