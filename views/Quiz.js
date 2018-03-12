import React from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  baseColor,
  black,
  green,
  lgBlue,
  red,
  white,
  whitesmoke,
} from '../utils/colors';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Common } from '../utils/common';
import Swiper from 'react-native-swiper';
import Paper from '../components/Paper';
import ButtonComp from '../components/ButtonComp';
import { Constants } from 'expo';
import { NavigationActions, StackNavigator } from 'react-navigation';
import {clearLocalNotification, setLocalNotification} from "../utils/notification";

class Quiz extends React.Component {
  static navigationOptions = () => {
    return {
      title: 'Quiz',
      headerTintColor: white,
      headerStyle: Common.BASE_HEADER_STYLE,
      headerTitleStyle: Common.HEADER_TITLE_STYLE,
      headerBackTitleStyle: Common.HEADER_BACK_TITLE_STYLE,
    };
  };

  state = {
    cards: [],
    trackResults: {},
    showAnswer: false,
    finished: false,
    countScore: 0,
    refresh: false,
  };

  componentWillMount() {
    this.setupFlipAnimation();
    this.setupTextAnimation();
    this.setupSpringAnimation();
    this.setupSwingAnimation();
    this.setupFadeAnimation();
    this.setupButtonAnimation();
  }

  componentDidMount() {
    const { screenProps, navigation } = this.props;
    const { id } = navigation.state.params;
    const cards = screenProps.decks[id].cards;

    let trackResults = cards.reduce((trackResults, card, i) => {
      return {
        ...trackResults,
        [i]: {
          answered: false,
          userAnswer: null,
          result: null,
          needToCompleteQuiz: false,
        },
      };
    }, {});
    this.setState({ cards, trackResults });
  }

  navigateToRestartQuizView = () => {
    const { navigation } = this.props;
    const { key } = navigation.state;
    const { id } = navigation.state.params;
    const resetAction = NavigationActions.replace({
      key,
      routeName: 'Quiz',
      params: { id },
    });
    this.props.navigation.dispatch(resetAction);
  };

  navigateBackToDeckView = () => {
    this.props.navigation.goBack();
  };

  setupButtonAnimation = () => {
    this.fadeButtonAnimValue = new Animated.Value(0);
  };

  setupFadeAnimation = () => {
    this.fadeAnimValue = new Animated.Value(0);
  };

  fade = (animatedElemValue, delay = 0) => {
    Animated.timing(animatedElemValue, {
      toValue: 1,
      duration: 1500,
      delay,
      easing: Easing.linear,
    }).start();
  };

  setupSwingAnimation = () => {
    this.swingAnimValue = new Animated.Value(0);
    this.swingInterpolate = this.swingAnimValue.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: ['0deg', '15deg', '-10deg', '5deg', '-5deg', '0deg'],
    });
  };

  swingAndFade(delay) {
    this.scoreFadeAnimValue = new Animated.Value(0);
    Animated.parallel([
      Animated.timing(this.scoreFadeAnimValue, {
        toValue: 1,
        duration: 2500,
        delay,
        easing: Easing.linear,
      }),
      Animated.timing(this.swingAnimValue, {
        toValue: 1,
        duration: 2500,
        delay,
        easing: Easing.linear,
      }),
    ]).start();
  }

  setupSpringAnimation = () => {
    this.springAnimValue = new Animated.Value(0.3);
  };

  spring() {
    Animated.spring(this.springAnimValue, {
      toValue: 1,
      friction: 0.8,
      tension: 1,
    }).start();
  }

  setupTextAnimation = () => {
    this.textAnimValue = new Animated.Value(0);
    this.mainDisplayInterpolate = this.textAnimValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [24, 36, 24],
    });
    this.subDisplayInterpolate = this.textAnimValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [18, 24, 18],
    });
  };

  textAnim() {
    Animated.timing(this.textAnimValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
    }).start();
  }

  flipCard() {
    Animated.spring(this.animatedValue, {
      toValue: this.value >= 90 ? 0 : 180,
      tension: 1,
    }).start();
  }

  setupFlipAnimation = () => {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 90],
      outputRange: ['0deg', '180deg'],
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 90],
      outputRange: ['0deg', '180deg'],
    });
  };

  renderPagination = (index, total) => {
    return (
      <View style={styles.paginationStyle}>
        <Text style={styles.paginationText}>
          {index + 1} of {total}
        </Text>
      </View>
    );
  };

  handleShowAnswer = () => {
    this.flipCard();
    this.setState(prevState => {
      return {
        showAnswer: !prevState.showAnswer,
      };
    });
  };

  handleResetBeforeNextCard = i => {
    const { showAnswer } = this.state;
    if (showAnswer) {
      this.setupFlipAnimation();
      this.setState(prevState => {
        return {
          showAnswer: !prevState.showAnswer,
        };
      });
    }
  };

  handleCheckQuizAndScore = () => {
    const { trackResults, cards } = this.state;
    let collectUnfinishedQuiz = [];
    // countOnCorrectAnswer
    Object.keys(cards).forEach((card, i) => {
      if (trackResults[i].answered === false) {
        collectUnfinishedQuiz = collectUnfinishedQuiz.concat(parseInt(i) + 1);
      }
    });
    return collectUnfinishedQuiz;
  };

  handleLastQuizCheck = i => {
    const { cards } = this.state;
    return i === cards.length - 1;
  };

  handleCheckFinishStatus = i => {
    let isLastQuiz = this.handleLastQuizCheck(i);
    let remainingQuiz = this.handleCheckQuizAndScore();
    let allQuizFinish = remainingQuiz.length === 0;

    if (isLastQuiz && !allQuizFinish) {
      Alert.alert(
        'Error',
        `You must finish all quiz.\nThe remaining quizzes are number:\n${remainingQuiz.join(
          ', ',
        )}`,
        [{ text: 'OK' }],
        { cancelable: false },
      );
      this.setState({ needToCompleteQuiz: true });
      return;
    }

    if (!isLastQuiz) {
      return null;
    }

    const {screenProps} = this.props
    const {granted, onCompleteOneQuiz} = screenProps

    if(granted){
      clearLocalNotification().then(setLocalNotification)
    }

    onCompleteOneQuiz()
    setTimeout(() => {
      this.setState({
        finished: true,
      });

    }, 500);
  };

  handleCheckAnswer = (cardAnswer, userAnswer) => cardAnswer === userAnswer;

  handlePressCompleteQuiz = (card, i) => {
    this.handleCheckFinishStatus(i);
  };

  renderQuizScore = () => {
    const { countScore, cards } = this.state;
    return `${countScore}/${cards.length}`;
  };

  handlePressAnswerBtn = (userAnswer, card, i) => {
    const { trackResults } = this.state;
    let curCardResult = trackResults[i];
    let answered = true;
    let result = this.handleCheckAnswer(card.answer, userAnswer);

    this.setState(
      prevState => ({
        trackResults: {
          ...trackResults,
          [i]: {
            ...curCardResult,
            answered,
            userAnswer,
            result,
          },
        },
        countScore: result ? prevState.countScore + 1 : prevState.countScore,
      }),
      () => this.handleCheckFinishStatus(i),
    );
  };

  render() {
    const {
      cards,
      showAnswer,
      trackResults,
      needToCompleteQuiz,
      finished,
    } = this.state;

    // animation
    const frontAnimatedStyle = {
      transform: [{ rotateX: this.frontInterpolate }],
    };
    const backAnimatedStyle = {
      transform: [{ rotateX: this.backInterpolate }],
    };
    const flipStyle = !showAnswer ? frontAnimatedStyle : backAnimatedStyle;

    if (finished) {
      this.spring();
      this.fade(this.fadeAnimValue);
      this.swingAndFade(800);
      this.fade(this.fadeButtonAnimValue, 1500);
      let totalScore = this.renderQuizScore();

      return (
        <Modal
          animationType="fade"
          transparent={false}
          visible={true}
          onRequestClose={() => console.log('closing quiz score view')}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalWrapper}>
              <View style={styles.modalInnerWrapper}>
                <View style={styles.displayQuizContainer}>
                  <Animated.Text
                    style={[
                      styles.displayQuizResultLabel,
                      {
                        fontSize: this.mainDisplayInterpolate,
                        transform: [{ scale: this.springAnimValue }],
                      },
                    ]}
                  >
                    <FontAwesome
                      style={{ marginRight: 10 }}
                      name="thumbs-o-up"
                      size={24}
                      color={white}
                    />
                    {`   Congratulation!`}
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      styles.displayQuizResultLabel,
                      {
                        fontSize: this.subDisplayInterpolate,
                        transform: [{ scale: this.springAnimValue }],
                      },
                    ]}
                  >
                    You have completed the quiz!
                  </Animated.Text>
                </View>
                <Animated.Text
                  style={[styles.scoreLabel, { opacity: this.fadeAnimValue }]}
                >
                  Score:
                </Animated.Text>
                <View style={styles.displayScoreViewContainer}>
                  <Animated.View
                    style={[
                      {
                        opacity: this.scoreFadeAnimValue,
                        transform: [{ rotate: this.swingInterpolate }],
                      },
                      styles.quizScoreView,
                    ]}
                  >
                    <Text style={styles.scoreText}>{totalScore}</Text>
                  </Animated.View>
                </View>
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    opacity: this.fadeButtonAnimValue,
                  }}
                >
                  <ButtonComp
                    icon={
                      <MaterialCommunityIcons
                        name="restart"
                        style={{ marginRight: 5 }}
                        size={18}
                        color={black}
                      />
                    }
                    style={styles.btmBtn}
                    textStyle={styles.btmBtnText}
                    title="Restart Quiz"
                    onPress={this.navigateToRestartQuizView}
                  />
                  <ButtonComp
                    icon={
                      <MaterialCommunityIcons
                        name="keyboard-backspace"
                        style={{ marginRight: 5 }}
                        size={18}
                        color={white}
                      />
                    }
                    style={[styles.btmBtn, { backgroundColor: black }]}
                    textStyle={[styles.btmBtnText, { color: white }]}
                    title="Go Back to Deck"
                    onPress={this.navigateBackToDeckView}
                  />
                </Animated.View>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    return (
      cards && (
        <View style={styles.container}>
          <View style={[styles.quizContainer]}>
            <Swiper
              loop={false}
              showsButtons={true}
              onIndexChanged={this.handleResetBeforeNextCard}
              renderPagination={this.renderPagination}
            >
              {cards.map((card, i) => {
                const { answered, result, userAnswer } = trackResults[i];
                let isLastQuiz = this.handleLastQuizCheck(i);
                return (
                  <View key={card.question + i} style={{ flex: 1 }}>
                    <Animated.View style={[flipStyle, { flex: 2 }]}>
                      <Paper
                        paperContainerStyle={styles.paperContainer}
                        paperContentStyle={styles.paperContent}
                      >
                        <Text style={styles.text}>
                          {!showAnswer ? card.question : card.modelAnswer}
                        </Text>
                        <ButtonComp
                          title={
                            !showAnswer ? '🤔 Show Answer' : '😎 Show Question'
                          }
                          style={styles.showAnsBtn}
                          textStyle={styles.showAnsText}
                          onPress={this.handleShowAnswer}
                        />
                      </Paper>
                    </Animated.View>
                    <View style={styles.btmGroup}>
                      <View style={styles.resultContainer}>
                        {result !== null ? (
                          <Text style={styles.resultText}>
                            {`Result: `}
                            {result ? (
                              <Text
                                style={[styles.resultText, { color: green }]}
                              >
                                Correct!
                              </Text>
                            ) : (
                              <Text style={[styles.resultText, { color: red }]}>
                                False!
                              </Text>
                            )}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.btnGroup}>
                        <ButtonComp
                          disabled={answered}
                          title="Correct"
                          style={
                            userAnswer === true
                              ? styles.selectedBtn
                              : styles.btn
                          }
                          textStyle={
                            userAnswer === true
                              ? styles.selectedBtnText
                              : styles.btnText
                          }
                          onPress={() =>
                            this.handlePressAnswerBtn(true, card, i)
                          }
                        />
                        <ButtonComp
                          disabled={answered}
                          title="Incorrect"
                          style={
                            userAnswer === false
                              ? styles.selectedBtn
                              : styles.btn
                          }
                          textStyle={
                            userAnswer === false
                              ? styles.selectedBtnText
                              : styles.btnText
                          }
                          onPress={() =>
                            this.handlePressAnswerBtn(false, card, i)
                          }
                        />
                      </View>
                      {isLastQuiz &&
                        needToCompleteQuiz && (
                          <ButtonComp
                            title="Complete Quiz"
                            style={styles.completeQuizBtn}
                            textStyle={styles.completeQuizBtnText}
                            onPress={() =>
                              this.handlePressCompleteQuiz(card, i)
                            }
                          />
                        )}
                    </View>
                  </View>
                );
              })}
            </Swiper>
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: baseColor,
  },
  modalWrapper: {
    flex: 1,
    flexDirection: 'row',
    padding: Common.PADDING,
    marginTop: Constants.statusBarHeight,
  },
  modalInnerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  displayQuizContainer: {
    flex: 1,
    marginTop: -10,
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  displayQuizResultLabel: {
    fontWeight: 'bold',
    color: white,
    marginTop: 10,
    marginBottom: 10,
  },
  displayScoreViewContainer: {
    flex: 0.5,
    flexDirection: 'row',
    width: '80%',
    marginTop: 25,
    marginBottom: 10,
  },
  quizScoreView: {
    flex: 1,
    maxHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: white,
    borderWidth: 2,
    alignItems: 'center',
  },
  scoreLabel: {
    color: white,
    marginTop: 20,
    fontSize: 40,
    fontWeight: 'bold',
  },
  scoreText: {
    fontWeight: 'bold',
    color: black,
    fontSize: 20,
  },
  btmBtn: {
    flex: 1,
    height: 50,
    margin: 10,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.BUTTON_BORDER_RADIUS,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
  },
  btmBtnText: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  quizContainer: {
    flex: 2,
    padding: Common.PADDING,
    marginTop: Common.PADDING * 2,
    flexDirection: 'row',
  },
  paperContainer: {
    flex: 2,
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    elevation: 1,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },
  paperContent: {
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  paginationText: {
    color: black,
    fontSize: 15,
  },
  paginationStyle: {
    position: 'absolute',
    left: '45%',
    top: -20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: black,
    marginTop: 50,
    marginBottom: 5,
  },
  showAnsBtn: {
    position: 'absolute',
    bottom: 30,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: Common.BUTTON_BORDER_RADIUS,
    borderColor: black,
    borderWidth: 1,
    backgroundColor: whitesmoke,
  },
  showAnsText: {
    fontSize: 14,
    color: black,
  },
  btmGroup: {
    flex: 1,
    padding: Common.PADDING,
    alignItems: 'center',
  },
  resultContainer: {
    flex: 1,
    maxHeight: 20,
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: black,
    marginLeft: 10,
    marginRight: 10,
  },
  btnGroup: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  btn: {
    flex: 1,
    height: 50,
    margin: 10,
    borderColor: baseColor,
    borderWidth: 2,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.BUTTON_BORDER_RADIUS,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: baseColor,
  },
  completeQuizBtn: {
    flex: 1,
    width: '95%',
    height: 50,
    margin: 10,
    borderWidth: 2,
    backgroundColor: black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.BUTTON_BORDER_RADIUS,
  },
  completeQuizBtnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: white,
  },
  selectedBtn: {
    flex: 1,
    height: 50,
    margin: 10,
    backgroundColor: baseColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.BUTTON_BORDER_RADIUS,
  },
  selectedBtnText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: white,
  },
});

export default Quiz;
