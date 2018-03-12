import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function ButtonComp({ title, icon = undefined, ...props }) {
  const { textStyle } = props;
  return (
    <TouchableOpacity {...props}>
      <View style={styles.btn}>
        {icon}
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
  },
});

export default ButtonComp;
