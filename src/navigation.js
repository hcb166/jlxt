import React from 'react'
import {StackNavigator, TabNavigator} from 'react-navigation'

import {COLOR} from './config'
import * as components from './components'

// 页面
const pages = StackNavigator(
    {
        MissionList: {screen: components.MissionList},
        Config: {screen: components.Config},
        ScanConfig: {screen: components.ScanConfig},
        ScanConfigFail: {screen: components.ScanConfigFail},
        ScanConfigSuccess: {screen: components.ScanConfigSuccess},
        MissionInfo: {screen: components.MissionInfo},
        QRcoding: {screen: components.QRcoding},
        QRcodeError: {screen: components.QRcodeError},
        SelPromoteNum: {screen: components.SelPromoteNum},
        SelMaterial: {screen: components.SelMaterial},
        FindPromoteNum: {screen: components.FindPromoteNum},
        SelWorkline: {screen: components.SelWorkline},
        CallSuccess: {screen: components.CallSuccess},
    },
    {
        navigationOptions: {
            headerTintColor: COLOR.textLightNormal,
            headerStyle: {backgroundColor: COLOR.theme}
        }
    }
);


//初始化
export const AppNavigator = StackNavigator(
    {
        Pages: {screen: pages},
    },
    {
        initialRouteName: 'Pages',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
)

