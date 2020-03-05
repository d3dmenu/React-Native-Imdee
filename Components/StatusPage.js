import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, Dimensions, AsyncStorage } from 'react-native';
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js'

export default class StatusPage extends React.Component{
    constructor(props){
      super(props);
      var items = this.props.navigation.getParam('items','No-Items');
      this.state = {
        items:items,
        dataSource : []
      }
      this.onAsyncRead();
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    readMenuInOrder_success = (obj) =>{
      var data = {
        ID_Menu: "",
        Name: "",
        Price: 0,
        Type: "",
        Value: 0,
      }
      obj.push(data);
      this.setState({dataSource:obj});
    }
    onAsyncRead = async () =>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);

      database.readMenuInOrder(account.Email+':'+account.Phone, this.state.items.ID, this.state.items.Path, this.readMenuInOrder_success);
    }
    render() {
        return (
          <View style={styles.container}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackSM = {true}
              txtBackSM = 'กลับ'
              btnBack = {this.onPressBack}
            />
            <View style={{flex:1.2,marginLeft:15,marginRight:15}}>
              <View style={{flex:0.8,marginTop:10}}>
                <Text style={{color:'white',fontSize:22,fontFamily:'kanitBold'}}>รายการสั่งซื้อ</Text>
                <FlatList
                  data = {this.state.dataSource}
                  style={{marginTop:10}}
                  renderItem = {({item,index}) =>
                    (item.ID_Menu!='')
                    ? <View style={{padding:5,flexDirection:'row'}}>
                        <Text style={{color:'white',fontSize:17}}>{index+1}</Text>
                        <View style={{marginLeft:10,width:'100%'}}>
                          <Text style={{color:'white',fontSize:17,fontFamily:'kanitRegular'}}>{'ชื่อสินค้า : '+ item.Name}</Text>
                          <Text style={{color:'white',fontSize:17,fontFamily:'kanitRegular'}}>{'ชนิดสินค้า : '+ item.Type}</Text>
                          <Text style={{color:'white',fontSize:17,fontFamily:'kanitRegular'}}>{'จำนวน : '+ item.Value}</Text>
                          <Text style={{color:'white',fontSize:17,fontFamily:'kanitRegular'}}>{'ราคาต่อหน่วย : '+ item.Price}</Text>
                          <View style={{width:'100%',marginTop:10,height:1,backgroundColor:'#BCBBC1'}}></View>
                        </View>
                      </View>
                    : <View style={{padding:5,flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end',marginBottom:10}}>
                        <Text style={{color:'white',marginRight:10,fontSize:17,fontFamily:'kanitMedium'}}>ราคารวม</Text>
                        <Text style={{color:'#DB3966',fontSize:17,fontFamily:'kanitMedium'}}>{this.state.items.Order.TotalPrice} บาท</Text>
                      </View>
                  }
                />
              </View>
              <View style={{flex:0.2,marginTop:10}}>
                <Text style={{color:'white',fontSize:22,fontFamily:'kanitBold'}}>ที่อยู่ที่ต้องจัดส่ง</Text>
                <View style={{width:'100%',height:1,backgroundColor:'#C8C7CC'}}/>
                <Text style={{color:'#868686',width:'85%',fontSize:14,fontFamily:'kanitRegular'}}>{this.state.items.Order.Address+'\n'+this.state.items.Order.Phone}</Text>
              </View>
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
