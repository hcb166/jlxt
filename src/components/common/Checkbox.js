import React, { Component } from 'react';
import {StyleSheet, Image, TouchableWithoutFeedback, Style} from 'react-native'

var checked=require("../../../res/img/checked.png");
var unchecked=require("../../../res/img/unchecked.png");

export default class Checkbox extends Component{
  render() {
    // console.log(this.props.checked)
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <Image source={this.props.checked?checked:unchecked} style={styles.image}/>
      </TouchableWithoutFeedback>
    )
      
  }
}

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
    marginRight: 6
  },
})