import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'

// 跳转回任务列表前清除动作记录，关闭摄像头的调用，防止闪退
import { NavigationActions } from 'react-navigation'
var resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName:'MissionList'})//要跳转到的页面名字
    ]
});

export default class QRcodeError extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    constructor(props) {
        super(props);
    }

    render() {        
        // let item = this.props.navigation.state.params.result
        // console.log(item)
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        back="QRcoding"
                        text="扫码错误"
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(resetAction)}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                    >
                    </components.PageTitle>
                    <View style={styles.errorMain}>
                        <Image source={require('../../../res/img/error.png')} style={styles.errorImage}/>
                        <Text style={styles.errorText}>无效条码！</Text>
                    </View>
                </components.Layout>
            </View>);
    }
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%'
    },
    backImage: {
        width: 24,
        height: 23,
        marginRight: 10
    },
    errorMain: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingTop: 50,
    },
    errorImage: {
        width: 160,
        height: 120,
    },
    errorText: {
        color: COLOR.textError,
        fontSize: 18,
        height: 30,
        marginTop: 30
    },
});