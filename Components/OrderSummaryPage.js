import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, Dimensions } from 'react-native';
import BackTab from '../Option/BackTab.js'
import {MaterialIcons} from '@expo/vector-icons';

export default class OrderSummaryPage extends React.Component{
    constructor(props){
      super(props);
      var items = this.props.navigation.getParam('items','No-Items')
      console.log(items)
      this.state = {
        height : Dimensions.get('window').height*(7.5/100),

        items:items
      }
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    onPressStatus = () =>{
      this.props.navigation.navigate('StatusScreen' ,{items:this.state.items});
    }
    render() {
        return (
          <View style={styles.container}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = 'Order Summary'
              btnBack = {this.onPressBack}
            />
            <View style={{flex:0.94,marginLeft:25,marginRight:25}}>
              <View style={{flex:0.65}}>
                <View style={{position:'absolute',bottom:(this.state.height-7.5)*5,left:(this.state.height-7.5)/2,width:this.state.height/8,height:this.state.height,backgroundColor:(this.state.items.Order.Process[1]==1)?'#6E283F':'#30353C'}}/>
                <View style={{position:'absolute',bottom:(this.state.height-7.5)*3,left:(this.state.height-7.5)/2,width:this.state.height/8,height:this.state.height,backgroundColor:(this.state.items.Order.Process[2]==1)?'#6E283F':'#30353C'}}/>
                <View style={{position:'absolute',bottom:(this.state.height-7.5)*1,left:(this.state.height-7.5)/2,width:this.state.height/8,height:this.state.height,backgroundColor:(this.state.items.Order.Process[3]==1)?'#6E283F':'#30353C'}}/>

                <View style={{position:'absolute',bottom:(this.state.height-7.5)*6,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                  <View style={{height:this.state.height,width:this.state.height,justifyContent:'center',alignItems:'center',backgroundColor:(this.state.items.Order.Process[0]==1)?'#6E283F':'#30353C',borderRadius:100}}>
                    <View style={{height:this.state.height/2,width:this.state.height/2,backgroundColor:(this.state.items.Order.Process[0]==1)?'#DB3966':'#757575',borderRadius:100}}/>
                  </View>
                  <Text style={{color:'#C7C7C7',fontSize:16,fontWeight:'bold',marginLeft:20}}>Order price on 26 January</Text>
                </View>
                <View style={{position:'absolute',bottom:(this.state.height-7.5)*4,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                  <View style={{height:this.state.height,width:this.state.height,justifyContent:'center',alignItems:'center',backgroundColor:(this.state.items.Order.Process[1]==1)?'#6E283F':'#30353C',borderRadius:100}}>
                    <View style={{height:this.state.height/2,width:this.state.height/2,backgroundColor:(this.state.items.Order.Process[1]==1)?'#DB3966':'#757575',borderRadius:100}}/>
                  </View>
                  <Text style={{color:'#C7C7C7',fontSize:16,fontWeight:'bold',marginLeft:20}}>Order Accepted on 26 January</Text>
                </View>
                <View style={{position:'absolute',bottom:(this.state.height-7.5)*2,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                  <View style={{height:this.state.height,width:this.state.height,justifyContent:'center',alignItems:'center',backgroundColor:(this.state.items.Order.Process[2]==1)?'#6E283F':'#30353C',borderRadius:100}}>
                    <View style={{height:this.state.height/2,width:this.state.height/2,backgroundColor:(this.state.items.Order.Process[2]==1)?'#DB3966':'#757575',borderRadius:100}}/>
                  </View>
                  <Text style={{color:'#C7C7C7',fontSize:16,fontWeight:'bold',marginLeft:20}}>Processing order</Text>
                </View>
                <View style={{position:'absolute',bottom:(this.state.height-7.5)*0,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                  <View style={{height:this.state.height,width:this.state.height,justifyContent:'center',alignItems:'center',backgroundColor:(this.state.items.Order.Process[3]==1)?'#6E283F':'#30353C',borderRadius:100}}>
                    <View style={{height:this.state.height/2,width:this.state.height/2,backgroundColor:(this.state.items.Order.Process[3]==1)?'#DB3966':'#757575',borderRadius:100}}/>
                  </View>
                  <Text style={{color:'#C7C7C7',fontSize:16,fontWeight:'bold',marginLeft:20}}>Complete</Text>
                </View>
              </View>
              <TouchableOpacity style={{flex:0.35,marginTop:30,marginBottom:20,borderRadius:10,borderWidth:1,borderColor:'#30353C'}} onPress={this.onPressStatus}>
                <View style={{flex:1,margin:15,flexDirection:'row'}}>
                  <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{color:'#737373',padding:10,fontSize:16,fontFamily:'kanitSemiBold'}}>ชื่อร้าน</Text></View>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{color:'white',padding:10,fontSize:22,fontFamily:'kanitBold'}}>{this.state.items.Order.NameRestaurant}</Text></View>
                  </View>
                  <View style={{flex:0.2,alignItems:'flex-end',justifyContent:'center'}}>
                    <View style={{flex:1,justifyContent:'center'}}><MaterialIcons style={{color:'#D1D1D6'}} name={'navigate-next'} size={25}/></View>
                    <View style={{flex:1,justifyContent:'center'}}/>
                  </View>
                </View>
                <View style={{width:'100%',height:1,backgroundColor:'#30353C'}}/>
                <View style={{flex:1,margin:15,flexDirection:'row'}}>
                  <View style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{color:'#737373',padding:10,fontSize:16,fontFamily:'kanitSemiBold'}}>ชื่อผู้รับ</Text></View>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{color:'white',padding:10,fontSize:13,fontFamily:'kanitSemiBold'}}>{this.state.items.Order.NameUser}</Text></View>
                  </View>
                  <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{color:'#737373',padding:10,fontSize:16,fontFamily:'kanitSemiBold'}}>ราคารวม</Text></View>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{color:'white',padding:10,fontSize:13,fontFamily:'kanitSemiBold'}}>{this.state.items.Order.TotalPrice}/-</Text></View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex:0.02}}/>
          </View>
      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20'
  },
});
