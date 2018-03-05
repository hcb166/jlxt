import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {COLOR} from '../../config';
import * as components from '../../components'


export default class CallSuccess extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header:null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            packaging: props.navigation.state.params.packaging
        };
    }

    render() {        
        // let item = this.props.navigation.state.params.item
        // console.log(item)
        return (
            <View style={styles.container}>
                <components.Header navigation={this.props.navigation}></components.Header>
                <components.Layout>
                    <components.PageTitle
                        back="MissionList"
                        text="呼叫成功"
                        backTo={
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MissionList')}>
                                <Image source={require('../../../res/img/back.png')} style={styles.backImage}/>
                            </TouchableOpacity>
                        }
                    >
                    </components.PageTitle>
                    <View style={styles.successMain}>
                    {
                        this.state.packaging=="空货架"?
                        <Text style={styles.successText}>{this.state.packaging} 呼叫成功！</Text>
                        :
                        <Text style={styles.successText}>{this.state.packaging} 呼叫物料成功！</Text>
                    }
                        
                        <components.ButtonWithBg
                            text="返回首页"
                            onPress={() => this.props.navigation.navigate('MissionList')}
                            containerStyle={{paddingLeft:50, paddingRight:50,backgroundColor: COLOR.backgroundGreenButton}}
                        >
                        </components.ButtonWithBg>
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
    successMain: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingTop: 50,
    },
    successImage: {
        width: 160,
        height: 120,
    },
    successText: {
        color: COLOR.textMisFinish,
        fontSize: 18,
        height: 30,
        marginTop: 30,
        marginBottom: 50
    },
});