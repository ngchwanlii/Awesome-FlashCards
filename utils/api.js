import { AsyncStorage } from 'react-native';
import { addOrderedId, DECKS_STORAGE_KEY, getDummyData } from './decks';

const uuidv4 = require('uuid/v4');

export function getDecks() {
  return AsyncStorage.getItem(DECKS_STORAGE_KEY).then(data => {
    if (!data) {
      data = JSON.stringify(getDummyData());
      AsyncStorage.setItem(DECKS_STORAGE_KEY, data);
    }
    return JSON.parse(data);
  });
}

export async function getDeck(id) {
  let res, value;
  try {
    value = await AsyncStorage.getItem(DECKS_STORAGE_KEY)
      .then(JSON.parse)
      .then(decks => (res = decks[id]));
  } catch (err) {
    console.log('Error in AsyncStorage.getDeck(id: string): ', err);
  }
  return res;
}

export function saveDecksTitle(title) {
  let id = uuidv4();
  let timestamp = Date.now();
  addOrderedId(id);
  return AsyncStorage.mergeItem(
    DECKS_STORAGE_KEY,
    JSON.stringify({ [id]: { title, id, timestamp, cards: [] } }),
  );
}

export async function addCardToDeck(id, card) {
  let res;
  try {
    res = await AsyncStorage.getItem(DECKS_STORAGE_KEY)
      .then(JSON.parse)
      .then(decks => {
        let deck = decks[id];
        return AsyncStorage.mergeItem(
          DECKS_STORAGE_KEY,
          JSON.stringify({
            [id]: {
              ...deck,
              ['cards']: deck.cards.concat(card),
            },
          }),
        );
      });
  } catch (err) {
    console.log('Error in addCardToDeck(id: string, card: object): ', err);
  }
  return res;
}
