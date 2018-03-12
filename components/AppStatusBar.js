import React from 'react'
import {Constants} from 'expo'
import {StatusBar, View} from "react-native";

function AppStatusBar({backgroundColor, ...props}) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

export default AppStatusBar