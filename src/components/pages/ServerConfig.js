
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
        NavigationActions.navigate({routeName:'QRcodeError'})//要跳转到的页面名字
    ]
});
// var resetActionSelPromoteNum = NavigationActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({routeName:'SelPromoteNum', params: { workline_code: qr_code}})//要跳转到的页面名字
//     ]
// });

// let qrtime=0;
export default class QRcoding extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    render() {
        const {navigate} = this.props.navigation
        // console.log(this.props.navigation)
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
                                <Text style={styles.text}>扫描呼叫条码</Text>
                            </View>
                            <View style={styles.right}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('FindPromoteNum')}>
                                    <Text style={styles.textBtn}>按生产料号查找</Text>
                                </TouchableOpacity>
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
        // this.props.navigation.goBack();  // goback 能关闭摄像头，navigate不能关闭摄像头。权宜之计，先返回上一页，再跳到扫码结果页
        this.props.navigation.dispatch(
          NavigationActions.reset({
              index: 0,
              actions: [
                  NavigationActions.navigate({routeName:'SelPromoteNum', params: { workline_code: e}})//要跳转到的页面名字
              ]
          }))
      }else{
        this.props.navigation.dispatch(resetActionError)
      }
        // if(this.props.navigation.state.params){
            // console.log(this.props.navigation.state.params.time)
            // if(qrtime==this.props.navigation.state.params.time){
            //     return
            // }
            // qrtime=this.props.navigation.state.params.time;
            // Toast.show('Type: ' + e.type + '\nData: ' + e.data);
            // console.log(e)
            // const {navigate} = this.props.navigation
            // navigate('SelPromoteNum',{result:e})
            // this.props.navigation.goBack();  // goback 能关闭摄像头，navigate不能关闭摄像头。权宜之计，先返回上一页，再跳到扫码结果页
            // this.props.navigation.navigate('SelPromoteNum',{workline_code:e})
        // }else{
        //     if(qrtime==1){
        //         return
        //     }
        //     qrtime=1;
        //     Toast.show('Type: ' + e.type + '\nData: ' + e.data);
        //     const {navigate} = this.props.navigation
        //     navigate('SelPromoteNum',{result:e})
        // }
        
    }

    // _navigatorToMissionInfo(){
    //     const {navigate} = this.props.navigation
    //     navigate('MissionInfo')
    // }
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