import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage, Platform } from 'react-native';
import { Foundation,MaterialIcons,Feather } from '@expo/vector-icons';
import SearchTab from '../Option/SearchTab.js'
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js'

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export default class WalletPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead();
      this.state = {
        realuser:'',
        token:'',
        money:0,
        name:'',
        image:'',
        income:0,
        expense:0,
        dataSource : [],
      }
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    updateToken = (token) =>{
      this.setState({token:token})
    }
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);
      database.randomToken(this.updateToken);
      database.readWallet((account.Email+':'+account.Phone), this.readWalletSuccess);

      var mail = account.Email.substring(0,account.Email.indexOf('@'));
      var domain = account.Email.substring(account.Email.indexOf('@')+1,account.Email.length);
      setTimeout(()=>{
        this.setState({
          realuser : account.Email+':'+account.Phone,
          image : "https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/User%2F"+mail+"%40"+domain+"%3A"+account.Phone+".jpg?alt=media&token="+this.state.token,
          name : account.Name,
        });
      },100)
    }
    onChangeTime = (times) =>{
      if (Platform.OS === 'ios') {
        var day = times.substring(0,times.indexOf('/'))
        times = times.substring(times.indexOf('/')+1).trim();
        var month = times.substring(0,times.indexOf('/'))
        times = times.substring(times.indexOf('/')+1).trim();
        var year = String(Number(times.substring(0,times.indexOf(' ')))-543)
        times = times.substring(times.indexOf(' ')+1).trim();
        var time = times;
        if(day.length==1){
          day = '0'+day;
        }
        if(month.length==1){
          month = months[Number(month)-1];
        }
        times = day+' '+month+' '+year+' '+time.substring(0,time.length-3);
      }
      else if (Platform.OS === 'android') {
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
        times = day+' '+month+' '+year+' '+time.substring(0,time.length-3);
      }
      return times;
    }
    readWalletSuccess = (wallet) =>{
      var objHistory = [];
      for(var i=0;i<wallet.History.length;i++){
        var data = {
          timeWallet : this.onChangeTime(wallet.History[i].Time),
          moneyWallet : wallet.History[i].Money
        }
        objHistory.push(data)
      }
      this.setState({money:wallet.Money, income:wallet.Income, expense:wallet.Expense, dataSource:objHistory});
    }
    onPressDeposit = () =>{
      this.props.navigation.navigate('DepositScreen', {realuser : this.state.realuser});
    }
    render() {
        return (
          <View style={{flex: 1,backgroundColor:'#151A20'}}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = 'วอลเล็ท'
              btnBack = {this.onPressBack}
            />
            <View style={{flex:0.94,marginLeft:15,marginRight:15}}>
              <View style={{flexDirection:'row',alignItems:'center',paddingBottom:20,paddingTop:10}}>
                <Image source={{ uri: this.state.image }} style={{ alignSelf:'center',width: 55, height:55, borderRadius:100}}></Image>
                <Text style={{color:'white',fontSize:20,fontFamily:'kanitBold',padding:10}}>{this.state.name}</Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:0.7,justifyContent:'center'}}>
                  <Text style={{color:'#D8D8D8',fontSize:13,fontFamily:'kanitSemiBold',padding:10,paddingBottom:0}}>ยอดเงินของคุณ</Text>
                </View>
                <TouchableOpacity style={{flex:0.3,justifyContent:'center',alignItems:'center',backgroundColor:'#FF2D55',borderRadius:50}} onPress={this.onPressDeposit}>
                  <Text style={{color:'white',fontSize:13,fontFamily:'kanitSemiBold',padding:10}}>ฝากเงิน</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:0.7,justifyContent:'center'}}>
                  <Text style={{color:'white',fontSize:36,fontFamily:'kanitBold',padding:15,paddingTop:0,paddingLeft:10}}>฿ {this.state.money}</Text>
                </View>
                <TouchableOpacity style={{flex:0.3,justifyContent:'center',alignItems:'center',backgroundColor:'white',borderRadius:50}}>
                  <Text style={{color:'#FF2D55',fontSize:13,fontFamily:'kanitSemiBold',padding:10}}>ถอนเงิน</Text>
                </TouchableOpacity>
              </View>
              <View style={{width:'100%',height:1,backgroundColor:'#454545',alignItems:'center'}}/>
              <View style={{width:'100%',flexDirection:'row'}}>
                <View style={{flex:0.5,justifyContent:'center',alignItems:'center',padding:10}}>
                  <Text style={{color:'#868686',fontSize:13,fontFamily:'kanitSemiBold',padding:10}}>เงินเข้า</Text>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:21,height:21,backgroundColor:'#32373E',borderRadius:100,justifyContent:'center',alignItems:'center'}}>
                      <Feather color='#2BF658' name='arrow-up-right' size={12}/>
                    </View>
                    <Text style={{color:'white',fontSize:13,fontFamily:'kanitBold',paddingLeft:10}}>+ ฿ {this.state.income}</Text>
                  </View>
                </View>
                <View style={{flex:0.5,justifyContent:'center',alignItems:'center',padding:10}}>
                  <Text style={{color:'#868686',fontSize:13,fontFamily:'kanitSemiBold',padding:10}}>เงินออก</Text>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:21,height:21,backgroundColor:'#32373E',borderRadius:100,justifyContent:'center',alignItems:'center'}}>
                      <Feather color='#FE4646' name='arrow-down-right' size={12}/>
                    </View>
                    <Text style={{color:'white',fontSize:13,fontFamily:'kanitBold',paddingLeft:10}}>- ฿ {this.state.expense}</Text>
                  </View>
                </View>
              </View>
              <View style={{width:'100%'}}>
                <Text style={{color:'#D8D8D8',fontSize:13,fontFamily:'kanitSemiBold',paddingTop:20}}>การทำธุรกรรมครั้งล่าสุด</Text>
              </View>
              <View style={{flex:1,backgroundColor:'#272A33',borderRadius:10,marginTop:15}}>
                <FlatList
                  data = {this.state.dataSource}
                  renderItem = {({item,index}) =>
                    <View style={{width:'100%'}}>
                      <View style={{flexDirection:'row',padding:10}}>
                        <View style={{flex:0.6,flexDirection:'row',alignItems:'center'}}>
                          <Image source={{ uri: this.state.image }} style={{ alignSelf:'center',width: 30, height:30, borderRadius:100}}></Image>
                          <Text style={{color:'#CDCDCD',fontSize:15,fontFamily:'kanitBold',paddingLeft:10}}>{item.timeWallet}</Text>
                        </View>
                        <View style={{flex:0.4,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                          <Text style={{color:'white',fontSize:15,fontFamily:'kanitBold'}}>{item.moneyWallet}</Text>
                        </View>
                      </View>
                      {(index<this.state.dataSource.length-1)?<View style={{width:'100%',height:1,backgroundColor:'#3F3F3F'}}/>:null}
                    </View>
                  }
                />
              </View>
            </View>
            <View style={{flex:0.02}}/>
          </View>

   );}
}
