import React from 'react';
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { Text, View } from 'react-native';
import MixNavigation from './Navigation/MixNavigation.js'
//import Test from './Components/Test.js'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loadingFont: true,
    }
    this._loadingFont = this._loadingFont.bind(this)
  }

  componentDidMount () {
    this._loadingFont()
  }

  async _loadingFont () {
    await Font.loadAsync({
      kanitBlack: require('./assets/fonts/Kanit-Black.ttf'),
      kanitBlackItalic: require('./assets/fonts/Kanit-BlackItalic.ttf'),
      kanitBold: require('./assets/fonts/Kanit-Bold.ttf'),
      kanitBoldItalic: require('./assets/fonts/Kanit-BoldItalic.ttf'),
      kanitExtraBold: require('./assets/fonts/Kanit-ExtraBold.ttf'),
      kanitExtraBoldItalic: require('./assets/fonts/Kanit-ExtraBoldItalic.ttf'),
      kanitExtraLight: require('./assets/fonts/Kanit-ExtraLight.ttf'),
      kanitExtraLightItalic: require('./assets/fonts/Kanit-ExtraLightItalic.ttf'),
      kanitItalic: require('./assets/fonts/Kanit-Italic.ttf'),
      kanitLight: require('./assets/fonts/Kanit-Light.ttf'),
      kanitLightItalic: require('./assets/fonts/Kanit-LightItalic.ttf'),
      kanitMedium: require('./assets/fonts/Kanit-Medium.ttf'),
      kanitMediumItalic: require('./assets/fonts/Kanit-MediumItalic.ttf'),
      kanitRegular: require('./assets/fonts/Kanit-Regular.ttf'),
      kanitSemiBold: require('./assets/fonts/Kanit-SemiBold.ttf'),
      kanitSemiBoldItalic: require('./assets/fonts/Kanit-SemiBoldItalic.ttf'),
      kanitThin: require('./assets/fonts/Kanit-Thin.ttf'),
      kanitThinItalic: require('./assets/fonts/Kanit-ThinItalic.ttf'),
    })
    this.setState({ loadingFont: false })
  }

  render(){
    const { loadingFont } = this.state

    if (loadingFont) {
      return <AppLoading />
    }
    return (
      <MixNavigation/>
    );
  }
}
