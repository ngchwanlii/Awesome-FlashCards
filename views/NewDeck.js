import React, {Component} from 'react';
import {Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, TextInput, View} from 'react-native';
import {baseColor, white} from '../utils/colors';
import ButtonComp from '../components/ButtonComp';
import {Common} from '../utils/common';

class NewDeck extends Component {
  state = {
    deckTitle: null
  };

  handleTitleInput = deckTitle => {
    this.setState({deckTitle});
  };

  handleSubmit = () => {
    const {deckTitle} = this.state;

    if (!deckTitle) {
      Alert.alert('Error', 'Please enter your deck title', [{text: 'OK'}], {
        cancelable: false
      });
      return;
    }

    const {onAddNewDeck} = this.props.screenProps;
    onAddNewDeck(deckTitle);
    this.props.navigation.goBack();
    this.textInput.clear();
    Keyboard.dismiss();
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            resizeMode="contain"
            style={styles.img}
            source={require('../assets/images/write-title-icon.png')}
          />
        </View>
        <View style={styles.btmContainer}>
          <TextInput
            ref={input => (this.textInput = input)}
            style={styles.input}
            onChangeText={this.handleTitleInput}
            placeholder="Please enter your new deck title"
            underlineColorAndroid="transparent"
            onSubmitEditing={Keyboard.dismiss}
          />
          <ButtonComp
            title="Submit"
            style={styles.submitBtn}
            textStyle={styles.submitBtnText}
            onPress={this.handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  imgContainer: {
    flex: 1,
    padding: Common.PADDING,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: '100%',
    height: '100%'
  },
  btmContainer: {
    flex: 1,
    padding: Common.PADDING,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    flexDirection: 'row',
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    padding: 5,
    borderColor: baseColor,
    borderWidth: 2
  },
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: Common.BUTTON_BORDER_RADIUS,
    height: 50,
    backgroundColor: baseColor
  },
  submitBtnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: white
  }
});

export default NewDeck;
