import React, {Component} from 'react';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {baseColor, black, gray, white} from '../utils/colors';
import {getDecks} from '../utils/api';
import {Common} from '../utils/common';
import {getNumberTextFormat, isIOS} from '../utils/helpers';
import {getDailyReminder} from '../utils/notification';
import {MessageBox} from '../components/MessageBox';

class DeckItem extends React.PureComponent {
  onPress = () => {
    const {onPressItem, id, title} = this.props;
    onPressItem(id, title);
  };

  render() {
    const {id, title, cardText} = this.props;
    return (
      <View style={styles.deckItem}>
        <TouchableOpacity key={id} onPress={this.onPress}>
          <Text style={styles.deckTitle}>{title}</Text>
          <Text style={styles.cardText}>{cardText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class Decks extends Component {
  state = {
    refreshing: false
  };

  handleKeyExtractor = item => item.id;

  handleOnPressItem = (id, title) => {
    this.props.navigation.navigate('Deck', {
      id,
      title
    });
  };

  handleRefresh = () => {
    this.setState({refreshing: true});
    getDecks().then(decks => {
      this.setState({refreshing: false});
      this.props.onDecksUpdate(decks);
    });
  };

  renderItem = ({item}) => {
    return (
      <DeckItem
        id={item.id}
        title={item.title}
        cardText={getNumberTextFormat(item.cards.length, 'card')}
        onPressItem={this.handleOnPressItem}
      />
    );
  };

  renderHeader = () => (
    <View>
      <Text style={styles.decksListTitle}>Decks</Text>
    </View>
  );

  render() {
    const {decks, granted, completedOneQuiz} = this.props;
    return (
      <View style={styles.container}>
        {granted &&
        !completedOneQuiz && (
          <MessageBox
            customBoxStyle={styles.messageBoxContainerStyle}
            message={getDailyReminder()}
            textColor={black}
            textSize={12}
            hasIcon={true}
            icon={isIOS ? Ionicons : MaterialCommunityIcons}
            customIconBoxStyle={styles.iconBox}
            iconColor={white}
            iconName={
              isIOS ? 'ios-information-circle-outline' : 'information-outline'
            }
            iconSize={25}
          />
        )}
        <FlatList
          data={decks}
          renderItem={this.renderItem}
          keyExtractor={this.handleKeyExtractor}
          ListHeaderComponent={this.renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              tintColor={baseColor}
              title="Fetching decks..."
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Common.PADDING
  },
  headerText: {
    // fontSize: 20,
    // color: white,
  },
  deckItem: {
    height: 50,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: white,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.12)'
  },
  decksListTitle: {
    fontSize: 20,
    height: 50,
    padding: 10,
    fontWeight: 'bold'
  },
  deckTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  cardText: {
    fontSize: 12,
    color: gray
  },
  messageBoxContainerStyle: {
    alignSelf: 'center',
    width: '100%',
    marginTop: 30,
    marginBottom: 30
  },
  iconBox: {
    backgroundColor: baseColor
  }
});

export default Decks;
