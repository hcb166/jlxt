
import React, {Component} from "react";
import {StyleSheet, View, Text, TouchableOpacity, Image, Button, TextInput} from "react-native";
import Toast from 'react-native-simple-toast';
import {COLOR} from '../../config';
import * as components from '../../components'
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';

import { NavigationActions } from 'react-navigation'
var resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName:'MissionList'})//要跳转到的页面名字
    ]
});

export default class ScanLogin extends Component {
    constructor(props) {
        super(props);
        this.state={
            serverIP: '',
            serverPort: '',
            deviceCode: '',
        }
        this._saveServerConfig=this._saveServerConfig.bind(this);
        this._cancelConfig=this._cancelConfig.bind(this);
    }
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    componentDidMount() {
        var _this=this;
        if(this.props.navigation.state.params&&this.props.navigation.state.params.result){
            _this.setState({serverIP:ret.serverIP}); // 保存服务器ip
            _this.setState({serverPort:ret.serverPort}); // 保存服务器port
        }else{
            storage.load({
                key: 'server',
            }).then(ret => {
                _this.setState({deviceCode:ret.deviceCode}); // 保存设备code
                _this.setState({serverIP:ret.serverIP}); // 保存服务器ip
                _this.setState({serverPort:ret.serverPort}); // 保存服务器port
            })
        }
        
    }

    // 保存服务器信息
    _saveServerConfig(){
      var _this=this;
      // 保存服务器IP和port到storage
      storage.save({
          key: 'server',
          data: {
            deviceCode: _this.state.deviceCode,
            serverIP: _this.state.serverIP,
            serverPort: _this.state.serverPort,
          },
          expires: null
      });
      NetUtil.postParam(ServerUrl.DEVICELOGIN,{code:_this.state.deviceCode}, function(res){
        if(res.name){
          Toast.show('保存成功~');
          storage.save({  // 保存设备信息到storage
            key: 'device',
            data: {
              code: res.code,
              name: res.name,
              remarks: res.remarks
            },
            expires: null
          });
          _this.props.navigation.dispatch(resetAction)
        }else{
            Toast.show(res.text);
        }
      },function(){
        Toast.show('数据请求失败，请检查配置!');
      });
    }

    // 取消配置
    _cancelConfig(){
        this.props.navigation.goBack();
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.left}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('MissionList')}>
                            <Image source={require('../../../res/img/back.png')} style={styles.image}/>
                        </TouchableOpacity>
                        <Text style={styles.text}>服务器配置</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ScanConfig')}>
                            <Text style={styles.textBtn}>扫描配置</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.main}>
                    <View style={styles.mainLeft}>
                        <Text style={styles.mainLeftText}>PDA编码：</Text>
                        <Text style={styles.mainLeftText}>服务器IP：</Text>
                        <Text style={styles.mainLeftText}>服务器端口：</Text>
                    </View>
                    <View style={styles.mainRight}>
                        <TextInput style={styles.mainRightInput} placeholder="如：jl_pda_01"
                            defaultValue={this.state.deviceCode}
                            onChangeText={(value) => {
                                this.setState({
                                    deviceCode: value
                                })
                           }}/>
                        <TextInput style={styles.mainRightInput} placeholder="如：192.168.1.129"
                            defaultValue={this.state.serverIP}
                            maxLength={16}
                            onChangeText={(value) => {
                                this.setState({
                                    serverIP: value
                                })
                           }}/>
                        <TextInput style={styles.mainRightInput} placeholder="如：8009"
                            defaultValue={this.state.serverPort}
                            maxLength={4}
                            onChangeText={(value) => {
                                this.setState({
                                    serverPort: value
                                })
                        }}/>
                    </View>
                </View>
                <View style={styles.mainBtns}>
                    <TouchableOpacity
                        style={[styles.mainBtn,{marginRight: 30}]}
                        onPress={this._saveServerConfig}
                    >
                      <Text style={styles.btnTextStyle}>保存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mainBtn}
                        onPress={this._cancelConfig}
                    >
                      <Text style={styles.btnTextStyle}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    },
    header: {
        height: 60,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLOR.backgroundLighter,
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    left: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 24,
        height: 23,
        marginLeft: 10,
        marginRight: 10,
    },
    text: {
        fontSize: 18,
        color: COLOR.textNormal,
        fontWeight: '500',
        marginRight: 10,
    },
    textBtn: {
        color: COLOR.theme,
        fontSize:16,
        marginRight:10
    },
    mainLeft: {
        marginBottom: 20,
    },
    mainLeftText: {
        width:120,
        textAlign: 'right',
        height: 40,
        lineHeight: 40,
        fontSize: 16,
        color: COLOR.textEmpha,
    },
    mainRight: {
        marginRight: 20
    },
    mainRightInput: {
        width: 180,
        height: 40,
        lineHeight: 40,
        fontSize: 16, 
    },
    mainBtns: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 50
    },
    mainBtn: {
        width: 100,
        fontSize: 16,
    },
    btnTextStyle: {
        backgroundColor: COLOR.theme,
        fontSize: 16,
        textAlign: 'center',
        borderRadius: 5,
        padding: 5,
        color: COLOR.textLightNormal,
    },
});