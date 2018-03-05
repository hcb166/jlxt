

'use strict';


import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
// import {Provider} from 'react-redux';
// import store from './store'
import {AppNavigator} from './navigation'
import Toast from 'react-native-simple-toast';
import './storage'

// const sleep=require('es6-sleep').promise();


export default class App extends Component {

    /**
     * 启动页
     */
    componentDidMount() {
        SplashScreen.hide();
    }

    render () {
        return (
            // <Provider>
                <AppNavigator />
            // </Provider>
        )
    }
}
