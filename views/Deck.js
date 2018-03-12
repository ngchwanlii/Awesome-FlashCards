import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { baseColor, black, gray, white } from '../utils/colors';
import { Common } from '../utils/common';
import Paper from '../components/Paper';
import ButtonComp from '../components/ButtonComp';
import { getNumberTextFormat } from '../utils/helpers';

class Deck extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
      headerTintColor: white,
      headerStyle: Common.BASE_HEADER_STYLE,
      headerTitleStyle: Common.HEADER_TITLE_STYLE,
      headerBackTitleStyle: Common.HEADER_BACK_TITLE_STYLE,
    };
  };

  navigateToAddCardView = () => {
    const { id } = this.props.navigation.state.params;
    this.props.navigation.navigate('AddCard', {
      id,
    });
  };

  navigateToStartQuiz = () => {
    const { screenProps, navigation } = this.props;
    const { id, title } = navigation.state.params;
    const deck = screenProps.decks[id];

    if (deck.cards.length === 0) {
      Alert.alert(
        'Error',
        'You need at least 1 card to start the quiz!',
        [{ text: 'OK' }],
        { cancelable: false },
      );
      return;
    }
    this.props.navigation.navigate('Quiz', { id, title });
  };

  render() {
    const { screenProps, navigation } = this.props;
    const { id } = navigation.state.params;
    const deck = screenProps.decks[id];
    let cardText = getNumberTextFormat(deck.cards.length, 'card');
    return (
      <View style={styles.container}>
        <Paper
          paperContainerStyle={styles.paperContainer}
          paperContentStyle={styles.paperContent}
        >
          <Text style={styles.paperTitle}>{deck.title}</Text>
          <Text style={styles.cardText}>{cardText}</Text>
        </Paper>
        <View style={styles.btnGroupContainer}>
          <ButtonComp
            title="Add Card"
            style={styles.addCardBtn}
            textStyle={styles.addCardBtnText}
            onPress={this.navigateToAddCardView}
          />
          <ButtonComp
            title="Start Quiz"
            style={styles.startQuizBtn}
            textStyle={styles.startQuizBtnText}
            onPress={this.navigateToStartQuiz}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Common.PADDING,
  },
  paperContainer: {
    flex: 2,
  },
  paperContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  paperTitle: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 40,
    fontWeight: 'bold',
    color: black,
  },
  cardText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: 'bold',
    color: gray,
  },
  btnGroupContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  addCardBtn: {
    height: 50,
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    borderColor: baseColor,
    backgroundColor: white,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.BUTTON_BORDER_RADIUS,
  },
  addCardBtnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: baseColor,
  },
  startQuizBtn: {
    height: 50,
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: baseColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.BUTTON_BORDER_RADIUS,
  },
  startQuizBtnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: white,
  },
});

export default Deck;
