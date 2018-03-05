
import React, {Component} from "react";
import {StyleSheet, View, Text, TouchableOpacity, Image} from "react-native";
import Toast from 'react-native-simple-toast';
import {QRScannerView} from 'ac-qrcode';
import {COLOR} from '../../config';
import * as components from '../../components'

import { NavigationActions } from 'react-navigation'
var resetActionError = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName:'ScanConfigFail'})//要跳转到的页面名字
    ]
});
var resetActionConfig = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName:'Config'})//要跳转到的页面名字
    ]
});

// let qrtime=0;
export default class ScanLogin extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    render() {
        return (
            < QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}
                renderTopBarView={() => this._renderTitleBar()}
                renderBottomMenuView={() => this._renderMenu()}
                hintTextPosition={80}
                hintText="请对准二维码/条码，耐心等待"
                renderTopBarView={() => {
                    return (
                        <View style={styles.container}>
                            <View style={styles.left}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Image source={require('../../../res/img/back.png')} style={styles.image}/>
                                </TouchableOpacity>
                                <Text style={styles.text}>扫描配置</Text>
                            </View>
                        </View>

                    )
                }}
            />
        )
    }
            

    _renderTitleBar(){
        return(
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            ></Text>
        );
    }

    _renderMenu() {
        return (
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            ></Text>
        )
    }

    barcodeReceived(e) {
        Toast.show('Type: ' + e.type + '\nData: ' + e.data);
        if(e.type=="QR_CODE"){
          var serverIP=e.data.split(':')[0];
          var serverPort=e.data.split(':')[1];
          storage.save({
            key: 'server',
            data: {
                serverIP: serverIP,
                serverPort: serverPort,
            },
            expires: null
          });
          this.props.navigation.dispatch(resetActionConfig);
        }else{
          this.props.navigation.dispatch(resetActionError)
        }
    }

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: COLOR.backgroundLighter,
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
    }
});