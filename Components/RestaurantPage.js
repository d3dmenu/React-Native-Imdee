import React from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import { StyleSheet, Text, TextInput,  TouchableOpacity, View,
         Image, AppRegistry, SafeAreaView, FlatList, AsyncStorage
} from 'react-native';
import { Ionicons,Entypo } from '@expo/vector-icons'
import { Avatar, Card } from 'react-native-elements'
import * as Font from 'expo-font';
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js';

export default class RestaurantPage extends React.Component{

  constructor(props){
    super(props);
    var items = this.props.navigation.getParam('items','No-name');
    this.onAsyncRead(items);
    var phone = '';
    if(items.Phone.length == 9){
      phone = items.Phone.substring(0,2)+'-'+items.Phone.substring(2,5)+'-'+items.Phone.substring(5,9);
    }
    else if(items.Phone.length == 10){
      if(items.Phone[1] == '2'){
        phone = items.Phone.substring(0,2)+'-'+items.Phone.substring(2,5)+'-'+items.Phone.substring(5,9)+'-'+items.Phone.substring(9,10);
      }
      else{
        phone = items.Phone.substring(0,3)+'-'+items.Phone.substring(3,6)+'-'+items.Phone.substring(6,10);
      }
    }
    this.state = {
      name:items.Name,
      information:items.Information,
      phone:phone,
      image:items.Logo+items.Token,
      items:items,
      notify_stat : false,
      notify_num : 0,
      backGround_push: '#E6285D',
      backGround_not: '#494949',
      pushBtn: 0,
      types : [],
      menus : [],
      typesSolo : [],
      realuser:'',
    }
    database.readMyMenu(items.ID, this.readMyMenu_success);
    database.readMyType(items.ID, this.readMyType_success);
  }

  onPressBack = () =>{
    this.props.navigation.goBack();
  }
  onPressCart = () =>{
    this.props.navigation.navigate('AllCartScreen')
  }
  onPressChat = () =>{
    var obj = {
      restaurant : {
        Name : this.state.items.Name
      },
      Logo : this.state.items.Logo+this.state.items.Token,
      id : this.state.items.ID
    }
    this.props.navigation.navigate('ChatScreen', {items:obj});
  }
  _onPressButton(key){
    this.setState({pushBtn:key});
  }
  readMyMenu_success = (menus) =>{
    this.setState({menus:menus});
  }
  readMyType_success = (types) =>{
    this.setState({types:types});
    this.setState({typesSolo:[]})
    for(var i=0;i<types.length-1;i++){
      this.state.typesSolo.push(types[i].type.Name);
    }
    this.setState({pushBtn: 0})
  }
  chooseMenu = (menu,restaurant) =>{
    database.addCart(this.state.realuser,restaurant,menu,this.addCart_success)
  }
  addCart_success = () =>{
    this.setState({notify_num:this.state.notify_num+1});
    if(this.state.notify_num>=100)
      this.setState({notify_num:100});
  }
  readNumMenu_success = (count) =>{
    this.setState({notify_num:count+this.state.notify_num});
    if(this.state.notify_num>=100)
      this.setState({notify_num:100});
  }
  onAsyncRead=async (items)=>{
    var account = await AsyncStorage.getItem('account_IMDEE');
    account = JSON.parse(account);

    this.setState({realuser:account.Email+':'+account.Phone})
    database.readNumCart((account.Email+':'+account.Phone), this.readNumMenu_success)
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

  _renderItem(item){
      return(
        (item.id!='Add Type')
        ? (item.type.Value > 0)
          ? <TouchableOpacity style={{flex:1, width:150, borderRadius: 15, height:85}} onPress={() => this._onPressButton(this.state.typesSolo.indexOf(item.type.Name))}>
              <Card
                  containerStyle={this.state.pushBtn === this.state.typesSolo.indexOf(item.type.Name) ? {
                    width:135,
                    backgroundColor: this.state.backGround_push,
                    marginLeft:15,
                    borderRadius: 15,
                    alignItems:'flex-start',
                    borderColor:'transparent',
                  } : {
                    width:135,
                    backgroundColor: this.state.backGround_not,
                    marginLeft:15,
                    borderRadius: 15,
                    alignItems:'flex-start',
                    borderColor:'transparent',
                  }}>
                  <Text style={{color:'white', fontSize: 24, marginLeft:'10%',fontFamily:'kanitSemiBold'}}>{item.type.Value}</Text>
                  <Text style={{color:'white', fontSize: 14, marginLeft:'10%',fontFamily:'kanitSemiBold'}}>{item.type.Name}</Text>
              </Card>
            </TouchableOpacity>
          : null
        : null

      )
  } // FlatList Menu

  _renderMenu(item){
    return(
      (item.id!='Add Menu')
      ? (item.menu.Type==this.state.typesSolo[this.state.pushBtn] || this.state.pushBtn==0)
        ? <View style={{flex:0.8}}>
              <View style={{flex:1, backgroundColor:'#2F343A', borderRadius:10, marginLeft:15, marginRight:15, width:280}}>
                  <Image style={{flex:3.2,width:280, borderRadius:10}}
                        source={{uri: item.image}}/>
                  <Text style={{color:'white', fontSize: 18,  marginLeft:'5.5%' , marginRight:'1.5%', marginTop:10, alignItems: 'center',fontFamily:'kanitSemiBold'}}>{item.menu.Name}</Text>
                  <Text style={{color:'#8A8A8F', fontSize: 13,  marginLeft:'5.5%', marginRight:'1.5%', marginTop:8, alignItems: 'center',fontFamily:'kanitRegular'}}>{item.menu.Type}</Text>

                  <View  style={{borderBottomColor: '#6B6A6B',borderBottomWidth: 1,width: 250,alignSelf:'center',margin:10}} />

                  <View style={{flexDirection:'row',  marginLeft:'3%'}}>
                      <Text style={{flex:0.65, color:'white', fontSize: 36,  margin:'3%', alignItems:'center', marginTop:'5%',fontFamily:'kanitBold'}}>฿ {item.menu.Price}</Text>
                      <TouchableOpacity style={{flex:0.28, backgroundColor:'#E6285D', borderRadius:20, height:30, marginTop:'8%'}} onPress={()=>this.chooseMenu(item,this.state.items)}>
                          <View style={{flex:0.65, flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                              <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                                  <Entypo name="plus" size={20} color='white'/>
                              </View>
                              <Text style={{color:'white', fontSize:15, margin:4, fontFamily:'kanitMedium'}}>เพิ่ม</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
        :null
      : null
    )
  } // FlatList Image Menu

  render(){
    return (
      <View style={{flex:1, backgroundColor:'#151A20', flexDirection:'column'}}>
      {/* background View */}

          <View style={{flex:0.03}}/>
          {/* Top View of screen */}
          <BackTab
            iconBackSM = {true}
            txtBackSM = 'ร้านอาหาร'
            btnBack = {this.onPressBack}
          />
          <View style={{flex:1.2, backgroundColor:'#151A20',marginLeft:15,marginRight:15}}>
          {/* body all part of app */}
{/* ===================================================================================================================================================== */}

              <View style={{flex:0.1, flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
              {/* first box [ Describe shop and show shop's icon ]*/}
                  <View style={{flex:0.7,flexDirection:'row', alignItems:'center',marginTop:10,marginLeft:10}}>
                    <View style={{alignItems:'center', alignSelf:'flex-start',marginLeft:40}}>
                        <View style={{backgroundColor:'#C4C4C4', borderRadius:70, height:70, width:70 , position:'absolute',}}>
                            <View style={{backgroundColor:'#E6285D', borderRadius:65, height:65, idth:65 , margin:'3%'}}>
                            {(this.state.image!='')
                              ? <Image source={{ uri: this.state.image }} style={{ width: '100%', height:'100%', borderRadius:100}}></Image>
                              : null
                            }
                            </View>
                        </View>
                    </View>
                    <View style={{flex:1.6, marginLeft:15, justifyContent:'flex-start',marginLeft:45, marginTop:10}}>
                    {/* View of Text for Describe this shop */}
                        <Text style={{color:'white', fontSize:17}}>{this.state.name}</Text>
                        <Text style={{color:'white', fontSize:13}}>{this.changeLengthMessage(this.state.information)}</Text>
                        <View style={{flexDirection:'row'}}>
                        {/* View of phone icon on describe view */}
                          <Avatar
                                rounded
                                size={15}
                                icon={{name: 'phone', color: 'white'}}
                                overlayContainerStyle={{backgroundColor: '#4CD964'}}
                                containerStyle={{ marginRight:'2%', alignSelf:'center'}}
                          />
                          <Text style={{margin:3,color:'white', fontSize:13}}>{this.state.phone}</Text>

                        </View>
                    </View>
                  </View>

                  <View style={{flex:0.3, justifyContent:'flex-end', flexDirection:'row'}}>
                  {/* Cart Icon View */}
                        <TouchableOpacity style={{marginLeft:'4%'}} onPress={this.onPressCart}>
                            <Avatar
                                  rounded
                                  size={35}
                                  icon={{name:"shopping-cart"}}
                                  color='white'
                            />
                            <View style={{position:'absolute', marginTop:25, alignSelf:'flex-start'}}>
                            {/* Red Notification on cart icon */}
                            {/* This Part to hide or show red notification and number */}
                                {(this.state.notify_num > 0) ? (
                                    <Avatar
                                          rounded
                                          size={20}
                                          overlayContainerStyle={{backgroundColor: '#FF366E'}}
                                          containerStyle={{alignSelf:'flex-start', marginRight:5}}
                                          title={(this.state.notify_num>99)?(String(this.state.notify_num-1)+'+'):String(this.state.notify_num)}
                                    />
                                ): null}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{marginRight:15,marginLeft:10}} onPress={this.onPressChat}>
                            <Avatar
                                  rounded
                                  size={35}
                                  icon={{name:"chat"}}
                                  color='white'
                                  overlayContainerStyle={{backgroundColor: '#E6285D'}}
                            />
                        </TouchableOpacity>

                  </View>

              </View>

{/* ===================================================================================================================================================== */}

              <View style={{flex:0.16, flexDirection:'row'}}>
              {/* second box [ Flat List for choose type of food from this shop ]*/}
                <FlatList
                  horizontal={true}
                  data={this.state.types}
                  renderItem={(item) => this._renderItem(item.item)}
                />
              </View>

{/* ===================================================================================================================================================== */}

              <View style={{flex:0.79, backgroundColor:'#151A20'}}>
              {/* FlatList View [ show all food / chosen type of food from this shop]*/}
              <FlatList
                horizontal={true}
                data={this.state.menus}
                renderItem={(item) => this._renderMenu(item.item)}
              />
              </View>
          </View>

{/* ===================================================================================================================================================== */}
          <View style={{flex: 0.02}}/>
      </View>
    );
  }
}
