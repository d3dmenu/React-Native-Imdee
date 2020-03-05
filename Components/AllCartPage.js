import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage } from 'react-native';
import BackTab from '../Option/BackTab.js'
import {Ionicons,MaterialIcons,FontAwesome} from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements'
import Modal from 'react-native-modal';
import database from '../Database/Database.js';

export default class AllCartPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead()
      this.state = {
        realuser:'',
        dataSource : [],
        restaurantDel: '',
        index : -1,
        isModalVisible : false,
      }
    }
    onPressBack = () =>{
      this.props.navigation.navigate('HomeScreen');
    }
    onPressRestaurant = (item) =>{
      console.log(item)
      var items = {
        Address : item.dataRestaurant.Address,
        ID : item.idRestaurant,
        Information : item.dataRestaurant.Information,
        Logo : item.dataRestaurant.image,
        Name : item.dataRestaurant.Name,
        Phone : item.dataRestaurant.Phone,
        Token : item.token,
        mode : "restaurant"
      }
      this.props.navigation.navigate('RestaurantScreen' ,{items:items});
    }
    _showModal = (restaurantDel,index) => {
      this.setState({ isModalVisible: true, restaurantDel:restaurantDel, index:index});
    }
    _hideModal = () => {
      this.setState({ isModalVisible: false, restaurantDel:'', index:-1});
    }
    onPressCheckOut = (items) =>{
      if(items.totalPrice==0){
        Alert.alert('กรุณาเลือกสินค้าเพื่อสั่งซื้อ')
      }
      else{
        var numCart = 0;
        for(var i=0;i<this.state.dataSource.length;i++){
          for(var j=0;j<this.state.dataSource[i].allMenu.length;j++){
            numCart += this.state.dataSource[i].allMenu[j].dataMenu.Value;
          }
        }
        var objAll = {
          realuser : this.state.realuser,
          order : items,
          numCart : numCart
        }
        this.props.navigation.navigate('MyCartScreen' ,{objAll:objAll});
      }
    }
    onPressCheckBox = (item,x) =>{
      if(item.allMenu[x].dataMenu.State == false)
        item.allMenu[x].dataMenu.State = true;
      else
        item.allMenu[x].dataMenu.State = false;
      database.updateCart(this.state.realuser, item, x, this.onChangeTotalPrice)
    }
    deleteCart = () =>{
      database.deleteCart(this.state.realuser, this.state.restaurantDel, this.deleteCart_success);
    }
    deleteCart_success = () =>{
      var numCart = 0;
      this.state.dataSource.splice(this.state.index, 1);
      this.setState({dataSource:this.state.dataSource});
      for(var i=0;i<this.state.dataSource.length;i++){
        for(var j=0;j<this.state.dataSource[i].allMenu.length;j++){
          numCart += this.state.dataSource[i].allMenu[j].dataMenu.Value;
        }
      }
      console.log(numCart)
      database.updateNumCart(this.state.realuser, numCart)
      Alert.alert('ลบตะกร้าสินค้านี้สำเร็จ')
      this._hideModal();
      this.props.navigation.navigate('HomeScreen');
    }
    readCart_success = (cart) =>{
      this.setState({dataSource:cart})
    }
    onAsyncRead=async (items)=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      var myCart = await AsyncStorage.getItem('myCart_IMDEE');
      account = JSON.parse(account);
      myCart = JSON.parse(myCart);
      console.log(myCart)
      this.setState({realuser:account.Email+':'+account.Phone, dataSource:myCart})
    }
    onChangeTotalPrice = async (item) =>{
      var total = 0, numCart = 0;
      for(var i=0;i<item.allMenu.length;i++){
        if(item.allMenu[i].dataMenu.State==true)
          total += item.allMenu[i].dataMenu.Price * item.allMenu[i].dataMenu.Value;
      }
      item.totalPrice = total;
      this.setState({dataSource:this.state.dataSource});
      await AsyncStorage.setItem("myCart_IMDEE", JSON.stringify(this.state.dataSource));
      for(var i=0;i<this.state.dataSource.length;i++){
        for(var j=0;j<this.state.dataSource[i].allMenu.length;j++){
          numCart += this.state.dataSource[i].allMenu[j].dataMenu.Value;
        }
      }
      database.updateNumCart(this.state.realuser, numCart)
    }
    onPlusValue = (item,x) =>{
      if(item.allMenu[x].dataMenu.Value<999){
        item.allMenu[x].dataMenu.Value = item.allMenu[x].dataMenu.Value+1;
        database.updateCart(this.state.realuser, item, x, this.onChangeTotalPrice)
      }
    }
    onMinuteValue = (item,x) =>{
      if(item.allMenu[x].dataMenu.Value>1){
        item.allMenu[x].dataMenu.Value = item.allMenu[x].dataMenu.Value-1;
        database.updateCart(this.state.realuser, item, x, this.onChangeTotalPrice)
      }
    }
    onChangeValue = (value,item,x) =>{
      if(Number(value)==0){
        value = 1;
      }
      item.allMenu[x].dataMenu.Value = Number(value);
      database.updateCart(this.state.realuser, item, x, this.onChangeTotalPrice)
    }
    addMenu = (item,index) =>{
      var lengthMenu = item.allMenu.length;
      var heightMenu = 100;
      var Menu = [];
      for(var i=0;i<lengthMenu;i++){
        const x = i;
        Menu.push(<View style={{width:'100%',height:100,flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity style={{width:20,height:20,margin:15,borderRadius:2,borderWidth:1,borderColor:'#BDBDBD',backgroundColor:(item.allMenu[x].dataMenu.State)?'#FF2D55':'transparent'}} onPress={()=>this.onPressCheckBox(item,x)}/>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Image source={{ uri: item.allMenu[x].image+item.allMenu[x].token }} style={{ width: 60, height: 70, borderRadius:10 }}/>
                    </View>
                    <View style={{width:'80%',paddingLeft:15,paddingRight:15,justifyContent:'center'}}>
                      <Text style={{color:'#F8F8F8',fontSize:18,fontFamily:'kanitSemiBold'}}>{item.allMenu[x].dataMenu.Name}</Text>
                      <Text style={{color:'#8A8A8F',fontSize:13,fontFamily:'kanitRegular'}}>{item.allMenu[x].dataMenu.Type}</Text>
                      <View style={{flex:0.5,flexDirection:'row'}}>
                        <View style={{flex:0.35,justifyContent:'center'}}>
                          <Text style={{color:'#F8F8F8',fontSize:18,fontFamily:'kanitBold'}}>฿ {item.allMenu[x].dataMenu.Price}</Text>
                        </View>
                        <View style={{flex:0.65,justifyContent:'center',alignItems:'center'}}>
                          <View style={{width:90,height:35,flexDirection:'row',borderRadius:100,justifyContent:'center',alignItems:'center',backgroundColor:'#4A4C52'}}>
                            <View style={{justifyContent:'flex-start',flex:0.5}}><TouchableOpacity style={{alignItems:'center',justifyContent:'center',marginLeft:10}} onPress={()=>this.onMinuteValue(item,x)}><Text style={{color:'white',fontSize:30,fontFamily:'kanitMedium'}}>-</Text></TouchableOpacity></View>
                            <View style={{justifyContent:'center',alignItems:'center',flex:1}}><TextInput placeholder='0' style={{width:'100%',textAlign:'center',color:'white',fontSize:15,fontFamily:'kanitMedium'}} value={String(item.allMenu[x].dataMenu.Value)} onChangeText={(value)=>this.onChangeValue(value,item,x)} keyboardType='numeric' maxLength={3}/></View>
                            <View style={{justifyContent:'flex-end',flex:0.5}}><TouchableOpacity style={{alignItems:'center',justifyContent:'center',marginRight:10}} onPress={()=>this.onPlusValue(item,x)}><Text style={{color:'white',fontSize:30,fontFamily:'kanitMedium'}}>+</Text></TouchableOpacity></View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>);
      }
      return(
        <View style={{width:'100%',height:100+(lengthMenu*heightMenu),backgroundColor:'#31343D',borderRadius:10,marginBottom:20}}>
          <View style={{flexDirection:'row',width:'100%',height:50,elevation:5,backgroundColor:'#4A4C52',borderTopStartRadius:10,borderTopEndRadius:10,}}>
            <View style={{flex:0.5,flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginLeft:10}}>
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}} onPress={()=>this.onPressRestaurant(item)}>
                <Image source={{ uri: item.Logo+item.token }} style={{ width: 30, height: 30, borderRadius:100 }}/>
                <Text style={{color:'#D0D0D0',fontSize:17,fontFamily:'kanitSemiBold',marginLeft:10}}>{item.dataRestaurant.Name}</Text>
                 <MaterialIcons style={{color:'#D1D1D6'}} name={'navigate-next'} size={25}/>
              </TouchableOpacity>
            </View>
            <View style={{flex:0.5,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
              <TouchableOpacity onPress={()=>this._showModal(item.idRestaurant,index)}><Text style={{color:'#D0D0D0',fontSize:17,fontFamily:'kanitBold',marginRight:10}}>X</Text></TouchableOpacity>
            </View>
          </View>
          {Menu}
          <View style={{width:'100%',height:50,flexDirection:'row',borderTopWidth:1,borderTopColor:'#6B6A6B',marginLeft:10,marginRight:10}}>
            <View style={{flex:0.65,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
              <Text style={{color:'#8A8A8F',fontSize:18,fontFamily:'kanitSemiBold'}}>ราคารวม: </Text>
              <Text style={{color:'white',fontSize:18,fontFamily:'kanitSemiBold'}}>฿ {item.totalPrice}</Text>
            </View>
            <TouchableOpacity style={{flex:0.3,marginTop:10,marginBottom:10,backgroundColor:'#FF2D55',borderRadius:100,flexDirection:'row',alignItems:'center',justifyContent:'center'}} onPress={()=>this.onPressCheckOut(item)}>
              {/*<Ionicons style={{color:'white'}} name={'ios-card'} size={20}/>*/}
              <Text style={{color:'white',fontSize:15,paddingLeft:5,fontFamily:'kanitRegular'}}>ตรวจสอบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = 'ตะกร้าสินค้าของคุณ'
              btnBack = {this.onPressBack}
            />
            <View style={{flex:0.94,marginLeft:15,marginRight:15}}>
              <FlatList
                data = {this.state.dataSource}
                style = {{marginTop:10}}
                renderItem = {({item,index}) =>
                  this.addMenu(item,index)
                }
              />
            </View>
            <View style={{flex:0.02}}/>

            <View style={{marginTop: 22,position:'absolute' }}>
              <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: 'transparent',alignItems:'center'}}>
                <TouchableOpacity style={{flex:1,width:'100%',backgroundColor:'transparent',justifyContent:'center'}} onPress={this._hideModal}>
                </TouchableOpacity>
                <View style={{ height:150,width:'80%',backgroundColor:'#31343D',borderRadius:10,position:'absolute',alignItems:'center' }}>
                  <Text style={{color:'white',fontSize:20,fontFamily:'kanitBold',padding:10,paddingTop:30}}>คุณต้องการที่จะลบมันใช่ไหม</Text>
                  <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={()=>this.deleteCart()}>
                      <Text style={{color:'#2BF658',fontSize:30,fontFamily:'kanitMedium'}}>ตกลง</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={this._hideModal}>
                      <Text style={{color:'#FF2D55',fontSize:30,fontFamily:'kanitMedium'}}>ยกเลิก</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20'
  },
});
