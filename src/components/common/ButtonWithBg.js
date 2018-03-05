

import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import flattenStyle from 'flattenStyle'

import {COLOR} from '../../config'

export default ({text, disable = false, onPress, containerStyle,
  textStyle}) => {
  let {fontSize} = flattenStyle(textStyle || styles.text)
  containerStyle = [styles.container,
    (disable ? styles.containerDisable : null),
    {padding: Math.round(fontSize / 2)}, containerStyle]
  let children = <Text
    style={[styles.text, (disable ? styles.textDisable : null), textStyle]}
  >{text}</Text>
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        {children}
      </TouchableOpacity>
    )
  } else {
    return (
      <View style={containerStyle}>
        {children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.backgroundRedButton,
    borderRadius: 5
  },
  containerDisable: {
    backgroundColor: COLOR.backgroundDarker
  },
  text: {
    color: COLOR.textLightNormal,
    fontSize: 16
  },
  textDisable: {
    color: COLOR.textPrompt
  }
})
