

import React, {Component} from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import * as components from '../../components'
import {COLOR} from '../../config'
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';


export default class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      device: ''
    }
  }
	componentWillMount() {
		// 登录获取设备信息
		var _this=this;
    storage.load({
      key: 'device',
    }).then(ret => {
      if(ret.name){
      	_this.setState({device:ret.name}); // 保存设备名称
      }else{
				Toast.show('数据请求失败，请检查配置！');
        _this.props.navigation.navigate('Config');
      }
    })
  };
	
  render() {
		let {children, style, ...props} = this.props
		return (
	    <View style={styles.container}>
	    	<Image source={require('../../../res/img/logo.png')} style={styles.image}/>
	    	<Text style={styles.text}>{this.state.device}</Text>
	    	<TouchableOpacity onPress={() => this.props.navigation.navigate('Config')}>
	    		<Image source={require('../../../res/img/config.png')} style={styles.configImage}/>
	    	</TouchableOpacity>
	    </View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height:50,
		backgroundColor: COLOR.theme,
		paddingLeft: 5,
		paddingRight: 5
	},
	image: {
		width: 87.5,
		height: 50
	},
	text: {
    fontSize: 16,
    color: COLOR.textLightNormal,
    backgroundColor: 'transparent',
    padding: 5,
    fontWeight: '700'
	},
	configImage: {
    width: 24,
    height: 23,
    marginLeft: 10,
    marginRight: 10
  }
})
