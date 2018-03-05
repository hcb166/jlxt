

import React from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import flattenStyle from 'flattenStyle'

import {COLOR} from '../../config'

export default ({text, onPress, containerStyle, textStyle}) => {
  let {fontSize} = flattenStyle(textStyle || styles.text)
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, {padding: Math.round(fontSize / 2)},
        containerStyle]}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 5,
    width:50,
    textAlign: 'center',
    color: COLOR.textEmpha,
    backgroundColor: COLOR.backgroundInput,
  },
  text: {
    fontSize: 14
  }
})
