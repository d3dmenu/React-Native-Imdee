import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage } from 'react-native';
import MyShopNotEmptyPage from './MyShopNotEmptyPage.js';
import MyShopEmptyPage from './MyShopEmptyPage.js';
import CreateShopPage from './CreateShopPage.js';
import BottomTabNavigation from '../Option/BottomTabNavigation.js'
import { Ionicons } from '@expo/vector-icons';
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js'

export default class MyShopPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead();
      this.state = {
        realuser:'',
        onPage : <View style={{flex:0.94}}/>,
      };
    }
    onPressMyShopEmpty = () =>{
      this.setState({onPage : <MyShopEmptyPage btnCreateShop={this.onPressCreateShop}/>});
    }
    onPressCreateShop = () =>{
      this.setState({onPage : <CreateShopPage btnCreateShop={()=>{this.props.navigation.navigate('HomeScreen')}} realuser={this.state.realuser}/>});
    }
    onPressMyShopNotEmpty = () =>{
      this.setState({onPage : <MyShopNotEmptyPage btnCreateMenu={this.onPressCreateMenu} realuser={this.state.realuser}/>});
    }

    /////////////////// Button ////////////////////
    onPressBack = () =>{
      this.props.navigation.navigate('HomeScreen');
    }
    onPressCreateMenu = (item,alltype,allmenu,typesSolo) =>{
      var objtype = [];
      for(var i=1;i<alltype.length-1;i++){
        objtype.push(alltype[i]);
      }
      var items = {
        alltype : objtype,
        allmenu : allmenu,
        item : item,
        typesSolo : typesSolo,
      }
      this.props.navigation.navigate('CreateMenuScreen',{items:items});
    }
    ///////////////////////////////////////////////
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      var stateShop = await AsyncStorage.getItem('stateRestaurant_IMDEE');
      account = JSON.parse(account);
      this.setState({realuser:account.Email+':'+account.Phone});
      if(Number(stateShop) == 1)
        this.onPressMyShopNotEmpty();
      else
        this.onPressMyShopEmpty();
    }
    render() {
        return (
          <View style={styles.container}>
            <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',padding:15,paddingBottom:0}} onPress={this.onPressBack}>
              <Ionicons style={{marginLeft:5}} name={'ios-arrow-back'} size={20} color={'#DB3966'}/>
              <Text style={{marginLeft:5,fontSize:15,color:'#DB3966',fontFamily:'kanitRegular'}}>ตั้งค่า</Text>
            </TouchableOpacity>
            {this.state.onPage}
          </View>

      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20'
  },
});
