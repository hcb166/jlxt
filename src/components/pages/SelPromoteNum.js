import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { COLOR } from '../../config';
import * as components from '../../components'
import { ServerUrl } from '../../constants/Urls';
import { NetUtil } from '../../utils/netUtil';
import Toast from 'react-native-simple-toast';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

// 跳转回任务列表前清除动作记录，关闭摄像头的调用，防止闪退
import { NavigationActions } from 'react-navigation'
var resetActionMissionList = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'MissionList'
        }) //要跳转到的页面名字
    ]
});


export default class SelPromoteNum extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            packagings: props.navigation.state.params.packagings,
            workline_code: props.navigation.state.params.workline_code.data,
            deviceCode: '',
            modalVisible: false,
        };
    }

    componentWillMount() {
        var _this = this;
        // storage.load({
        //     key: 'device',
        // }).then(ret => {
        //     var deviceCode = ret.code;
        //     _this.setState({
        //         deviceCode: ret.code
        //     }); // 保存设备编码
        //     NetUtil.postParam(ServerUrl.GETWORKLINEPACKAGING, {
        //         user: deviceCode,
        //         workline_code: _this.state.workline_code
        //     }, function(res) {
        //         var packagings = [];
        //         if (res.packaging_codes) {
        //             for (let i in res.packaging_codes) {
        //                 packagings.push({
        //                     code: res.packaging_codes[i],
        //                     name: res.packaging_names[i]
        //                 })
        //             }
        //         } else {
        //             packagings = [];
        //             Toast.show('警告：该产线未绑定生产料号！', 2000, 'fa-times', false);
        //             setTimeout(() => {
        //                 // Toast.hide();
        //                 _this.props.navigation.dispatch(resetActionMissionList);
        //             // clearTimeout(timer);
        //             }, 2000);
        //         }
        //         _this.setState({
        //             packagings: packagings
        //         }); // 保存生产料号列表
        //     }, function() {
        //         console.log('网络异常');
        //     });
        // })
    }

    _renderItem = ({item}) => (
    item.name.indexOf(this.state.keyword) > -1 || !this.state.keyword ?
        (<TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('SelMaterial', {
            item: item,
            workline_code: this.state.workline_code
        })}>
            <Text style={styles.normalText}>{item.name}</Text>
        </TouchableOpacity>) :
        (<TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('SelWorkline', {
            item: item
        })}>
            <Text style={styles.normalText}>{item.name}</Text>
        </TouchableOpacity>)
    );

    _onChangeText(e) {
        this.setState({
            keyword: e.toUpperCase()
        });
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    // 呼叫空货架
    callEmptyShelf() {
        var _this = this;
        storage.load({
            key: 'device',
        }).then(ret => {
            var deviceCode = ret.code;
            _this.setState({
                deviceCode: ret.code
            }); // 保存设备编码
            NetUtil.postParam(ServerUrl.UPDATEMATERIALBILL,
                {
                    user: deviceCode,
                    flag: 0,
                    bill: {
                        workline_code: _this.state.workline_code,
                        special_type: 1,
                        state_id: 1,
                    }
                }, function(res) {
                    console.log(res)
                    if (!res.text) {
                        _this.props.navigation.navigate('CallSuccess', {
                            packaging: '空货架'
                        });
                        _this._setModalVisible(false);
                    } else {
                        Toast.show('呼叫失败，请检查是否已存在空货架呼叫任务！');
                        _this._setModalVisible(false);
                    }
                }, function() {
                    Toast.show('呼叫失败，请检查是否有误！');
                    _this._setModalVisible(false);
                });
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        back="MissionList"
                        text="请选择生产料号"
                        search='missionList'
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(resetActionMissionList)}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                        onChangeText={this._onChangeText.bind(this)}
                        >
                    </components.PageTitle>
                    {this.state.packagings.length > 0 ?
                        (<View style={{
                            maxHeight: height - 130
                        }}>
                            <FlatList
                                data={this.state.packagings}
                                renderItem={this._renderItem}
                                style={[styles.list, {
                                    padding: 5
                                }]}
                            />
                            <View style={{
                                padding: 5,
                                paddingTop: 0,
                                marginTop: 5
                                }}>
                                <TouchableOpacity style={styles.listContainer} onPress={() => this._setModalVisible(true)}>
                                    <Text style={styles.normalText}>空货架</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        ) :
                        (
                            <View style={[styles.list, {
                                padding: 5
                                }]}>
                                <TouchableOpacity style={styles.listContainer} onPress={() => this._setModalVisible(true)}>
                                    <Text style={styles.normalText}>空货架</Text>
                                </TouchableOpacity>
                            </View>
                        )

                    }
                </components.Layout>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this._setModalVisible(false)
                    }}
                    >
                    <View style={[styles.modalContainer, styles.modalBackgroundStyle]}>
                        <View style={[styles.innerContainer, styles.innerContainerTransparentStyle]}>
                            <Text style={styles.ifCancel}>确定呼叫空货架吗？</Text>
                            <View style={styles.btns}>
                                <components.Button
                                    onPress={() => this.callEmptyShelf()}
                                    text="是"
                                    containerStyle={{
                                        width: 80,
                                        backgroundColor: COLOR.backgroundRedButton,
                                        marginRight: 10,
                                        color: COLOR.textLightNormal
                                    }}
                                    >
                                </components.Button>
                                <components.Button
                                    onPress={() => {
                                        this._setModalVisible(false)
                                    }}
                                    text="否"
                                    containerStyle={{
                                        width: 90,
                                        backgroundColor: COLOR.backgroundGrayButton,
                                        color: COLOR.textLightNormal
                                    }}
                                    >
                                </components.Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
    },
    list: {
        marginTop: 10
    },
    listContainer: {
        borderWidth: 1,
        borderColor: COLOR.lineNormal,
        marginBottom: 10,
        padding: 10,
    },
    normalText: {
        color: COLOR.textNormal,
        fontSize: 16,
        height: 30,
    },
    backImage: {
        width: 24,
        height: 23,
        marginRight: 10
    },
    // 弹窗
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 35,
    },
    innerContainer: {
        alignItems: 'center',
    },
    innerContainerTransparentStyle: {
        backgroundColor: COLOR.backgroundLighter,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    ifCancel: {
        fontSize: 16,
        color: COLOR.textNormal,
        marginTop: 30
    },
    btns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20
    },
});