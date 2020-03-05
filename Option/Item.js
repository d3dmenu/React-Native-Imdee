import React, { Component } from 'react';

import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  InteractionManager,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import database from '../Database/Database.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  icons: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 16,
  },
  underline: {
    width: '100%',
    height: 1,
    position: 'absolute',
    top: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentChild: {
    padding: 12,
    width:'100%'
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  contentTxt: {
    color: 'black',
    marginLeft: 8,
    fontSize: 12,
  },
  contentFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
  },
});

class Item extends Component {
  static animated;
  static defaultProps = {
    contentVisible: false,
    backgroundColor: 'transparent',
    titleBackground: 'transparent',
    contentBackground: 'transparent',
    underlineColor: '#d3d3d3',
    visibleImage: false,
    invisibleImage: false,
  };

  static propTypes = {
    contentVisible: PropTypes.bool,
    backgroundColor: PropTypes.string,
    titleBackground: PropTypes.string,
    contentBackground: PropTypes.string,
    underlineColor: PropTypes.string,
    visibleImage: PropTypes.any,
    invisibleImage: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      idNotify : '',
      contentVisible: props.contentVisible,
      headerheight: 0,
      contentHeight: 0,
      stateNotify : false,
      borderTitle : [10,10,10],
      realuser:'',
      i : 0,
      j : 0,
    };
  }

  onPressUpdate = () =>{
    database.updateStateNotify(this.state.realuser, this.state.idNotify);
    this.setState({stateNotify:true});
    if(this.state.i==0){
      this.setState({borderTitle:[0,10,10]});
      this.setState({i:1});
    }
    else{
      this.setState({borderTitle:[10,10,10]});
      this.setState({i:0});
    }
  }

  onUpdate = (stateNotify) =>{
    this.setState({stateNotify:stateNotify})
  }

  render() {
    const { backgroundColor, style, header, visibleImage, invisibleImage, children,
            nameNotify, stateNotify, messageNotify, timeNotify, statusNotify, idNotify, realuser } = this.props;
    const { contentVisible } = this.state;
    if(this.state.j==0){
      this.onUpdate(stateNotify);
      this.setState({j:1, idNotify:idNotify, realuser:realuser});
    }
    return (
      <Animated.View style={[
        styles.container,
        {
          height: this.animated,
          backgroundColor: backgroundColor,
        },
        style,
      ]}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=>this.onPress()}
        >
          <View
            onLayout={ this.onAnimLayout }
          >
          <View style={{padding:10,justifyContent:'center',alignItems:'center',backgroundColor:'#31343D',borderRadius:this.state.borderTitle[0],borderTopStartRadius:this.state.borderTitle[1],borderTopEndRadius:this.state.borderTitle[2]}}>
              <View style={{width:'100%',flexDirection:'row'}}>
                <View style={{flex:0.7,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                  <View style={{width:12,height:12,backgroundColor:(!this.state.stateNotify)?'#CA1749':'#8C8C8C',borderRadius:100}}/>
                  <Text style={{color:'#CECECE',fontSize:17,marginLeft:5}}>{nameNotify}</Text>
                </View>
                <View style={{flex:0.3,justifyContent:'center',alignItems:'flex-end'}}>
                  <Text style={{color:'#8C8C8C',fontSize:15}}>{timeNotify}</Text>
                </View>
              </View>
              <View style={{width:'100%',justifyContent:'flex-start',alignItems:'flex-start'}}>
                <Text style={{color:'#8C8C8C',fontSize:15}}>{messageNotify}</Text>
              </View>
              <View style={{width:'100%',justifyContent:'flex-end',alignItems:'flex-end'}}>
                {
                  contentVisible
                    ? <Entypo color='#B6B6B6' name='chevron-up' size={20}/>
                    : <Entypo color='#B6B6B6' name='chevron-down' size={20}/>
                }
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={styles.content}
          onLayout={this.onLayout}
        >
          <View
            style={[
              styles.contentChild,
            ]}
          >
            { children }
          </View>
        </View>
      </Animated.View>
    );
  }

  runAnimation = () => {
    const { contentVisible, headerHeight, contentHeight } = this.state;
    const initialValue = contentVisible
      ? headerHeight + contentHeight : headerHeight;
    const finalValue = contentVisible
      ? headerHeight : contentHeight + headerHeight;

    this.setState({
      contentVisible: !contentVisible,
    });

    this.animated.setValue(initialValue);
    Animated.spring(
      this.animated,
      {
        toValue: finalValue,
      },
    ).start();
  }

  onAnimLayout = (evt) => {
    const { isMounted, contentHeight } = this.state;
    const { contentVisible } = this.props;
    const headerHeight = evt.nativeEvent.layout.height;
    if (!isMounted && !contentVisible) {
      this.animated = new Animated.Value(headerHeight);
      this.setState({
        isMounted: true,
        headerHeight,
      });
      return;
    } else if (!isMounted) {
      InteractionManager.runAfterInteractions(() => {
        this.animated = new Animated.Value(headerHeight + contentHeight);
      });
    }
    this.setState({ headerHeight, isMounted: true });
  }

  onLayout = (evt) => {
    const contentHeight = evt.nativeEvent.layout.height;
    this.setState({ contentHeight });
  }

  onPress = () => {
    this.runAnimation();
    this.onPressUpdate();
  }
}

export default Item;
