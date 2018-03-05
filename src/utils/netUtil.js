
'use strict';

import React, {Component} from 'react';
import * as components from '../components'
import Toast from 'react-native-simple-toast';



export class NetUtil extends Component {
    constructor(props) {
        super(props);
    }

    static postParam(url, params, callback, errorCallback) {
        var _this=this; 
        storage.load({
            key: 'server',
        }).then(ret => {
            var serverIP=ret.serverIP;
            var serverPort=ret.serverPort;
            if((!serverIP) || (!serverPort)){
              // Toast.show('数据请求失败，请检查网络及服务器配置');
              errorCallback();
              // _this.props.navigation.navigate('Config');
              return
            }
            fetch('http://'+serverIP+':'+serverPort+ url, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'accept': "application/json;charset=utf-8",
                    'content-type': "application/json;charset=utf-8"
                },
                cache: 'default',
                body: JSON.stringify(params)
            }).then((response) => 
                response.json()
            ).then((responseJSON) => {
                callback(responseJSON);
            }).catch((err) => {
                errorCallback()
                // console.log(err)
                // Toast.show('数据请求失败，请检查网络及服务器配置');
                // _this.interval && clearInterval(_this.interval);
                // _this.props.navigation.navigate('Config');
            });
        })
    }
};