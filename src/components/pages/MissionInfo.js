import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Modal, FlatList, ProgressBarAndroid} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';
import Toast from 'react-native-simple-toast';

import { NavigationActions } from 'react-navigation'

var resetActionMissionList = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName:'MissionList'})//要跳转到的页面名字
    ]
});

export default class MissionInfo extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
          modalVisible: false,
          deviceCode:'',
          progress:(props.navigation.state.params.item.state_name=='配料中'?0.17
            :props.navigation.state.params.item.state_name=='配料完成'?0.39
            :props.navigation.state.params.item.state_name=='已分配车'?0.61
            :props.navigation.state.params.item.state_name=='搬运中'?0.78
            :props.navigation.state.params.item.state_name=='正常完成'?1.0
            :0)
        };
    }

    _setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _dataFunc = ((item) => {
      var dataArr=[];
      if(item.material_type_name){
        for(let i in item.material_type_name.split(',')){
          dataArr.push({
            material_type_name : item.material_type_name.split(',')[i],
            material_name: item.material_names.split(',')[i],
            num:item.nums.split(',')[i],
            num_remarks:item.num_remarks.split(',')[i],
            material_unit_name: item.material_unit_name.split(',')[i],
            material_status: item.material_status.split(',')[i]
          })
        }
      }
      return dataArr
    }) 

    _renderItem = ({item,index}) => (
      <View style={styles.materials}>
        <Text style={styles.normalText}>{item.material_type_name}/{item.material_name}, </Text>
        <View style={{flex:1,flexDirection:'row'}}>
            <Text style={[styles.normalText,{marginLeft:5}]}>({item.num_remarks}){item.material_unit_name}</Text>
            <Text style={[styles.normalText,{marginLeft:5,color:item.material_status=="配料完成"?COLOR.textMisFinish:(item.material_status=="待配料")?COLOR.textBurdenFinish:COLOR.textError}]}>{item.material_status}</Text>
        </View>
      </View>
    )

    // 取消任务
    _cancalMission(item){
      var _this=this;
      storage.load({
        key: 'device',
      }).then(ret => {
        var deviceCode=ret.code;
        _this.setState({deviceCode:ret.code}); // 保存设备编码
        NetUtil.postParam(ServerUrl.UPDATEMATERIALBILL,
        {
          user:deviceCode,
          flag:2, 
          bill:{
            code: item.code,
            workline_code: item.workline_code,
            packaging_code: item.packaging_code,
            state_id: 0,
            remarks: '叫料取消'
          }
        }, function(res){
          if(!res.text){
            _this.props.navigation.dispatch(resetActionMissionList)
            _this._setModalVisible(false);
          }else{
            Toast.show(res.text);
          }
        });
      })
    }
// <Text style={[styles.normalText,styles.rightText,{color:item.state_name=="正常完成"?COLOR.textMisFinish:(item.state_name=="取消订单"||item.state_name=="异常完成")?COLOR.textError:COLOR.textBurdenFinish}]}>{item.state_name}</Text>
    render() {
        let item = this.props.navigation.state.params.item;
        let index = this.props.navigation.state.params.index;
        
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        back="MissionList"
                        text="任务详情"
                        qrcode="yes"
                        styleContainer={{borderBottomWidth:0}}
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                    >
                    </components.PageTitle>

                    <ProgressBarAndroid progress={this.state.progress} styleAttr="Horizontal" indeterminate ={false}/>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                      <Text style={[{flex:0.85,textAlign:'center'},this.state.progress>=0.17?styles.misFinish:null]}>配料中</Text>
                      <Text style={[{flex:1.1,textAlign:'center'},this.state.progress>=0.39?styles.misFinish:null]}>配料完成</Text>
                      <Text style={[{flex:1.1,textAlign:'center'},this.state.progress>=0.61?styles.misFinish:null]}>已分配车</Text>
                      <Text style={[{flex:0.85,textAlign:'center'},this.state.progress>=0.78?styles.misFinish:null]}>搬运中</Text>
                      <Text style={[{flex:1.1,textAlign:'center'},this.state.progress>=1.0?styles.misFinish:null]}>正常完成</Text>
                    </View>


                    <View style={styles.misInfo}>
                        <View style={styles.misInfoLeft}>
                            <Text style={[styles.normalText,styles.leftText]}>编号：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>呼叫位置：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>生产料号：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>加急：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>状态：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>物料：</Text>
                        </View>
                        <View style={styles.misInfoRight}>
                            <Text style={[styles.normalText,styles.rightText]}>{index+1}</Text>
                            <Text style={[styles.normalText,styles.rightText]}>{item.workline_name}</Text>
                            <Text style={[styles.normalText,styles.rightText,{color:item.special_type?COLOR.textBurdenFinish:COLOR.textNormal}]}>{item.special_type==1?'空货架':item.special_type==2?'SAP':item.packaging_name}</Text>
                            {item.priority
                                ?<View style={[styles.qi,styles.rightText]}><Image source={require('../../../res/img/qi.png')} style={styles.image}/></View>
                                :<Text style={[styles.normalText,styles.rightText]}>无</Text>
                            }
                            
                            <Text style={[styles.normalText,styles.rightText,{color:item.state_name=="正常完成"?COLOR.textMisFinish:(item.state_name=="取消订单"||item.state_name=="异常完成")?COLOR.textError:COLOR.textBurdenFinish}]}>{item.state_name}</Text>

                            <FlatList
                                data={this._dataFunc(item)}
                                renderItem={this._renderItem}
                                style={styles.misInfoList}
                                automaticallyAdjustContentInsets={false}
                                disableVirtualization={false}
                            />
                        </View>
                    </View>
                    {
                      item.state_name=='配料中'?(
                        <components.ButtonWithBg
                            text="取消"
                            onPress={() => this._setModalVisible(true)}
                            containerStyle={{marginLeft: 50, marginRight: 50,marginBottom:10}}
                        >
                        </components.ButtonWithBg>
                      ):null
                    }
                </components.Layout>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this._setModalVisible(false)}}
                >
                    <View style={[styles.modalContainer, styles.modalBackgroundStyle]}>
                        <View style={[styles.innerContainer, styles.innerContainerTransparentStyle]}>
                            <Text style={styles.ifCancel}>确定取消当前任务吗？</Text>
                            <View style={styles.btns}>
                                <components.Button
                                    onPress={() => this._cancalMission(item)}
                                    text="是"
                                    containerStyle={{width: 80, backgroundColor: COLOR.backgroundRedButton,marginRight:10,color:COLOR.textLightNormal}}
                                >
                                </components.Button>
                                <components.Button
                                    onPress={() => {this._setModalVisible(false)}}
                                    text="否"
                                    containerStyle={{width: 90, backgroundColor: COLOR.backgroundGrayButton,color:COLOR.textLightNormal}}
                                >
                                </components.Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>);
    }
}


const styles = StyleSheet.create({
    container: {
      display: 'flex',
      minHeight: '100%'
    },
    backImage: {
        width: 24,
        height: 23,
        marginRight: 10
    },
    misInfo: {
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
        paddingTop: 10,
        flex: 1,
    },
    misInfoLeft: {
        display: 'flex',
        flex: 0.85,
    },
    misInfoRight: {
        flex: 2,
        marginLeft: 5,
        // paddingBottom: 210,
    },
    normalText: {
        color: COLOR.textNormal,
        fontSize: 16,
        height: 26,
    },
    image: {
        width: 24,
        height: 23,
    },
    qi: {
        height:27
    },
    leftText: {
        textAlign: 'right'
    },
    rightText: {
        textAlign: 'left'
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
    materials: {
      display: 'flex',
      flex:1,
      // flexDirection: 'row',
      // overflow:'scroll',
      // flexWrap: 'wrap',
      // justifyContent: 'flex-start',
    },
    misFinish:{
      color:COLOR.textBurdenFinish,
      fontWeight:'700'
    },
});

//  color={COLOR.textMisFinish}