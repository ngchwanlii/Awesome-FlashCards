import React from 'react';
import { Platform } from 'react-native';
import { getExpiredTime } from './notification';

export const getNumberTextFormat = (num, sourceText) => {
  let text = `${num} ${sourceText}`;
  if (num > 0 && num !== 1) {
    text = text + `s`;
  }
  return text;
};

export const isDailyQuizExpired = quizExpiredTime => {
  let now = new Date();
  now.setDate(now.getDate());
  return now >= quizExpiredTime;
};

export const needDailyReminder = granted => {
  return granted && isDailyQuizExpired(getExpiredTime());
};

export const isIOS = Platform.OS === 'ios';
