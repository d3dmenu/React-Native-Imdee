import React from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  Button, ImageEditor,Image,Alert,TouchableHighlight,ScrollView,FlatList,AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import BackTab from '../Option/BackTab.js'
import {Ionicons,FontAwesome,Foundation,AntDesign} from '@expo/vector-icons';
import database from '../Database/Database.js'

export default class MyOrderMerchantPage extends React.Component {
  constructor(props){
    super(props);
    this.onAsyncRead();
    this.state = {
      dataSource : [],
      realuser:'', lengthObj:0, dataObjShow:[], i:0, pushBtn:0
    }
  }
  onRe = ()=>{
    this.setState({pushBtn:0});
  }
  onCan = ()=>{
    this.setState({pushBtn:1});
  }
  onCom = ()=>{
    this.setState({pushBtn:2});
  }
  onPressLoadmore = () =>{
    var length = this.state.lengthObj-this.state.i;
    if(length>6){
      length = 6
    }
    const x = this.state.i;
    for(var i=x;i<length+x;i++){
      this.state.dataObjShow.splice(this.state.dataObjShow.length-1 ,0 ,this.state.dataSource[i]);
      this.setState({dataObjShow:this.state.dataObjShow});
    }
    setTimeout(()=>{
      this.setState({i:this.state.i+length})
      if(this.state.i>=this.state.lengthObj){
        this.state.dataObjShow.pop();
        this.setState({dataObjShow:this.state.dataObjShow});
      }
    },20)
  }
  onPressBack = () =>{
    this.props.navigation.navigate('HomeScreen');
  }
  onPressOrderSum = (items) =>{
    var data = {
      ID: items.ID,
      Mode: items.Mode,
      Order: items.Order,
      Path : 'Restaurant'
    }
    this.props.navigation.navigate('OrderSummaryScreen', {items:data});
  }
  readOrder_success = (obj) =>{
    this.setState({lengthObj:obj.length,dataSource:obj,dataObjShow:[]});
    if(obj.length<=6){
      this.setState({dataObjShow:obj});
    }
    else{
      this.setState({i:0});
      for(var i=0;i<6;i++){
        this.state.dataObjShow.push(obj[i]);
        this.setState({i:this.state.i+1, dataObjShow:this.state.dataObjShow});
      }
      var data = {
        ID : '',
        Notify : '',
        Mode : 'Loadmore'
      }
      this.state.dataObjShow.push(data);
      this.setState({dataObjShow:this.state.dataObjShow});
    }
  }
  onAsyncRead=async ()=>{
    var account = await AsyncStorage.getItem('account_IMDEE');
    account = JSON.parse(account);

    this.setState({realuser:account.Email+':'+account.Phone})
    database.readOrder(account.Email+':'+account.Phone, 'Restaurant', this.readOrder_success);
  }
  render() {
      return (
      <View style={{flex: 1,backgroundColor:'#151A20'}}>
        <View style={{flex:0.1,backgroundColor:'#151A20',alignItems:'center',justifyContent: 'center',flexDirection:'row',marginBottom:'3%',marginTop:20}}>
          <TouchableOpacity onPress={()=>this.onRe()} style={{backgroundColor: (this.state.pushBtn==0)?'#FF2D55':'#31343D',borderRadius:100,width:'30%',height:'100%',alignItems:"center",justifyContent:"center",}}>
            <Text style={{fontSize:15,color:'white',fontFamily:'kanitMedium'}}>รอการจัดส่ง</Text>
          </TouchableOpacity>
          <View style={{flex:0.2}}/>
          <TouchableOpacity onPress={()=>this.onCan()} style={{backgroundColor: (this.state.pushBtn==1)?'#FF2D55':'#31343D',borderRadius:100,width:'30%',height:'100%',alignItems:"center",justifyContent:"center",}}>

            <Text style={{fontSize:15,color:'white',fontFamily:'kanitMedium'}}>กำลังจัดส่ง</Text>

          </TouchableOpacity>
          <View style={{flex:0.2}}/>
          <TouchableOpacity onPress={()=>this.onCom()} style={{backgroundColor: (this.state.pushBtn==2)?'#FF2D55':'#31343D',borderRadius:100,width:'30%',height:'100%',alignItems:"center",justifyContent:"center"}}>
            <Text style={{fontSize:15,color:'white',fontFamily:'kanitMedium'}}>ส่งแล้ว</Text>
          </TouchableOpacity>
          <View style={{flex:0.2}}/>
        </View>

        <View style={{flex:1.2,marginLeft:15,marginRight:15}}>
          <View style={{width:'100%',flexDirection:'row'}}>
            <View style={{flex:0.5,justifyContent:'center',alignItems:'flex-start'}}>
              <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} onPress={this.onPressBack}>
                <Ionicons style={{marginLeft:5}} name={'ios-arrow-back'} size={20} color={'#DB3966'}/>
                <Text style={{marginLeft:5,fontSize:15,color:'#DB3966',fontFamily:'kanitRegular'}}>ตั้งค่า</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:0.5,justifyContent:'center',alignItems:'flex-end'}}>
              <Text style={{fontSize:15,color:'#ADADAD',fontFamily:'kanitRegular'}}>รายการคำสั่งซื้อ</Text>
            </View>
          </View>
          <View style={{flex:1}}>
            <FlatList
              data={this.state.dataObjShow}
              renderItem={({ item }) => (item.Mode=='Loadmore')
                                      ? <View style={{justifyContent:'center',alignItems:'center',margin:25}}>
                                          <TouchableOpacity style={{flexDirection:'row',padding:5,paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center',backgroundColor:'#31343D',borderRadius:100}} onPress={()=>this.onPressLoadmore()}>
                                            <Foundation style={{paddingRight:5,color:'#ADADAD'}} name={'refresh'} size={20}/>
                                            <Text style={{color:'#ADADAD',fontSize:15}}>Load more</Text>
                                          </TouchableOpacity>
                                        </View>
                                      : (item.Order.Status == this.state.pushBtn)
                                        ?<View style={{width:'100%',marginBottom:20,alignItems:'flex-start',backgroundColor:'#FF2D55',borderRadius:10}}>
                                          <TouchableOpacity style={styles.container} onPress={()=>this.onPressOrderSum(item)}>
                                            <View style={{alignItems:'flex-start',marginLeft:'5%',marginTop:'5%'}} >
                                              <Text style={styles.title}>{item.Order.NameRestaurant}</Text>
                                            </View>
                                            <View style={{flex:1,flexDirection: 'row',marginTop:'5%',marginBottom:'5%'}} >
                                              <View style={{flex:1,flexDirection: 'column',marginLeft:'5%'}} >
                                                <Text style={styles.description}>ชื่อผู้รับ</Text>
                                                <Text style={styles.description1}>{item.Order.NameUser}</Text>
                                              </View>
                                              <View style={{justifyContent: 'center',alignItems: 'center',width: '0.5%',height:'60%',borderColor:'#5C5D60',backgroundColor:'#5C5D60'}}/>
                                              <View style={{flex:0.1}}/>
                                              <View style={{flex:1,flexDirection: 'column'}}>
                                                <Text style={styles.description}>เวลาสั่งซื้อ</Text>
                                                <View style={{flex:1,flexDirection: 'row'}} >
                                                  <Text style={styles.description1}>{item.Order.Date}</Text>
                                                </View>
                                              </View>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                        :null
                          }
              style={{marginTop:10}}
            />
          </View>
        </View>
        <View style={{flex:0.02}}/>

      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#151A20',
        borderRadius:10,
        width: '100%',
        borderColor:'#ADADAD',
        borderWidth:1,
    },
    title: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight:'bold',
        fontFamily:'kanitSemiBold'
    },
    description: {
        fontSize: 13,
        color: '#5C5D60',
        marginBottom:'3%',
        fontFamily:'kanitRegular'
    },
    description1: {
        fontSize: 13,
        color: '#EEEEEE',
        fontFamily:'kanitRegular'
    },
});
