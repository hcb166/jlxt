
import React from 'react'
import {StyleSheet, Text, View, TextInput} from 'react-native'
import * as components from '../'
import {COLOR} from '../../config'

export default ({ onChangeText, placeholder, style, containerStyle, defaultValue, ...props}) => {
  return (
      <TextInput
        placeholderTextColor={COLOR.textPrompt}
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='done'
        underlineColorAndroid='transparent'  
        keyboardType="numeric"
        style={[styles.searchInput,containerStyle]}
        onChangeText={onChangeText}
        defaultValue={defaultValue}
      />
  )
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: COLOR.backgroundInput,
    borderBottomWidth: 0,
    width: 28,
    height: 28,
    fontSize:14,
    padding: 0,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 3,
    textAlign: 'center'
  }
})
