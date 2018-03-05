
import React from 'react'
import {StyleSheet, Text, View, TextInput} from 'react-native'
import * as components from '../'
import {COLOR} from '../../config'

export default ({onChangeText, placeholder, style, ...props}) => {
  return (
    <View style={styles.container}>
      <View>
        <components.Icon
          name='search'
          style={styles.searchIcon}
        />
      </View>
      <TextInput
        placeholder="搜索"
        placeholderTextColor={COLOR.textPrompt}
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='done'
        underlineColorAndroid='transparent'  
        style={styles.searchInput}
        onChangeText={onChangeText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height:40,
    backgroundColor: COLOR.backgroundInput,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  searchInput: {
    borderBottomWidth: 0,
    width: 100,
    fontSize:14,
    marginLeft:-6
  }
})
