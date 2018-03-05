
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Toast from 'react-native-simple-toast';
import { QRScannerView } from 'ac-qrcode';
import { COLOR } from '../../config';
import * as components from '../../components'
import { ServerUrl } from '../../constants/Urls';
import { NetUtil } from '../../utils/netUtil';

import { NavigationActions } from 'react-navigation'

var resetActionError = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'QRcodeError'
        }) //要跳转到的页面名字
    ]
});
// var resetActionMissionList = NavigationActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({
//             routeName: 'MissionList'
//         }) //要跳转到的页面名字
//     ]
// });

var resetActionFindPromote = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'FindPromoteNum'
        }) //要跳转到的页面名字
    ]
});

// let qrtime=0;
export default class QRcoding extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({navigation}) => {
        return {
            header: null
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
                                <TouchableOpacity onPress={() => this.props.navigation.dispatch(resetActionFindPromote)}>
                                    <Text style={styles.textBtn}>按生产料号查找</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                )
            }}
            />
        )
    }


    _renderTitleBar() {
        return (
            <Text
            style={{
                color: 'white',
                textAlignVertical: 'center',
                textAlign: 'center',
                font: 20,
                padding: 12
            }}
            ></Text>
        );
    }

    _renderMenu() {
        return (
            <Text
            style={{
                color: 'white',
                textAlignVertical: 'center',
                textAlign: 'center',
                font: 20,
                padding: 12
            }}
            ></Text>
        )
    }

    barcodeReceived(e) {
        var _this = this;
        if (e.type == "QR_CODE") {
            storage.load({
                key: 'device',
            }).then(ret => {
                var deviceCode = ret.code;
                NetUtil.postParam(ServerUrl.GETWORKLINEPACKAGING, {
                    user: deviceCode,
                    workline_code: e.data
                }, function(res) {
                    var packagings = [];
                    if (res.packaging_codes) {
                        for (let i in res.packaging_codes) {
                            packagings.push({
                                code: res.packaging_codes[i],
                                name: res.packaging_names[i]
                            })
                        }
                        _this.props.navigation.dispatch(
                            NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'SelPromoteNum',
                                        params: {
                                            workline_code: e,
                                            packagings: packagings
                                        }
                                    }) //要跳转到的页面名字
                                ]
                            })
                        )
                    } else {
                        packagings = [];
                        Toast.show('警告：找不到该产线！', 2000, 'fa-times', false);
                        setTimeout(() => {
                            _this.props.navigation.goBack();
                        }, 500);
                    }
                }, function() {
                    console.log('网络异常');
                });
            })
            
        } else {
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
        fontSize: 16,
        marginRight: 10
    }
});