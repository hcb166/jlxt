

import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import * as components from '../'
import {COLOR} from '../../config'

export default ({onChangeText, text, search, backTo, placeholder, children, style, styleContainer, ...props}) => {
  	return (
  		styleContainer?
	    (<View style={[styles.container,{borderBottomWidth: 0,height:50}]}>
	    	{backTo
	    		?backTo
	    		:null
	    	}
	    	<Text style={styles.text}>{text}</Text>
	    	<View>
	    		{search
	    			?<components.SearchInput
	    				placeholder="搜索"
	    				onChangeText={onChangeText}
	    			>
	    			</components.SearchInput>
	    			:null
	    		}
	    	</View>
	    	{children}
	    </View>)
	    :
	    (<View style={[styles.container,{borderBottomWidth: 2,height:60}]}>
	    	{backTo
	    		?backTo
	    		:null
	    	}
	    	<Text style={styles.text}>{text}</Text>
	    	<View>
	    		{search
	    			?<components.SearchInput
	    				placeholder="搜索"
	    				onChangeText={onChangeText}
	    			>
	    			</components.SearchInput>
	    			:null
	    		}
	    	</View>
	    	{children}
	    </View>)
  	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		
		padding: 5,
		
		borderBottomColor: COLOR.lineTitle,
	},
	image: {
		width: 24,
		height: 23,
		marginRight: 10
	},
  	text: {
	    fontSize: 18,
	    color: COLOR.textNormal,
	    fontWeight: '600',
	    marginRight: 10
  	}
})
