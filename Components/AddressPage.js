import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage } from 'react-native';
import { Foundation,MaterialIcons } from '@expo/vector-icons';
import SearchTab from '../Option/SearchTab.js'
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js'

export default class AddressPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead();
      this.state = {
        Title:'',
        realuser:'',
        newAddress:'',
        index:-1,
        lengthnewAddress:0,
        dataSource : [],
      }
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    onChangeText = (text) =>{
      this.setState({newAddress:text,lengthnewAddress:text.length});
    }
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);

      this.setState({realuser:account.Email+':'+account.Phone})
      database.readAddress(account.Email+':'+account.Phone, this.readAddressSuccess);
    }
    readAddressSuccess = (obj) =>{
      this.setState({dataSource:obj});
    }
    onPressCreateAddress = () =>{
      if(this.state.dataSource.length<6){
        this.props.navigation.navigate('CreateAddressScreen');
      }
      else{
        Alert.alert('คุณสามารถเพิ่มที่อยู่ได้แค่ 5 ที่อยู่เท่านั้น')
      }
    }
    onPressEditAddress = (items) =>{
      this.props.navigation.navigate('CreateAddressScreen', {items:items})
    }
    onPressChangeDefaultAddress = (id) =>{
      for(var i=0;i<this.state.dataSource.length-1;i++){
        if(this.state.dataSource[i].address.State == 1){
          database.changeDefaultAddress(this.state.realuser, id, this.state.dataSource[i].id);
          break;
        }
      }
    }
    render() {
        return (
          <View style={{flex: 1,backgroundColor:'#151A20'}}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = 'ที่อยู่'
              btnBack = {this.onPressBack}
            />
            <View style={{flex:0.94,marginLeft:15,marginRight:15}}>
              <FlatList
                data = {this.state.dataSource}
                style = {{marginTop:10}}
                renderItem = {({item}) =>
                  (item.address.Mode=='Address')
                    ? <View style={{width:'100%',backgroundColor:(item.address.State==1)?'#CA1749':'#31343D',marginBottom:20,borderRadius:10}}>
                        <Text style={{padding:10,color:(item.address.State==1)?'white':'#D0D0D0',fontSize:20,fontWeight:'bold',fontFamily:'kanitBold'}}>{'ที่อยู่ '+String(item.address.ID+1)}</Text>
                        <View style={{width:'95%',height:0.5,backgroundColor:(item.address.State==1)?'white':'#6B6A6B',alignSelf:'center'}}/>
                        <Text style={{padding:10,color:(item.address.State==1)?'white':'#868686',fontSize:14,fontFamily:'kanitRegular',textTransform:'lowercase'}}>{'ชื่อ-นามสกุล : '+item.address.Name+'\nรายละเอียดที่อยู่ : '+item.address.Information+'\nอำเภอ : '+item.address.Amphoe+'\nตำบล : '+item.address.District+'\nจังหวัด : '+item.address.Province+'\nรหัสไปรษณีย์ : '+item.address.Zipcode+'\nเบอร์โทร : '+item.address.Phone}</Text>
                        <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row'}}>
                        {(item.address.State==1)
                          ?null
                          :<TouchableOpacity onPress={()=>this.onPressChangeDefaultAddress(item.id)}>
                            <Text style={{padding:10,alignSelf:'flex-end',color:'#FF2D55',fontSize:16,fontFamily:'kanitMedium'}}>ตั้งเป็นที่อยู่หลัก</Text>
                          </TouchableOpacity>
                        }
                          <TouchableOpacity onPress={()=>this.onPressEditAddress(item)}>
                            <Text style={{padding:10,alignSelf:'flex-end',color:(item.address.State==1)?'white':'#FF2D55',fontSize:16,fontFamily:'kanitMedium'}}>แก้ไข</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    : <TouchableOpacity style={{width:'100%',backgroundColor:'#CA1749',marginBottom:20,borderRadius:10,flexDirection:'row'}} onPress={this.onPressCreateAddress}>
                        <View style={{flex:0.7,alignItems:'flex-start',justifyContent:'center'}}>
                            <Text style={{padding:10,color:'#D0D0D0',fontSize:18,fontFamily:'kanitBold'}}>เพิ่มที่อยู่ใหม่</Text>
                        </View>
                        <View style={{flex:0.3,alignItems:'flex-end',justifyContent:'center'}}>
                          <Text style={{padding:10,color:'#D0D0D0',fontSize:40,fontFamily:'kanitBold'}}>+</Text>
                        </View>
                      </TouchableOpacity>
                }
              />
            </View>
            <View style={{flex:0.02}}/>
          </View>

   );}
}
