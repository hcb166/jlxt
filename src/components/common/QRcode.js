
import React from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native'

import {COLOR} from '../../config'
import * as components from '../'

export default ({text, containerStyle, style, onPress}) => {
  let topChild = <Image style={[styles.qrcode, style]} source={require('../../../res/img/sys.png')}/>
  let bottomChild = (
    <Text style={[styles.text, style]}>{text}</Text>
  )
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress} 
        style={[styles.container, containerStyle]}
      >
        {topChild}
        {bottomChild}
      </TouchableOpacity>
    )
  } else {
    return (
      <View style={[styles.container, containerStyle]}>
        {topChild}
        {bottomChild}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
    marginLeft:20
  },
  qrcode: {
    width:24,
    height:24,
  },
  text: {
    fontSize: 12,
    backgroundColor: 'transparent',
  },
})
