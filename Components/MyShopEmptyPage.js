import React from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Alert } from 'react-native';
import {AntDesign} from '@expo/vector-icons';

export default class MyShopEmptyPage extends React.Component {
    render() {
      const {btnCreateShop} = this.props;
        return (
          <View style={{flex: 0.94,backgroundColor:'#151A20'}}>
            <View style={{flex:1,marginLeft:15,marginRight:15,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#8A8A8F',fontSize:18,fontFamily:'kanitBold'}}>สร้างร้านค้าใหม่</Text>
              <TouchableOpacity style={{width:70,height:70,right:20,bottom:30,borderRadius:100,position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'#FF2D55'}} onPress={btnCreateShop}>
                <AntDesign color='white' name='plus' size={50}/>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
}
