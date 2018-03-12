const uuidv4 = require('uuid/v4');

export const DECKS_STORAGE_KEY = uuidv4();
export let orderedIds = [];

const defaultDummyData = {
  Food: {
    title: 'Food',
    cards: [
      {
        question: 'Is Orange a food?',
        modelAnswer: 'Nope. Orange is a fruit!',
        answer: false,
      },
      {
        question: 'Is Sriracha come from Thailand?',
        modelAnswer: 'Yes, it is from Thailand!',
        answer: true,
      },
    ],
  },
  React: {
    title: 'React Native',
    cards: [
      {
        question: 'Does React Native work with Android?',
        modelAnswer: 'Yes!',
        answer: true,
      },
    ],
  },
};

export function getDummyData() {
  return Object.keys(defaultDummyData).reduce((data, key) => {
    let id = uuidv4();
    let timestamp = Date.now();
    data[id] = defaultDummyData[key];
    data[id].id = id;
    data[id].timestamp = timestamp;
    orderedIds = [id, ...orderedIds];
    return data;
  }, {});
}

export function addOrderedId(id) {
  orderedIds = [id, ...orderedIds];
}

export function removeOrderedId(idToRemove) {
  orderedIds = orderedIds.filter(id => id !== idToRemove);
}
