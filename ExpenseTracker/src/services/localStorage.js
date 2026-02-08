import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@expense_tracker_user',
  GROUP_ID: '@expense_tracker_group',
  EXPENSES: '@expense_tracker_expenses',
  OFFLINE_QUEUE: '@expense_tracker_offline_queue',
};

// User profile
export async function saveUserProfile(profile) {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function getUserProfile() {
  const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
}

// Group ID
export async function saveGroupId(groupId) {
  await AsyncStorage.setItem(KEYS.GROUP_ID, groupId);
}

export async function getGroupId() {
  return AsyncStorage.getItem(KEYS.GROUP_ID);
}

// Expenses cache
export async function cacheExpenses(expenses) {
  await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
}

export async function getCachedExpenses() {
  const data = await AsyncStorage.getItem(KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
}

// Offline queue
export async function addToOfflineQueue(action) {
  const queue = await getOfflineQueue();
  queue.push(action);
  await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
}

export async function getOfflineQueue() {
  const data = await AsyncStorage.getItem(KEYS.OFFLINE_QUEUE);
  return data ? JSON.parse(data) : [];
}

export async function clearOfflineQueue() {
  await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify([]));
}

// Clear all data
export async function clearAllData() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
