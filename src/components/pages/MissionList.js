import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Button, Image} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'
import Toast from 'react-native-simple-toast';
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';

var TimerMixin = require('react-timer-mixin');  
export default class MissionList extends React.PureComponent {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };
    constructor(props) {
        super(props);
        this.interval=null;
        //通过这句代码屏蔽 YellowBox
        console.disableYellowBox = true;

        this.state={
            keyword:'', // 搜索关键字
            missionList:[], // 任务列表
            deviceCode:'',  // 设备编码
            ifConfig:true, // 是否已配置
        }
    }

    componentWillMount() {
      var _this=this;
      // storage.load({
      //   key: 'server',
      // }).then(ret => {
      //   var serverIP=ret.serverIP;
      //   var serverPort=ret.serverPort;
        // if((!serverIP) || (!serverPort)){
        //   Toast.show('网络异常');
        //   _this.props.navigation.navigate('Config');
        // }
      // })

      storage.load({
        key: 'device',
      }).then(ret => {
        var deviceCode=ret.code;
        _this.setState({deviceCode:ret.code}); // 保存设备编码
        
        NetUtil.postParam(ServerUrl.UPDATEMATERIALBILL,{user:deviceCode,flag:3,current_page:-1,item_per_page:-1}, function(res){
          if(res){
            _this.setState({missionList:res.bills}); // 保存任务列表
          }else{
            _this.setState({missionList:[]}); // 保存任务列表
          }
          _this.setState({ifConfig:true}); // 是否已配置
        },function(){
          Toast.show('网络异常');
          _this.setState({ifConfig:false}); // 是否已配置
          _this.props.navigation.navigate('Config');
        });
      })
    }

    componentDidMount() {
      var _this=this;
      this.interval = setInterval(() => {
        NetUtil.postParam(ServerUrl.UPDATEMATERIALBILL,{user:_this.state.deviceCode,flag:3,current_page:-1,item_per_page:-1}, function(res){
          if(res){
            _this.setState({missionList:res.bills}); // 保存任务列表
          }else{
            _this.setState({missionList:[]}); // 保存任务列表
          }
        },function(){
          Toast.show('网络异常');
          // _this.props.navigation.navigate('Config');
        });
      },2000) 
    }

    componentWillUnmount() {
      this.interval && clearInterval(this.interval);
    }

    render() {
        const {navigate} = this.props.navigation
        // console.log(this.props.navigation)
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        text="任务列表"
                        search='missionList'
                        qrcode="yes"
                        onChangeText={this._onChangeText.bind(this)}
                    >
                        <components.QRcode text="扫码呼叫" onPress={() => navigate('QRcoding',{time:new Date().getTime()})}></components.QRcode>
                    </components.PageTitle>
                    {
                        !this.state.ifConfig?
                        <View style={{marginTop:20}}>
                            <Text style={{marginTop:20,textAlign:'center',color:COLOR.textNormal,fontSize:22}}>系统未连接</Text>
                            <Text style={{marginTop:20,textAlign:'center',color:COLOR.textNormal,fontSize:16}}>请检查设备配置或无线网络状态</Text>
                        </View>
                        :
                        this.state.missionList?
                        <FlatList
                            data={this.state.missionList}
                            initialNumToRender='10'
                            renderItem={this._renderItem}
                            extraData={this.state}
                            automaticallyAdjustContentInsets={false}
                            disableVirtualization={false}
                            debug={false}
                        />:
                        <View style={{marginTop:20}}>
                            <Text style={{marginTop:20,textAlign:'center',color:COLOR.textNormal,fontSize:16}}>暂无数据</Text>
                        </View>
                    }
                </components.Layout>
            </View>);
    }

    // 搜索
    _onChangeText(e){
      this.setState({keyword:e.toUpperCase()});
    }

    _renderItem = ({item,index}) => (
        item.workline_name.indexOf(this.state.keyword)>-1||item.packaging_name.indexOf(this.state.keyword)>-1||item.create_stamp.indexOf(this.state.keyword)>-1||!this.state.keyword?
        (<TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('MissionInfo',{item:item,index:index})}>
            <Text style={[styles.number,styles.normalText]}>{index+1}</Text>
            <View style={styles.position}>
                <Text style={styles.normalText}>{item.workline_name}</Text>
                <Text style={[styles.smallText,{color:item.special_type?COLOR.textBurdenFinish:COLOR.textNormal}]}>{item.special_type==1?'空货架':item.special_type==2?'SAP':item.packaging_name}</Text>
            </View>
            <View style={styles.state}>
                <View style={styles.stateTop}>
                    <Text style={[styles.normalText,
                        {
                            color:item.state_name=="正常完成"?COLOR.textMisFinish:(item.state_name=="取消订单"||item.state_name=="异常完成")?COLOR.textError:COLOR.textBurdenFinish,marginRight:5
                        }
                    ]}>{item.state_name}</Text>
                    {item.state_name=="搬运中"||item.state_name=="已分配车"
                        ?<View style={styles.carName}>
                            <Image source={require('../../../res/img/car.png')} style={styles.car}/>
                            <Text style={[styles.carText,styles.normalText,{marginLeft:5}]}>{item.robot_code}</Text>
                        </View>
                        :item.state_name=="取消订单"
                        ?<View style={styles.carName}>
                            <Text style={[styles.carText,styles.normalText,{marginLeft:5,fontSize:12,color:COLOR.textError}]}>{item.remarks}</Text>
                        </View>
                        :null
                    }
                </View>
                
                <Text style={styles.smallText}>{item.create_stamp}</Text>
            </View>
            {item.state_name!="完成"&&item.priority
                ?<Image source={require('../../../res/img/qi.png')} style={styles.image}/>
                :<View style={{flex:0.3}}></View>
            }
        </TouchableOpacity>):null
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
    },
    // 列表主内容
    listContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderBottomWidth:1,
        borderBottomColor: COLOR.lineNormal,
        padding: 5,
    },
    normalText: {
        color: COLOR.textNormal,
        fontSize: 14
    },
    smallText: {
        color: COLOR.textNormal,
        fontSize: 12
    },
    number: {
        flex:0.4,
    },
    position: {
        flex:1.4,
    },
    state: {
        flex:2.2,
    },
    stateTop: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    carName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    // car: {
    //     marginLeft:5,
    //     marginRight:5,
    // },
    image: {
        width: 24,
        height: 23,
        flex:0.3,
        marginRight:5,
    },
    car: {
        width: 24,
        height:23
    }
});