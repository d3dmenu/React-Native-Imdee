import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, Picker, AsyncStorage } from 'react-native';
import BackTab from '../Option/BackTab.js'
import {FontAwesome} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import database from '../Database/Database.js';

export default class CreateMenuPage extends React.Component{
    constructor(props){
      super(props);
      var items = this.props.navigation.getParam('items','No-item');
      this.onAsyncRead();
      console.log(items.item);
      this.state = {
        image : items.item.image,//(items.item.image!='')?items.item.image:null,//'https://i.pinimg.com/736x/31/43/9c/31439c8699350d2bd894f02ae880817a.jpg?fbclid=IwAR1HllX_q1EUxCrEewVq9yVFweMtmTNwrmgNoPm6ixhNKvBZYsWAyVjEjqE',
        name : (items.item.menu.Name!='')?items.item.menu.Name:'',
        type : (items.typesSolo.indexOf(items.item.menu.Type)>-1) ? items.typesSolo.indexOf(items.item.menu.Type)-1 : items.typesSolo.indexOf(items.item.menu.Type),
        oldtype : (items.typesSolo.indexOf(items.item.menu.Type)>-1) ? items.typesSolo.indexOf(items.item.menu.Type)-1 : items.typesSolo.indexOf(items.item.menu.Type),
        price : (items.item.menu.Price!=0)?String(items.item.menu.Price):'',
        picker : [],
        indextype : (items.typesSolo.indexOf(items.item.menu.Type)>-1) ? items.typesSolo.indexOf(items.item.menu.Type)-1 : items.typesSolo.indexOf(items.item.menu.Type),
        realuser:'',
        items : items,
      }
      console.log(this.state.oldtype)
      this.state.picker.push(<Picker.Item label='เลือกชนิดสินค้า' value={-1} />);
      for(var i=0;i<items.alltype.length;i++){
        this.state.picker.push(<Picker.Item label={items.alltype[i].type.Name} value={i} />);
      }
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    onPressCreateMenu = () =>{
      if(this.state.image=='' || this.state.image==null || this.state.image==undefined || this.state.image.indexOf('Add Menu.jpg')>-1){
        Alert.alert('กรุณาใส่รูปสินค้าของคุณ');
      }
      else if(this.state.name.length < 2){
        Alert.alert('ชื่อสินค้าของคุณสั้นเกินไป');
      }
      else if(this.state.price == '' || this.state.price == '0'){
        Alert.alert('กรุณาใส่ราคาสินค้าของคุณ');
      }
      else if(this.state.type == -1 || this.state.indextype == -1){
        Alert.alert('กรุณาเลือกชนิดสินค้าของคุณ');
      }
      else{
        var menu = {
          ID : this.state.items.allmenu[this.state.items.allmenu.length-1].menu.Add,
          Name:this.state.name,
          Price:Number(this.state.price),
          Type:this.state.items.alltype[this.state.type].type.Name
        }
        database.addMenu(menu, this.state.image, this.state.realuser, this.state.items.alltype[this.state.type], this.state.items.alltype[this.state.oldtype], this.state.oldtype, this.state.items.item.id, this.addMenu_success);
      }
    }
    addMenu_success = () =>{
      Alert.alert('เพิ่มสินค้าสำเร็จแล้ว');
      this.props.navigation.navigate('HomeScreen');
    }
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,

      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    };
    onChangePicker = (itemValue, itemIndex) =>{
      console.log(itemValue, itemIndex-1, this.state.oldtype)
      this.setState({ type: itemValue, indextype : itemIndex-1 })
      setTimeout(()=>{
      },10)
    }
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);

      this.setState({realuser:account.Email+':'+account.Phone})
    }
    render() {
        return (
          <View style={{flex: 1,backgroundColor:'#151A20'}}>
            <View style={{flex:0.03}}/>
            <View style={{position:'absolute',width:'100%',height:'100%',flex:1.2}}>
              <View style={{flex:0.45}}>
                {(this.state.image!='')?<Image source={{ uri: this.state.image }} style={{ width: '100%', height: '100%' }}/>:null}
                <TouchableOpacity style={{position:'absolute',width:50,height:50,backgroundColor:'#2D2F30',borderRadius:100,bottom:15,right:15,justifyContent:'center',alignItems:'center',elevation:5}} onPress={this._pickImage}>
                  <Text style={{color:'white',fontSize:17,fontFamily:'kanitMedium'}}>แก้รูป</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:0.75,marginLeft:20,marginRight:20,justifyContent:'center'}}>
                <View style={{width:'100%',height:'85%',backgroundColor:'#2D2E2F',borderRadius:20}}>
                  <Text style={{color:'white',padding:15,fontSize:24,fontFamily:'kanitBold'}}>สินค้าของคุณ</Text>
                  <View style={{width:'100%',height:1,backgroundColor:'#6B6A6B'}}/>
                  <Text style={{color:'#7E7E7E',padding:15,paddingBottom:0,fontSize:17,fontFamily:'kanitSemiBold'}}>ชื่อสินค้า</Text>
                  <TextInput placeholderTextColor='#7E7E7E' placeholder='Your Product Name ...' maxLength={25} value={this.state.name} style={{color:'white',padding:15,paddingTop:0,fontSize:24,fontFamily:'kanitMedium'}} onChangeText={name=>this.setState({name})}/>
                  <Text style={{color:'#7E7E7E',padding:15,paddingTop:0,paddingBottom:0,fontSize:17,fontFamily:'kanitSemiBold'}}>ราคาสินค้า</Text>
                  <View style={{padding:15,paddingTop:0,flexDirection:'row'}}>
                    <Text style={{color:'white',fontSize:24,fontFamily:'kanitMedium'}}>฿ </Text>
                    <TextInput keyboardType = 'numeric' placeholderTextColor='#7E7E7E' placeholder='0' value={this.state.price} maxLength={5} style={{color:'white',fontSize:24,fontFamily:'kanitMedium'}}  onChangeText={price=>this.setState({price})}/>
                  </View>
                  <Text style={{color:'#7E7E7E',padding:15,paddingTop:0,paddingBottom:0,fontSize:17,fontFamily:'kanitSemiBold'}}>ชนิดสินค้า</Text>
                  <View style={{margin:15,marginTop:5,backgroundColor:'#595959',borderRadius:10,elevation:3}}>
                    <Picker selectedValue={this.state.type} itemStyle={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'100%',color:'white',fontFamily:'kanitMedium'}} style={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'100%',color:'white',fontFamily:'kanitMedium'}}
                    onValueChange={(itemValue, itemIndex) => this.onChangePicker(itemValue, itemIndex)}>
                      {this.state.picker}
                    </Picker>
                  </View>
                  <View style={{position:'absolute',width:'50%',height:'13%',backgroundColor:'#FF2D55',borderRadius:100,alignSelf:'center',bottom:-25,justifyContent:'center',alignItems:'center'}}>

                  </View>
                  <TouchableOpacity style={{position:'absolute',width:'50%',height:'13%',backgroundColor:'#FF2D55',borderRadius:100,alignSelf:'center',bottom:-25,justifyContent:'center',alignItems:'center'}} onPress={this.onPressCreateMenu}>
                    <Text style={{color:'white',fontSize:17,fontWeight:'bold'}}>ยืนยัน</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <BackTab
              iconBackSM = {true}
              txtBackSM = 'Back'
              btnBack = {this.onPressBack}
              borderBottom = {true}
            />
            <View style={{flex:0.02}}/>
          </View>
      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  picker: {
    width: 200,
    height:100,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 1,
  },
  pickerView:{
    height:400,
  },
  pickerItem: {
    color: 'red'
  },
  onePicker: {
    width: 200,
    height: 44,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 1,
  },
  onePickerItem: {
    height: 44,
    color: 'red'
  },
  twoPickers: {
    width: 200,
    height: 88,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 1,
  },
  twoPickerItems: {
    height: 88,
    color: 'red'
  },
});
