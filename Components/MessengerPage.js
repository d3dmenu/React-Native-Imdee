import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage, Platform } from 'react-native';
import { Foundation,MaterialIcons } from '@expo/vector-icons';
import SearchTab from '../Option/SearchTab.js'
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js'

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export default class MessengerPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead();
      this.state = {
        i:0,
        listchat : null,
        realuser : '',
        dataSource : [],
        dataObj : [],
      }
    }
    onPressLoadmore = () =>{
      //this.state.dataSource.splice(dataSource.length-1, 0, ['Talitha Stinger',"That's clear."]);
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    onPressChat = (items) =>{
      this.props.navigation.navigate('ChatScreen', {items:items.restaurants});
    }
    changeLengthMessage = (text) =>{
      if(text.indexOf('\n')<20 && text.indexOf('\n')>-1){
        text = text.substring(0,text.indexOf('\n'))+'...';
      }
      if(text.length>=20){
        text = text.substring(0,20)+'...';
      }
      return text;
    }
    SearchFilterFunction = (text) =>{
      const newData = this.state.dataSource.filter(function(item) {
        const itemData = item.restaurants.restaurant.Name ? item.restaurants.restaurant.Name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({dataObj:newData});
    }
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);

      this.setState({realuser:account.Email+':'+account.Phone})
      database.readListChat(account.Email+':'+account.Phone, this.readListChat_success);
    }
    readListChat_success = (listchat) =>{
      this.setState({listchat:listchat,dataObj:[],dataSource:[]});
      for(var i=0;i<listchat.length;i++){
        database.readRestaurantUser(listchat[i], this.readRestaurantUser_success)
      }
    }
    readRestaurantUser_success = (obj) =>{
      this.state.dataObj.push(obj);
      const sortedActivities = this.state.dataObj.sort((a, b) => b.TimeSort - a.TimeSort)
      this.setState({dataObj:sortedActivities, dataSource:sortedActivities})
    }
    changeTime = (times) =>{
      if (Platform.OS === 'ios') {
        console.log('ios');
        var day = times.substring(0,times.indexOf('/'))
        times = times.substring(times.indexOf('/')+1).trim();
        var month = times.substring(0,times.indexOf('/'))
        times = times.substring(times.indexOf('/')+1).trim();
        var year = String(Number(times.substring(0,times.indexOf(' ')))-543)
        times = times.substring(times.indexOf(' ')+1).trim();
        var time = times;
        if(day.length==1){
          day = '0'+day
        }
        if(month.length==1){
          month = '0'+month
        }

        var times2 = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"});
        var day2 = times2.substring(0,times2.indexOf('/'))
        times2 = times2.substring(times2.indexOf('/')+1).trim();
        var month2 = times2.substring(0,times2.indexOf('/'))
        times2 = times2.substring(times2.indexOf('/')+1).trim();
        var year2 = String(Number(times2.substring(0,times2.indexOf(' ')))-543)
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var time2 = times2;
        if(day2.length==1){
          day2 = '0'+day2
        }
        if(month2.length==1){
          month2 = '0'+month2
        }
        const ago = new Date(month + '/' + day + '/' + year);
        const now = new Date(month2 + '/' + day2 + '/' + year2);
        const diffTime = Math.abs(now - ago);
        const diffDays = Math.ceil(diffTime/(60*60*24*1000));
        if(diffDays < 2 && diffDays >= 1)
          return time.substring(0,time.length-3) + ', Yesterday'
        else if(diffDays < 1)
          return time.substring(0,time.length-3) + ', Today'
        else
          return time.substring(0,time.length-3) + ', ' + day + '/' + month + '/' + year.substring(2)
      }
      else if (Platform.OS === 'android') {
        console.log('android');
        var dayText = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var month = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var day = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var time = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var year = times
        if(day.length==1){
          day = '0'+day
        }
        if(String(Number(months.indexOf(month)+1)).length==1){
          month = '0'+String(Number(months.indexOf(month)+1))
        }

        var times2 = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"});
        var dayText2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var month2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var day2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var time2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var year2 = times2;
        if(day2.length==1){
          day2 = '0'+day2
        }
        if(String(Number(months.indexOf(month2)+1)).length==1){
          month2 = '0'+String(Number(months.indexOf(month2)+1))
        }

        const ago = new Date(month + '/' + day + '/' + year);
        const now = new Date(month2 + '/' + day2 + '/' + year2);
        const diffTime = Math.abs(now - ago);
        const diffDays = Math.ceil(diffTime/(60*60*24*1000));
        if(diffDays < 2 && diffDays >= 1)
          return time.substring(0,time.length-3) + ', Yesterday'
        else if(diffDays < 1)
          return time.substring(0,time.length-3) + ', Today'
        else
          return time.substring(0,time.length-3) + ', ' + day + '/' + month + '/' + year.substring(2)
      }
    }
    render() {
        return (
          <View style={{flex: 1,backgroundColor:'#151A20'}}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = 'แชท'
              btnBack = {this.onPressBack}
            />
            <SearchTab Func_Search={this.SearchFilterFunction}/>
            <View style={{flex:0.87,marginLeft:15,marginRight:15}}>
              <FlatList
                data = {this.state.dataObj}
                style={{marginTop:10}}
                renderItem = {({item}) =>
                  (item.restaurants.restaurant.Name=='')
                  ? <View style={{justifyContent:'center',alignItems:'center',margin:25}}>
                      <TouchableOpacity style={{flexDirection:'row',padding:5,paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center',backgroundColor:'#31343D',borderRadius:100}} onPress={()=>this.btn_Loadmore()}>
                        <Foundation style={{paddingRight:5,color:'#ADADAD'}} name={'refresh'} size={20}/>
                        <Text style={{color:'#ADADAD',fontSize:15}}>Load more</Text>
                      </TouchableOpacity>
                    </View>
                  : <View style={{justifyContent:'center',alignItems:'center'}}>
                      <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} onPress={()=>this.onPressChat(item)}>
                        <Image source={{ uri: item.restaurants.Logo }} style={{ alignSelf:'center',width: 45, height:45, borderRadius:100}}></Image>
                        <View style={{flex:1,padding:10}}>
                          <View style={{flexDirection:'row'}}>
                            <View style={{flex:0.65,justifyContent:'center',alignItems:'flex-start'}}>
                              <Text style={{color:'#CECECE',fontSize:17,fontFamily:'kanitSemiBold'}}>{item.restaurants.restaurant.Name}</Text>
                            </View>
                            <View style={{flex:0.35,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                              <Text style={{color:'#DB3966',fontSize:10,fontFamily:'kanitRegular'}}>{this.changeTime(item.newchat.Time)}</Text>
                              <MaterialIcons style={{color:'#DB3966'}} name={'navigate-next'} size={25}/>
                            </View>
                          </View>
                          <Text style={{color:'#8C8C8C',fontSize:15,fontFamily:'kanitRegular'}}>{this.changeLengthMessage(item.newchat.Message)}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{width:'100%',height:0.5,backgroundColor:'#6B6A6B'}}/>
                    </View>
                }
              />
            </View>
            <View style={{flex:0.02}}/>
          </View>

   );}
}
