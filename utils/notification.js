import { AsyncStorage } from 'react-native';
import { Notifications, Permissions } from 'expo';

const uuidv4 = require('uuid/v4');

export const NOTIFICATION_STORAGE_KEY = uuidv4();

export async function getExpiredTime() {
  return await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY).then(JSON.parse);
}

export function getDailyReminder() {
  return "👋 Don't forget to complete a quiz for today!";
}

export function clearLocalNotification() {
  return AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync,
  );
}

function createNotification() {
  return {
    title: 'Welcome to Awesome ⚡ Cards',
    body: getDailyReminder(),
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    },
  };
}

export function setLocalNotification() {
  return AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY)
    .then(JSON.parse)
    .then(data => {
      if (data === null) {
        return Permissions.askAsync(Permissions.NOTIFICATIONS).then(
          ({ status }) => {
            if (status === 'granted') {
              console.log('I am granted');
              Notifications.cancelAllScheduledNotificationsAsync();
              let tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              // notification on 9am each day
              tomorrow.setHours(9);
              tomorrow.setMinutes(0);
              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: tomorrow,
                  repeat: 'day',
                },
              );
              AsyncStorage.setItem(
                NOTIFICATION_STORAGE_KEY,
                JSON.stringify(tomorrow),
              );
            }
            return status;
          },
        );
      }
      return 'granted';
    })
    .then(async status => {
      return getExpiredTime();
    });
}
