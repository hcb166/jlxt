import {Dimensions} from 'react-native';

export const DEBUG = true;//调试模式
export const IN_DEBUGGER = DEBUG && !!window.navigator.userAgent;

export const VERSION = '0.0.1';

let {width, height} = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;


export const COLOR = {
    theme: '#ff8800',
    // favored: '#C71A22',
    // textPrompt: '#929292',
    textNormal: '#535353',
    textEmpha: '#212121',
    textError: '#f02828',
    // textLightPrompt: '#EBEBEB',
    textLightNormal: '#FFFFFF',
    textBurdening: '#ff8800',
    textBurdenFinish: '#2193f3',
    textMisFinish: '#1eb852',
    backgroundInput: '#e5e5e5',
    backgroundNormal: '#e3e3e3',
    backgroundLighter: '#FFFFFF',
    backgroundDarkLighter: '#424242',
    backgroundDarker: '#D6D6D6',
    backgroundDarkNormal: '#000000',
    // backgroundNotice: '#FFFB00',
    backgroundRedButton: '#f02828',
    backgroundGrayButton: '#a5a5a5',
    backgroundGreenButton: '#1eb852',
    // linePrompt: '#EBEBEB',
    lineNormal: '#cfcfcf',
    lineTitle: '#cdcdcd',
}
