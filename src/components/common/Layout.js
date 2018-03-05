

import React from 'react'
import {StyleSheet, View} from 'react-native'

import {COLOR} from '../../config'

export default ({children, style, ...props}) => {
  return (
    <View style={[styles.container,style]}>
    	<View style={styles.main}>
			{children}
    	</View>
    </View>
  )
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.backgroundNormal,
		padding: 5,
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	main: {
		backgroundColor: COLOR.backgroundLighter,
		borderRadius: 5,
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10
	}
})
