import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated
} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'

class Panel extends Component{
    constructor(props){
        super(props);

        this.icons = {
            'up' : require('../../../res/img/up.png'),
            'down' : require('../../../res/img/down.png')
        };

        this.state = {
            title       : props.title,
            expanded    : true,
            animation   : new Animated.Value()
        };
    }

    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }

    render(){
        let icon = this.icons['up'];

        if(this.state.expanded){
            icon = this.icons['down'];
        }

        return (
            <Animated.View 
                style={[styles.container,{height: this.state.animation}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <components.Checkbox  checked={this.props.checked} onPress={this.props.onPress}/>
                </View>
                
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    container   : {
      paddingRight: 5,
    },
    titleContainer : {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        height: 30
    },
    title       : {
        flex    : 1,
        color: COLOR.textNormal,
    },
    buttonImage : {
        width   : 20,
        height  : 11,
        marginRight: 5
    },
    body        : {
        padding     : 10,
        paddingRight: 0,
        paddingTop  : 0
    }
});

export default Panel;