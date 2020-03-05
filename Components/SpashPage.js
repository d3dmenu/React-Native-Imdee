import React from 'react';
import { Text, View, Image, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../Option/AllStyle.js';
import database from "../Database/Database.js";

export default class SpashPage extends React.Component{
  componentDidMount() {
    this.onAsyncRead();
  }
  onAsyncRead=async ()=>{
    var account = await AsyncStorage.getItem('account_IMDEE');
    account = JSON.parse(account);
    setTimeout(()=>{
      if(account!='' && account!=null && account!=undefined){
        database.readCart(account.Email+':'+account.Phone);
        database.checkRestaurant(account.Email+':'+account.Phone);
        this.props.navigation.navigate('SecondScreen');
      }
      else{
        this.props.navigation.navigate('FirstScreen')
      }
    },1500)
  }
  render(){
    return (
        <LinearGradient colors={['#21232c','#0F1014', '#11151B']} style={{flex:1}} >

          <View style={styles.header}/>{/* HEADER View */}

          <View style={{flex:0.95}}>{/* body all part of app */}
            <View style={{flex:0.35, margin:5}}/>
            <View style={{backgroundColor:'#ff8080', width:270, height:270, alignSelf:'center', borderRadius:270}}>
              <Image
                source={require('../image/fooddome_116536.png') }
                style={{ width: 240, height: 240 , margin:'5.8%'}}>
              </Image>
            </View>
              <Text style={{alignSelf:'center', fontSize:42, margin:'5%', color:'#D7D7D7' ,fontFamily:'kanitBold'}}> IMDEE </Text>
          </View>

          <View style={styles.tailer}/>{/* TAILER View */}

        </LinearGradient>
    );
  }
}
