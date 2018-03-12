import React from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Common } from '../utils/common';
import { baseColor, black, white } from '../utils/colors';
import ButtonComp from '../components/ButtonComp';
import { Ionicons } from '@expo/vector-icons';
import { MessageBox } from '../components/MessageBox';
import { isIOS } from '../utils/helpers';
import RadioForm from 'react-native-simple-radio-button';

class AddCard extends React.PureComponent {
  static navigationOptions = () => {
    return {
      title: 'Add Card',
      headerTintColor: white,
      headerStyle: Common.BASE_HEADER_STYLE,
      headerTitleStyle: Common.HEADER_TITLE_STYLE,
      headerBackTitleStyle: Common.HEADER_BACK_TITLE_STYLE,
    };
  };

  state = {
    question: null,
    modelAnswer: null,
    answer: true,
    submitted: false,
  };

  handleQuestionInput = question => {
    this.setState({ question });
  };

  handleModelAnswerInput = modelAnswer => {
    this.setState({ modelAnswer });
  };

  handleSubmit = () => {
    const { question, modelAnswer, answer } = this.state;

    let errorMessages = [];

    if (!question) {
      errorMessages.push('No input in question placeholder');
    }
    if (!modelAnswer) {
      errorMessages.push('No input in written modelAnswer placeholder');
    }
    if (answer === null) {
      errorMessages.push(
        'Must select true or false for answering the question',
      );
    }

    if (!question || !modelAnswer || answer == null) {
      Alert.alert(
        'Error',
        errorMessages
          .map((e, i) => {
            return `${i + 1}. ${e}`;
          })
          .join('\n'),
        [{ text: 'OK' }],
        { cancelable: false },
      );
      return;
    }

    const { screenProps, navigation } = this.props;
    const { onAddNewCard } = screenProps;
    const { id } = navigation.state.params;
    onAddNewCard(id, {
      question,
      modelAnswer,
      answer,
    });
    this.questionInput.clear();
    this.modelAnswerInput.clear();
    this.setState({
      submitted: true,
      answer: true,
      question: null,
      modelAnswer: null,
    });
    Keyboard.dismiss();
  };

  handleRestart = () => {
    this.setState({ submitted: false, question: null, modelAnswer: null });
  };

  navigateGoBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { submitted } = this.state;

    if (submitted) {
      return (
        <View style={styles.container}>
          <MessageBox
            customBoxStyle={styles.messageBoxContainerStyle}
            message="Successfully submitted!"
            textColor={black}
            textSize={15}
            hasIcon={true}
            icon={Ionicons}
            iconColor={white}
            iconName={`${isIOS ? 'ios' : 'md'}-checkmark-circle-outline`}
            iconSize={25}
          />
          <View style={[styles.viewContainer, { flex: 3, marginTop: 10 }]}>
            <ButtonComp
              title="Add More Cards"
              style={styles.addCardBtn}
              textStyle={styles.addCardBtnText}
              onPress={this.handleRestart}
            />
            <ButtonComp
              title="Go Back"
              style={styles.btn}
              textStyle={styles.btnText}
              onPress={this.navigateGoBack}
            />
          </View>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.qAContainer}>
            <Text style={styles.text}>Question</Text>
            <TextInput
              multiline
              ref={input => (this.questionInput = input)}
              style={styles.input}
              onChangeText={this.handleQuestionInput}
              placeholder="Enter question here"
              underlineColorAndroid="transparent"
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.text}>Model Answer</Text>
            <TextInput
              multiline
              ref={input => (this.modelAnswerInput = input)}
              style={styles.input}
              onChangeText={this.handleModelAnswerInput}
              placeholder="Enter answer here"
              underlineColorAndroid="transparent"
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.text}>True or False</Text>
            <RadioForm
              radio_props={[
                { label: 'True', value: 0 },
                { label: 'False', value: 1 },
              ]}
              initial={0}
              style={{ marginTop: 10 }}
              labelStyle={{ marginRight: 10 }}
              formHorizontal={true}
              animation={true}
              buttonSize={10}
              buttonInnerColor={baseColor}
              buttonOuterColor={baseColor}
              onPress={value => {
                this.setState({ answer: value ? false : true });
              }}
            />
          </View>
          <View style={styles.btnContainer}>
            <ButtonComp
              title="Submit"
              style={styles.btn}
              textStyle={styles.btnText}
              onPress={this.handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Common.PADDING,
    alignItems: 'center',
  },
  messageBoxContainerStyle: {
    marginTop: 30,
    marginBottom: 30,
  },
  viewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
  qAContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 60,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: baseColor,
    borderWidth: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnContainer: {
    flex: 1,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: Common.BUTTON_BORDER_RADIUS,
    height: 50,
    backgroundColor: baseColor,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: white,
  },
  addCardBtn: {
    height: 50,
    width: '100%',
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
});

export default AddCard;
