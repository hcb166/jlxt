import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';

// 跳转回任务列表前清除动作记录，关闭摄像头的调用，防止闪退
import { NavigationActions } from 'react-navigation'
var resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName:'MissionList'})//要跳转到的页面名字
    ]
});

export default class FindPromoteNum extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            keyword:'',
            packagings:[],
            deviceCode:'',
            workline_code: '',
        };
    }

    componentWillMount() {
      var _this=this;
      storage.load({
        key: 'device',
      }).then(ret => {
        var deviceCode=ret.code;
        _this.setState({deviceCode:ret.code}); // 保存设备编码
        NetUtil.postParam(ServerUrl.GETWORKLINEPACKAGING,{user:deviceCode}, function(res){
          var packagings=[];
          if(res.packaging_codes){
            for(let i in res.packaging_codes){
              packagings.push({code:res.packaging_codes[i],name:res.packaging_names[i],workline:res.workline_codes[i]})
            }
          }else{
            packagings=[]
          }
          
          _this.setState({packagings:packagings}); // 保存生产料号列表
        },function(){
          console.log('网络异常');
        });
      })
    }

    _renderItem = ({item}) => (
        item.name.indexOf(this.state.keyword)>-1||!this.state.keyword?(item.workline.split(',').length==1?
        (<TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('SelMaterial',{item:item,workline_code:item.workline})}>
            <Text style={styles.normalText}>{item.name}</Text>
        </TouchableOpacity>):(<TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('SelWorkline',{item:item})}>
            <Text style={styles.normalText}>{item.name}</Text>
        </TouchableOpacity>)):null
    );

    _onChangeText(e){
        this.setState({keyword:e.toUpperCase()});
    }

    

    render() {
        // let result = this.props.navigation.state.params.result
        // console.log(result)
        
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        back="MissionList"
                        text="查找生产料号"
                        search='missionList'
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(resetAction)}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                        onChangeText={this._onChangeText.bind(this)}
                    >
                    </components.PageTitle>
                    <FlatList
                        data={this.state.packagings}
                        renderItem={this._renderItem}
                        style={[styles.list,{padding:5}]}
                    />
                </components.Layout>
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
    list :{
      marginTop:10
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
});