import React from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  Button, ImageEditor,Image,Alert,TouchableHighlight,ScrollView,FlatList,AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import {Ionicons,FontAwesome,Foundation} from '@expo/vector-icons'
import BackTab from '../Option/BackTab.js'
import SearchTab from '../Option/SearchTab.js'
import database from '../Database/Database.js'

export default class CreateAddressPage extends React.Component {
  constructor(props){
    super(props);
    this.onAsyncRead();
    var items = this.props.navigation.getParam('items', 'No-Item');
    this.state = {
      dataSource : require('../ProvinceDB.json'),
      dataObjShow : [],
      textSearch : '',
      realuser : '',
      items : items,

      id : (items=='No-Item')?'':items.id,
      name : (items=='No-Item')?'':items.address.Name,
      phone : (items=='No-Item')?'':items.address.Phone,
      province : (items=='No-Item')?'':items.address.Province,
      amphoe : (items=='No-Item')?'':items.address.Amphoe,
      district : (items=='No-Item')?'':items.address.District,
      zipcode : (items=='No-Item')?'':items.address.Zipcode,
      information : (items=='No-Item')?'':items.address.Information,
    }
  }
  SearchFilterFunction = (text) =>{
    if(text!=''){
      const newData = this.state.dataSource.filter(function(item) {
        const itemDataPro = item.province ? item.province.toUpperCase() : ''.toUpperCase();
        const itemDataDis = item.district ? item.district.toUpperCase() : ''.toUpperCase();
        const itemDataAmp = item.amphoe ? item.amphoe.toUpperCase() : ''.toUpperCase();
        const itemDataZip = String(item.zipcode) ? String(item.zipcode).toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return (itemDataPro.indexOf(textData) > -1 || itemDataDis.indexOf(textData) > -1 || itemDataAmp.indexOf(textData) > -1 || itemDataZip.indexOf(textData) > -1);
      });
      this.setState({dataObjShow:newData});
    }
    else{
      this.setState({dataObjShow:[]});
    }
    this.setState({textSearch:text})
  }
  onPressBTN_Search = (item) =>{
    this.setState({textSearch:'', dataObjShow:[], province:item.province, amphoe:item.amphoe, district:item.district, zipcode:item.zipcode})
  }
  onPressBack = () =>{
    this.props.navigation.goBack();
  }
  onPressOK = () =>{
    if(this.state.name.trim().length==0){
      Alert.alert('โปรดกรอกชื่อ-นามสกุล')
    }
    else if(this.state.phone.length==0){
      Alert.alert('โปรดกรอกเบอร์โทร')
    }
    else if(this.state.phone.length<10){
      Alert.alert('เบอร์โทรไม่ถูกต้อง')
    }
    else if(this.state.province.trim().length==0 || this.state.amphoe.trim().length==0 || this.state.district.trim().length==0 || String(this.state.zipcode).trim().length==0){
      Alert.alert('ที่อยู่ไม่ถูกต้อง')
    }
    else if(this.state.information.trim().length==0){
      Alert.alert('โปรดกรอกรายละเอียดที่อยู่')
    }
    else{
      if(this.state.phone.length == 10 && this.state.phone[0] == '0' && (this.state.phone[1] == '6' || this.state.phone[1] == '8' || this.state.phone[1] == '9' || this.state.phone[1] == '2')){
        var address = {
          Name:this.state.name,
          Phone:this.state.phone,
          Province:this.state.province,
          Amphoe:this.state.amphoe,
          District:this.state.district,
          Zipcode:String(this.state.zipcode),
          Information:this.state.information,
          Mode : 'Address',
          ID : (this.state.id=='')?0:this.state.items.address.ID,
          State : 0
        }
        database.addAddress(this.state.id, this.state.realuser, address, this.addAddress_success)
      }
      else{
        Alert.alert('เบอร์โทรไม่ถูกต้อง');
      }
    }
  }
  addAddress_success = (state) =>{
    if(state==1)
      Alert.alert('แก้ไขที่อยู่สำเร็จแล้ว');
    else if(state==2)
      Alert.alert('เพิ่มที่อยู่ใหม่สำเร็จแล้ว');
    this.props.navigation.navigate('AddressScreen');
  }
  onChangeHeight = () =>{
    var height = 39*this.state.dataObjShow.length
    if(height>=300){
      height = 300
    }
    return height
  }
  onAsyncRead=async ()=>{
    var account = await AsyncStorage.getItem('account_IMDEE');
    account = JSON.parse(account);

    this.setState({realuser:account.Email+':'+account.Phone, name:account.Name, phone:account.Phone})
  }
  render() {
      const { textBar } = this.props;
      return (
      <View style={{zIndex: 0,position:'absolute',flex: 1,width:'100%',height:'100%',backgroundColor:'#151A20'}}>
        <View style={{flex:0.03}}/>

        <BackTab
          iconBackLG = {true}
          txtBackLG = 'กลับ'
          btnBack = {this.onPressBack}
        />
        <View style={{flex:0.12}}>
          <View style={{marginLeft:'5%'}}>
            <Text style ={{fontSize:20 , color:'white',marginTop:'3%',fontFamily:'kanitBold'}}>ค้นหาชื่อที่อยู่ของคุณ</Text>
            <Text style ={{fontSize:14 , color:'#BBBBBB',marginTop:'1%',fontFamily:'kanitRegular'}}>ลองกรอกอย่างใดอย่างหนึ่ง</Text>
            <Text style ={{fontSize:14 , color:'#BBBBBB',fontFamily:'kanitRegular'}}>ตำบล อำเภอ จังหวัด หรือรหัสไปรษณีย์</Text>
          </View>
        </View>
        <View style={{top:'6%'}}>
          {(this.state.dataObjShow.length>0)
          ?<View style={{zIndex: 1,position:'absolute',width:'100%',height:this.onChangeHeight()}}>
            <FlatList
              data = {this.state.dataObjShow}
              renderItem = {({item}) =>
                <View style={{backgroundColor:'white',marginLeft:25,marginRight:25}}>
                  <TouchableOpacity style={{backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:'#8E8E93',height:39}} onPress={()=>this.onPressBTN_Search(item)}>
                    <Text style={{color:'#8E8E93',padding:10,fontFamily:'kanitRegular'}}>{item.district} -> {item.amphoe} -> {item.province} -> {item.zipcode}</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
          :null
          }
        </View>
        <SearchTab Func_Search={this.SearchFilterFunction} value={this.state.textSearch}/>
        <View style={{height: '0.1%',marginTop:'2%',borderColor:'#5A5A5A',backgroundColor:'#5C5D60',marginLeft:15,marginRight:15}}/>

        <View style={{flex:0.65}}>
          <ScrollView style={{marginTop:'5%',marginLeft:'5%'}}>
            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',fontFamily:'kanitMedium'}}>ชื่อ-นามสกุล</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular',textTransform: "lowercase"}} value={this.state.name} onChangeText={name=>this.setState({name})}/>

            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',marginTop:'3%',fontFamily:'kanitMedium'}}>เบอร์โทร</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular'}} value={this.state.phone} onChangeText={phone=>this.setState({phone})} keyboardType={'numeric'}/>

            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',marginTop:'3%',fontFamily:'kanitMedium'}}>รายละเอียดที่อยู่</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular'}} value={this.state.information} onChangeText={information=>this.setState({information})}/>

            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',marginTop:'3%',fontFamily:'kanitMedium'}}>ตำบล / แขวง</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular'}} value={this.state.district} onChangeText={district=>this.setState({district})}/>

            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',marginTop:'3%',fontFamily:'kanitMedium'}}>อำเภอ / เขต</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular'}} value={this.state.amphoe} onChangeText={amphoe=>this.setState({amphoe})}/>

            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',marginTop:'3%',fontFamily:'kanitMedium'}}>จังหวัด</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular'}} value={this.state.province} onChangeText={province=>this.setState({province})}/>

            <Text style ={{fontSize:18 , color:'#BBBBBB',marginBottom:'2%',marginTop:'3%',fontFamily:'kanitMedium'}}>รหัสไปรษณีย์</Text>
            <TextInput style={{height: 38,borderRadius:10,width:'95%',backgroundColor:'#33353D',paddingLeft:10,paddingRight:10,color:'white',fontFamily:'kanitRegular'}} value={String(this.state.zipcode)} onChangeText={zipcode=>this.setState({zipcode})}/>

            <TouchableOpacity style={{padding:10,justifyContent:'center',alignItems:'center',backgroundColor:'#FF2D55',borderRadius:100,width:'95%',marginTop:'5%'}} onPress={this.onPressOK}>
                    <Text style={{color:'white',fontSize:18,fontFamily:'kanitSemiBold'}}>ยืนยัน</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

        <View style={{flex:0.02}}/>
      </View>
    );
  }
}
