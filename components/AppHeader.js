import React from 'react';
import {StyleSheet, View} from 'react-native';

function AppHeader({backgroundColor, height, children, ...props}) {
  return (
    <View style={[styles.header, {backgroundColor, height}]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  }
});

export default AppHeader;
