import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'
import {ServerUrl} from '../../constants/Urls';
import {NetUtil} from '../../utils/netUtil';

// 跳转回任务列表前清除动作记录，关闭摄像头的调用，防止闪退
// import { NavigationActions } from 'react-navigation'
// var resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({routeName:'MissionList'})//要跳转到的页面名字
//     ]
// });

export default class SelWorkline extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            keyword:'',
            worklines:props.navigation.state.params.item.workline.split(','),
        };
    }

    _renderItem = ({item,index}) => (
        item.indexOf(this.state.keyword)>-1||!this.state.keyword?
        (<TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('SelMaterial',{item:this.props.navigation.state.params.item, workline_code:item})}>
            <Text style={styles.normalText}>{item}</Text>
        </TouchableOpacity>):null
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
                        back="FindPromoteNum"
                        text="选择产线"
                        search='FindPromoteNum'
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                        onChangeText={this._onChangeText.bind(this)}
                    >
                    </components.PageTitle>
                    <FlatList
                        data={this.state.worklines}
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