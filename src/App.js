

'use strict';


import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
// import {Provider} from 'react-redux';
// import store from './store'
import {AppNavigator} from './navigation'
import Toast from 'react-native-simple-toast';
import './storage'


import {
  NativeModules,
} from 'react-native';
//import {NativeModules, DeviceEventEmitter} from 'react-native';
//const scan = NativeModules.AScanApp;
// const sleep=require('es6-sleep').promise();


//export default class App extends Component {
//
//    /**
//     * 启动页
//     */
//    componentDidMount() {
//        SplashScreen.hide();
//    }
//
//    render () {
//        return (
//            // <Provider>
//                <AppNavigator />
//            // </Provider>
//        )
//    }
//}

export default class App extends Component {



    /**
     * 启动页
     */
    componentDidMount() {
        NativeModules.AScanModule.rnCallNative('调用原生方法的Demo');
//        this.listener = DeviceEventEmitter.addListener(
//                                                        'ScanApp',   // 与模块中的eventName保持一致
//                                                         this._onScan       // 回调函数，在此函数接收定位信息
//                                                         );  // 注册监听
//          scan.onstart(); // 开启定位
        SplashScreen.hide();
    }

//    _onScan = (data)=> {
//         if (data) {
//               console.log(data);
//         }
//    };

    render () {
        return (
            // <Provider>
                <AppNavigator />
            // </Provider>
        )
    }
}
