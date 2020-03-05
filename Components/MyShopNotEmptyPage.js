import React from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import { StyleSheet, Text, TextInput,  TouchableOpacity, View,
         Image, AppRegistry, SafeAreaView, FlatList, Alert
} from 'react-native';
import { Ionicons,FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons'
import { Avatar, Card } from 'react-native-elements'
import * as Font from 'expo-font';
import Modal from 'react-native-modal';
import database from '../Database/Database.js';

export default class MyShopNotEmptyPage extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      backGround_push: '#E6285D',
      backGround_not: '#494949',
      pushBtn: 0,
      isModalVisible:false,
      isModalVisible2:false,
      newType:'',
      lengthnewType:0,
      realuser:'',
      types : [],
      menus : [],
      typesSolo : [],
      i:0,

      element1 : null,
      element2 : null,
      element3 : null,
      mode : null
    }
  }

  _onPressButton(key){
    this.setState({pushBtn:key});
  }
  _showModal = () => {
    if(this.state.types.length < 12){
      this.setState({ isModalVisible: true });
    }
    else{
      Alert.alert('ชนิดของคุณเต็มแล้ว');
    }
  }
  _hideModal = () => {
    this.setState({ isModalVisible: false,newType:'',lengthnewType:0 })
  }

  _showModal2 = (mode, item1, item2, item3) => {
    this.setState({ isModalVisible2: true, element1:item1, element2:item2, element3:item3, mode:mode});
  }
  _hideModal2 = () => {
    this.setState({ isModalVisible2: false, element1:null, element2:null, element3:null, mode:null })
  }
  onChangeText = (text) =>{
    this.setState({newType:text,lengthnewType:text.length});
  }
  onPressAddType = () => {
    if(this.state.newType.length >= 2){
      var obj = {
        ID : this.state.types[this.state.types.length-1].type.Add,
        Name : this.state.newType,
        Value : 0,
      }
      database.addType(obj, this.state.realuser, this.addType_success);
    }
    else{
      Alert.alert('ชื่อชนิดสั้นเกินไป');
    }
  }
  onPressDeleteMenu = (item,types,typesSolo) =>{
    var type = types[typesSolo.indexOf(item.menu.Type)];
    database.deleteMenu(item, this.state.realuser, type, 1, this.delete_success);
  }
  onPressDeleteType = (item) =>{
    database.deleteType(item, this.state.realuser, this.state.menus, this.delete_success);
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
  addType_success = () =>{
    Alert.alert('เพิ่มชนิดสำเร็จแล้ว')
    this._hideModal();
  }
  delete_success = (state) =>{
    if(state==1)
      Alert.alert('ลบชนิดสำเร็จ')
    if(state==2)
      Alert.alert('ลบเมนูสำเร็จ')
    this._hideModal2();
  }
  _renderItem(item,index){
      return(
      (item.id!='Add Type')
      ? <View style={{flex:1, width:150, borderRadius: 15, height:85}}>
          <TouchableOpacity style={{flex:1, width:150, borderRadius: 15, height:85}} onPress={() => this._onPressButton(this.state.typesSolo.indexOf(item.type.Name))}>
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
          {(item.id!='')
            ? <TouchableOpacity style={{position:'absolute',backgroundColor:this.state.pushBtn === this.state.typesSolo.indexOf(item.type.Name)?'#494949':'#E6285D', borderRadius:100, width:25, height:25, right:'8%', top:'30%'}}  onPress={()=>this._showModal2('TYPE',item)}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <MaterialCommunityIcons name="close" size={15} color='white'/>
              </View>
            </TouchableOpacity>
            : null
          }
        </View>
      : <TouchableOpacity style={{flex:1, width:150, borderRadius: 15, height:85}} onPress={this._showModal}>
          <Card
              containerStyle={{
                width:135,
                height:85,
                backgroundColor: this.state.backGround_not,
                marginLeft:15,
                borderRadius: 15,
                alignItems:'center',
                justifyContent:'center',
                borderColor:'transparent',
              }}>
            <Ionicons name="ios-add-circle-outline" size={30} color='#8A8A8F'/>
          </Card>
        </TouchableOpacity>
      )
  } // FlatList Menu

  _renderMenu(item,btnCreateMenu){
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
                    <Text style={{flex:0.65,color:'white', fontSize: 36,  margin:'3%', alignItems:'center', marginTop:'5%',fontFamily:'kanitBold'}}>฿ {item.menu.Price}</Text>
                    <TouchableOpacity style={{flex:0.28, backgroundColor:'#E6285D', borderRadius:20, height:30, marginTop:'8%'}} onPress={()=>this._showModal2('MENU',item,this.state.types,this.state.typesSolo)}>
                        <View style={{flex:0.65, flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'white', fontSize:15, margin:4, fontFamily:'kanitMedium'}}>ลบเมนู</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      :null
    : <View style={{flex:0.8}}>
          <TouchableOpacity style={{flex:1, backgroundColor:'#2F343A', borderRadius:10, marginLeft:15, marginRight:15, width:280,alignItems:'center',justifyContent:'center'}} onPress={()=>btnCreateMenu(item,this.state.types,this.state.menus,this.state.typesSolo)}>
              <Ionicons name="ios-add-circle-outline" size={120} color='#8A8A8F'/>
          </TouchableOpacity>
      </View>
    )
  } // FlatList Image Menu

  render(){
    const {btnCreateMenu, realuser} = this.props;
    if(this.state.i==0){
        this.setState({realuser:realuser});
        console.log(realuser)
        database.readMyMenu(realuser, this.readMyMenu_success);
        database.readMyType(realuser, this.readMyType_success);
        this.setState({i:1});
    }
    return (
      <View style={{flex:0.94, backgroundColor:'#151A20', flexDirection:'column'}}>
      {/* background View */}


          <View style={{flex:1, backgroundColor:'#151A20',marginLeft:15,marginRight:15}}>
          {/* body all part of app */}
{/* ===================================================================================================================================================== */}


              <View style={{flex:0.2, flexDirection:'row'}}>
              {/* second box [ Flat List for choose type of food from this shop ]*/}
                <FlatList
                  horizontal={true}
                  data={this.state.types}
                  renderItem={(item) => this._renderItem(item.item)}
                />
              </View>

{/* ===================================================================================================================================================== */}

              <View style={{flex:0.8, backgroundColor:'#151A20'}}>
              {/* FlatList View [ show all food / chosen type of food from this shop]*/}
                <FlatList
                  horizontal={true}
                  data={this.state.menus}
                  renderItem={(item) => this._renderMenu(item.item,btnCreateMenu)}
                />
              </View>
          </View>

{/* ===================================================================================================================================================== */}

          <View style={{marginTop: 22,position:'absolute' }}>
            <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: 'transparent',alignItems:'center'}}>
              <TouchableOpacity style={{flex:1,width:'100%',backgroundColor:'transparent',justifyContent:'center'}} onPress={this._hideModal}>
              </TouchableOpacity>
              <View style={{ height:120,width:'60%',backgroundColor:'#31343D',borderRadius:10,position:'absolute' }}>
                <View style={{width:'100%',flexDirection:'row'}}>
                  <View style={{flex:0.5,alignItems:'flex-start'}}>
                    <Text style={{padding:10,color:'#D0D0D0',fontSize:20,fontFamily:'kanitBold'}}>ชนิดใหม่</Text>
                  </View>
                  <View style={{flex:0.5,alignItems:'flex-end',justifyContent:'flex-end'}}>
                    <Text style={{padding:10,color:'#D0D0D0',fontSize:12,fontFamily:'kanitRegular'}}>{this.state.lengthnewType} / 15</Text>
                  </View>
                </View>
                <View style={{width:'95%',height:0.5,backgroundColor:'#6B6A6B',alignSelf:'center'}}/>
                <TextInput placeholderTextColor='#868686' placeholder='ชนิดของคุณ ...' maxLength={15} multiline={true} style={{padding:10,fontFamily:'kanitRegular'}} onChangeText={(text)=>this.onChangeText(text)}><Text style={{color:'#868686',fontSize:14}}>{this.state.newType}</Text></TextInput>
                  <TouchableOpacity style={{position:'absolute',bottom:0,right:0}} onPress={this.onPressAddType}>
                    <Text style={{padding:10,alignSelf:'flex-end',color:'#FF2D55',fontSize:16,fontFamily:'kanitMedium'}}>เพิ่ม</Text>
                  </TouchableOpacity>
              </View>
            </Modal>
          </View>

          <View style={{marginTop: 22,position:'absolute' }}>
            <Modal isVisible={this.state.isModalVisible2} style={{backgroundColor: 'transparent',alignItems:'center'}}>
              <TouchableOpacity style={{flex:1,width:'100%',backgroundColor:'transparent',justifyContent:'center'}} onPress={this._hideModal2}>
              </TouchableOpacity>
              <View style={{ height:140,width:'80%',backgroundColor:'#31343D',borderRadius:20,position:'absolute',alignItems:'center' }}>
                <Text style={{color:'white',fontSize:23,fontFamily:'kanitBold',padding:10,paddingTop:30}}>คุณต้องการลบมันใช่มั้ย</Text>
                <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={()=>{(this.state.mode=='TYPE')?this.onPressDeleteType(this.state.element1):this.onPressDeleteMenu(this.state.element1,this.state.element2,this.state.element3)}}>
                    <Text style={{color:'#2BF658',fontSize:30,fontFamily:'kanitMedium'}}>ตกลง</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={this._hideModal2}>
                    <Text style={{color:'#FF2D55',fontSize:30,fontFamily:'kanitMedium'}}>ยกเลิก</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
      </View>
    );
  }
}
