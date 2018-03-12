import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { white } from '../utils/colors';

class Paper extends React.Component {
  render() {
    const { children, paperContainerStyle, paperContentStyle } = this.props;

    return (
      <View style={[styles.container, paperContainerStyle]}>
        <ScrollView
          scrollEnabled
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={[styles.innerContentContainer, paperContentStyle]}>
            {children}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // default
  container: {
    flex: 1,
    backgroundColor: white,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    shadowRadius: 3,
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  contentContainer: {
    flexGrow: 1
  },
  innerContentContainer: {
    flex: 1,
    alignItems: 'center',
  }
});

export default Paper;
