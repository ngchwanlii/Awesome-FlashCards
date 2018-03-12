import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { green, white } from '../utils/colors';

export const MessageBox = ({
  customBoxStyle,
  customIconBoxStyle,
  customTextBoxStyle,
  message,
  textColor,
  textSize,
  hasIcon,
  icon: IconComp,
  iconColor,
  iconName,
  iconSize,
}) => {
  return (
    <View style={[styles.container, customBoxStyle]}>
      {!hasIcon ? null : (
        <View style={[styles.iconBox, customIconBoxStyle]}>
          <IconComp name={iconName} size={iconSize} color={iconColor} />
        </View>
      )}
      <View style={[styles.textBox, customTextBoxStyle]}>
        <Text style={{ color: textColor, fontSize: textSize }}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    flexDirection: 'row',
    backgroundColor: white,
    marginTop: 30,
    marginBottom: 30,
    height: 40,
    shadowRadius: 3,
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  iconBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: green,
  },
  textBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
});
