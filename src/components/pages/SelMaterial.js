import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Keyboard} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';
import Toast from 'react-native-simple-toast';



var materials=[];


export default class SelMaterial extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            packaging_code: props.navigation.state.params.item.code,
            packaging_name: props.navigation.state.params.item.name,
            workline_code: props.navigation.state.params.workline_code,
            deviceCode:'',
            materials: [],
            quick: false, // 是否加急
            multiple: '1', // 物料倍数
            ifMultiple: false, // 是否按倍数叫料
        };
    }

    componentWillMount() {
      var _this=this;
      storage.load({
        key: 'device',
      }).then(ret => {
        var deviceCode=ret.code;
        _this.setState({deviceCode:ret.code}); // 保存设备编码
        NetUtil.postParam(ServerUrl.GETPACKAGINGMATERIAL,{user:deviceCode, workline_code:this.state.workline_code, packaging_code:this.state.packaging_code}, function(res){
          // 将物料信息列表按类型分类存储
          if(res.materials){
            var bom=res.multiple;
            materials=[];
            for(var i=0;i<res.materials.length;i++){
              // 如果数组无数据，或物料类型与前一物料不相同
              if(materials.length==0||res.materials[i].type_name!=materials[materials.length-1].type_name){
                materials.push({checked:true, i: materials.length, type_name:res.materials[i].type_name, material_detail:[{i: materials.length, j:0, material_name: res.materials[i].name, num:res.materials[i].num*bom, defaultNum:res.materials[i].num*bom, unit:res.materials[i].unit_name, material_code:res.materials[i].code, checked:true,remarks:res.materials[i].remarks }]})
              }else{ // 如果已存在相同类型物料
                materials[materials.length-1].material_detail.push({i: materials.length-1, j:materials[materials.length-1].material_detail.length, material_name: res.materials[i].name, num: res.materials[i].num*bom, defaultNum: res.materials[i].num*bom, unit:res.materials[i].unit_name, material_code:res.materials[i].code, checked: true,remarks:res.materials[i].remarks })
              }
            }
            _this.setState({materials:materials}); // 保存物料列表
          }else{
            _this.setState({materials:[]}); // 保存空物料列表
          }
        });
      })
    }

    _renderItem = ({item,index}) => (
        <components.Panel title={item.type_name} checked={this.state.materials[index].checked} onPress={() => this._ifTypeChecked(item,index)}>
            <FlatList
                data={item.material_detail}
                initialNumToRender='100'
                renderItem={this._renderRow}
                extraData={this.state}
                automaticallyAdjustContentInsets={false}
                disableVirtualization={false}
            />
        </components.Panel>
    );

    _renderRow = ({item,index}) => (
        <View style={styles.material_row}>
            <View style={styles.material_detail}>
                <Text>{item.material_name}</Text>
                <components.TextInput defaultValue={item.num.toString()} containerStyle={{ height:24, width:40, fontSize:14,marginLeft:5,marginRight:5 }} onChangeText={(value) => this._numChange(value,item,index)}>
                </components.TextInput> 
                <Text>{item.unit}</Text>
            </View>
           <components.Checkbox checked={this.state.materials[item.i].material_detail[index].checked} onPress={() => this._materialSelectChange(item,index)}/>
        </View>
    );

    // 物料类别是否勾选的状态判断
    _ifTypeChecked(item,index){
      var checked=item.checked;
      materials[index].checked= !checked;
      for(let n in item.material_detail){
        materials[index].material_detail[n].checked=!checked;
      }
      this.setState({materials: materials});
    }

    // 物料是否勾选的变化
    _materialSelectChange(item,index){
      materials[item.i].material_detail[index].checked= !materials[item.i].material_detail[index].checked;
      var checked=true;
      for(let n in materials[item.i].material_detail){
        if(!materials[item.i].material_detail[n].checked){
          checked=false;
        }
      }
      materials[item.i].checked=checked;
      this.setState({materials: materials});
    }

    // 呼叫，下任务
    _call(){
      var _this=this;
      var material_codes='';
      var nums='';
      for(let i in this.state.materials){
        for(let j in this.state.materials[i].material_detail){
          if(this.state.materials[i].material_detail[j].checked&&this.state.materials[i].material_detail[j].num>0){
            material_codes+= this.state.materials[i].material_detail[j].material_code+ ',';
            if(this.state.ifMultiple){
              nums+=  Math.ceil(materials[i].material_detail[j].num/materials[i].material_detail[j].remarks)*materials[i].material_detail[j].remarks+ ',';
            }else{
              nums+= materials[i].material_detail[j].num+ ',';
            }
          }
        }
      }
      if(material_codes){
        material_codes=material_codes.slice(0,-1);
        nums=nums.slice(0,-1);
      }else{
        Toast.show('呼叫失败，请确认已选择数量大于0的物料！');
        return;
      }
      storage.load({
        key: 'device',
      }).then(ret => {
        var deviceCode=ret.code;
        _this.setState({deviceCode:ret.code}); // 保存设备编码
        NetUtil.postParam(ServerUrl.UPDATEMATERIALBILL,
        {
          user:deviceCode,
          flag:0, 
          bill:{
            workline_code: _this.state.workline_code,
            packaging_code: _this.state.packaging_code,
            material_codes: material_codes,
            nums: nums,
            priority: Number(_this.state.quick),
            state_id: 1,
            force_add: true
          }
        }, function(res){
          if(!res.text){
            Keyboard.dismiss();
            _this.props.navigation.navigate('CallSuccess',{packaging:_this.state.packaging_code});
          }else{
            Toast.show('呼叫失败，请检查是否有误！');
          }
        });
      })
    }

    // 修改倍数
    _multipleChange(value){
      var multipleValue=isNaN(parseFloat(value))?0:parseFloat(value).toFixed(2);
      // this.setState({multiple:multipleValue});
      var materials=this.state.materials;
      for(let i in materials){
        for(let j in materials[i].material_detail){
          materials[i].material_detail[j].num= parseFloat(multipleValue);
        }
      }
      this.setState({materials: materials});
    }

    // 点击编辑
    _clickEditButton(){
      this.setState({ifMultiple:!this.state.ifMultiple});
      this._multipleChange(1);
    }

    // 修改数量
    _numChange(value,item,index){
      // var _this=this;
      materials[item.i].material_detail[index].num=isNaN(parseFloat(value))?0:parseFloat(value).toFixed(2);
      // setTimeout(() => {
      //   _this.setState({materials: materials});
      // },2000)
    }

    render() {
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        back="SelPromoteNum"
                        text="请选择物料"
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                    >
                        <View style={styles.titleContent}>
                            <View style={styles.quickCheck}>
                                <components.Checkbox  checked={this.state.quick} onPress={() => this.setState({quick:!this.state.quick})}/>
                                <Text style={styles.text}>加急</Text>
                            </View>
                            <components.ButtonWithBg 
                                text="呼叫"
                                onPress={() => this._call()}
                                containerStyle={{backgroundColor: COLOR.theme, marginLeft:15, marginRight:5, padding:12, paddingTop:6, paddingBottom:6}}
                                style={styles.callButton}
                            >
                            </components.ButtonWithBg>
                        </View>
                        
                    </components.PageTitle>
                    <View style={styles.materialInfo}>
                        <View style={styles.materialInfoLeft}>
                            <Text style={[styles.normalText,styles.leftText]}>呼叫位置：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>生产料号：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>物料倍数：</Text>
                            <Text style={[styles.normalText,styles.leftText]}>物料：</Text>
                        </View>
                        <View style={styles.materialInfoRight}>
                            <Text style={[styles.normalText,styles.rightText]}>{this.state.workline_code}</Text>
                            <Text style={[styles.normalText,styles.rightText]}>{this.state.packaging_name}</Text>
                            {this.state.ifMultiple?
                              <components.TextInput defaultValue={this.state.multiple} onChangeText={(value) => this._multipleChange(value)} containerStyle={{width:40}}></components.TextInput>
                              :
                              <components.Button 
                                text="编辑" 
                                onPress={() => this._clickEditButton()} 
                                containerStyle={{marginTop:-4}}
                                >
                              </components.Button>
                            }
                            
                            
                            
                            
                        </View>
                    </View>
                    <View style={styles.materialInfoBottom}>
                      <FlatList
                          data={this.state.materials}
                          initialNumToRender='10'
                          renderItem={this._renderItem}
                          extraData={this.state}
                          automaticallyAdjustContentInsets={false}
                          disableVirtualization={false}
                      />
                    </View>
                </components.Layout>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%'
    },
    normalText: {
        color: COLOR.textNormal,
        fontSize: 16,
        height: 28,
    },
    backImage: {
        width: 24,
        height: 23,
        marginRight: 10
    },
    titleContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 28,
        marginLeft: 15
    },
    quickCheck: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    callButton: {
        flex: 1
    },

    materialInfo: {
        display: 'flex',
        flexDirection: 'row',
        // paddingBottom: 5,
        paddingTop: 10,
    },
    materialInfoLeft: {
        display: 'flex',
        flex: 0.85,
    },
    materialInfoRight: {
        flex: 2,
        marginLeft: 5,
        // paddingBottom: 150
    },
    leftText: {
        textAlign: 'right'
    },
    rightText: {
        textAlign: 'left'
    },
    material_row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5
    },
    material_detail: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    materialInfoBottom: {
      flex:1,
      overflow: 'scroll',
      paddingLeft: 40
    }
});