import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Font } from 'expo';
import NewDeck from './views/NewDeck';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { baseColor, gray, white, whitesmoke } from './utils/colors';
import Decks from './views/Decks';
import AppStatusBar from './components/AppStatusBar';
import { addCardToDeck, getDecks, saveDecksTitle } from './utils/api';
import { orderedIds } from './utils/decks';
import Deck from './views/Deck';
import { Common } from './utils/common';
import AddCard from './views/AddCard';
import Quiz from './views/Quiz';
import { isIOS, needDailyReminder } from './utils/helpers';
import { setLocalNotification } from './utils/notification';

const Tabs = TabNavigator(
  {
    Decks: {
      screen: ({ screenProps, ...rest }) => {
        const { decks } = screenProps;
        return (
          <Decks
            {...screenProps}
            {...rest}
            decks={decks ? orderedIds.map(id => decks[id]) : decks}
          />
        );
      },
      navigationOptions: {
        title: 'Awesome ⚡ Cards',
        headerTintColor: white,
        headerStyle: Common.BASE_HEADER_STYLE,
        headerTitleStyle: Common.HEADER_TITLE_STYLE,
        tabBarLabel: 'DECKS',
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="checkbox-multiple-blank-outline"
            size={25}
            color={tintColor}
          />
        ),
      },
    },
    NewDeck: {
      screen: NewDeck,
      navigationOptions: {
        header: false,
        tabBarLabel: 'NEW DECK',
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="plus-box-outline"
            size={25}
            color={tintColor}
          />
        ),
      },
    },
  },
  {
    swipeEnabled: true, // fixes a bug in react navigation
    lazy: false,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: baseColor,
      inactiveTintColor: gray,
      indicatorStyle: {
        backgroundColor: isIOS ? null : baseColor,
      },
      tabStyle: {
        flexDirection: isIOS ? 'column' : 'row',
      },
      style: {
        height: 50,
        backgroundColor: whitesmoke,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
    },
  },
);

const MainNavigator = StackNavigator({
  Home: {
    screen: Tabs,
  },
  Deck: {
    screen: Deck,
  },
  AddCard: {
    screen: AddCard,
  },
  Quiz: {
    screen: Quiz,
  },
});

export default class App extends React.Component {
  state = {
    decks: null,
    granted: true,
    fontLoaded: false,
    completedOneQuiz: false,
  };

  handleDecksUpdate = decks => {
    this.setState({ decks });
  };
  handleAddNewDeck = title => {
    saveDecksTitle(title).then(() =>
      getDecks().then(decks => {
        this.setState({ decks });
      }),
    );
  };
  handleAddNewCard = (id, card) => {
    addCardToDeck(id, card).then(() =>
      getDecks().then(decks => {
        this.setState({ decks });
      }),
    );
  };

  handleCompleteOneQuiz = () => {
    this.setState({ completedOneQuiz: true });
  };

  async componentDidMount() {
    await Font.loadAsync({
      Arial: require('./assets/fonts/Arial.ttf'),
    });
    let tmp = await setLocalNotification();
    let decks = await getDecks();
    this.setState({ fontLoaded: true, decks, granted: tmp ? true : false });
  }

  componentDidUpdate() {
    const { granted, completedOneQuiz } = this.state;
    if (granted && completedOneQuiz && needDailyReminder(granted)) {
      this.setState({ completedOneQuiz: false });
    }
  }

  render() {
    const { granted, decks, fontLoaded, completedOneQuiz } = this.state;
    if (!fontLoaded) return null;

    return (
      <View style={styles.container}>
        <AppStatusBar backgroundColor={baseColor} barStyle="light-content" />
        <MainNavigator
          screenProps={{
            decks,
            granted,
            completedOneQuiz,
            onDecksUpdate: this.handleDecksUpdate,
            onAddNewDeck: this.handleAddNewDeck,
            onAddNewCard: this.handleAddNewCard,
            onCompleteOneQuiz: this.handleCompleteOneQuiz,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whitesmoke,
  },
});
