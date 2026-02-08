import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { generateGroupCode } from '../utils/helpers';

export default function SetupScreen() {
  const { login, joinGroup, connectFirebase } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [membersList, setMembersList] = useState([]);
  const [groupCode, setGroupCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState('');

  const handleAddMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (membersList.includes(trimmed) || trimmed === name) {
      Alert.alert('Duplicate', 'This member already exists.');
      return;
    }
    setMembersList([...membersList, trimmed]);
    setMemberInput('');
  };

  const handleRemoveMember = (member) => {
    setMembersList(membersList.filter((m) => m !== member));
  };

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    if (membersList.length === 0) {
      Alert.alert('Required', 'Add at least one other member.');
      return;
    }

    const allMembers = [name.trim(), ...membersList];
    const code = generateGroupCode();

    await login(name.trim(), allMembers);
    await joinGroup(code);

    // Optionally connect Firebase
    if (firebaseConfig.trim()) {
      try {
        const config = JSON.parse(firebaseConfig);
        connectFirebase(config);
      } catch (e) {
        // Continue without Firebase - works in local mode
      }
    }
  };

  const handleJoinGroup = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    if (!groupCode.trim()) {
      Alert.alert('Required', 'Please enter a group code.');
      return;
    }

    await login(name.trim(), [name.trim()]);
    await joinGroup(groupCode.trim());

    if (firebaseConfig.trim()) {
      try {
        const config = JSON.parse(firebaseConfig);
        connectFirebase(config);
      } catch (e) {
        // Continue without Firebase
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="wallet" size={40} color="#fff" />
          </View>
          <Text style={styles.appTitle}>Expense Tracker</Text>
          <Text style={styles.appSubtitle}>
            Split expenses easily with your group
          </Text>
        </View>

        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get Started</Text>

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>

            {/* Choice */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.choiceButton, !isJoining && styles.choiceActive]}
                onPress={() => setIsJoining(false)}
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={!isJoining ? '#fff' : '#6C5CE7'}
                />
                <Text
                  style={[
                    styles.choiceText,
                    !isJoining && styles.choiceTextActive,
                  ]}
                >
                  Create Group
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.choiceButton, isJoining && styles.choiceActive]}
                onPress={() => setIsJoining(true)}
              >
                <Ionicons
                  name="enter"
                  size={24}
                  color={isJoining ? '#fff' : '#6C5CE7'}
                />
                <Text
                  style={[
                    styles.choiceText,
                    isJoining && styles.choiceTextActive,
                  ]}
                >
                  Join Group
                </Text>
              </TouchableOpacity>
            </View>

            {!isJoining ? (
              <>
                {/* Add Members */}
                <View style={styles.field}>
                  <Text style={styles.label}>Add Members</Text>
                  <View style={styles.addMemberRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={memberInput}
                      onChangeText={setMemberInput}
                      placeholder="Member name"
                      placeholderTextColor="#999"
                      onSubmitEditing={handleAddMember}
                    />
                    <TouchableOpacity
                      style={styles.addMemberBtn}
                      onPress={handleAddMember}
                    >
                      <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {/* Members List */}
                  {membersList.length > 0 && (
                    <View style={styles.membersList}>
                      {membersList.map((member) => (
                        <View key={member} style={styles.memberChip}>
                          <Text style={styles.memberChipText}>{member}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveMember(member)}
                          >
                            <Ionicons
                              name="close-circle"
                              size={18}
                              color="#888"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleCreateGroup}
                >
                  <Text style={styles.submitText}>Create Group</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Join Group */}
                <View style={styles.field}>
                  <Text style={styles.label}>Group Code</Text>
                  <TextInput
                    style={styles.input}
                    value={groupCode}
                    onChangeText={setGroupCode}
                    placeholder="Enter 6-character code"
                    placeholderTextColor="#999"
                    autoCapitalize="characters"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleJoinGroup}
                >
                  <Text style={styles.submitText}>Join Group</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}

            {/* Firebase Config (Optional) */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setStep(step === 2 ? 1 : 2)}
            >
              <Text style={styles.advancedText}>
                {step === 2 ? 'Hide' : 'Show'} Firebase Config (Optional)
              </Text>
              <Ionicons
                name={step === 2 ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#888"
              />
            </TouchableOpacity>

            {step === 2 && (
              <View style={styles.field}>
                <Text style={styles.label}>Firebase Config JSON</Text>
                <TextInput
                  style={[styles.input, styles.configInput]}
                  value={firebaseConfig}
                  onChangeText={setFirebaseConfig}
                  placeholder='{"apiKey": "...", "databaseURL": "..."}'
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
                <Text style={styles.helpText}>
                  Paste your Firebase config JSON to enable real-time sync across
                  devices. Without this, the app works in local-only mode.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#6C5CE7',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#d4cfff',
    marginTop: 6,
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  configInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  choiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6C5CE7',
    gap: 8,
  },
  choiceActive: {
    backgroundColor: '#6C5CE7',
  },
  choiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  choiceTextActive: {
    color: '#fff',
  },
  addMemberRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addMemberBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0edff',
    borderRadius: 20,
  },
  memberChipText: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  advancedText: {
    fontSize: 13,
    color: '#888',
  },
  helpText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
    lineHeight: 18,
  },
});
