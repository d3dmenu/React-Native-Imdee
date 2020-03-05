import React from 'react';
import { Constants, ImagePicker, Permissions} from 'expo';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  Button, ImageEditor,Image,Alert,TouchableHighlight
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchTab = ({Func_Search,value}) => (
  <View style={{flex:0.07,justifyContent:'center',alignItems:'center',marginLeft:15,marginRight:15}}>
    <View style={{width:'100%',height:'75%',justifyContent:'flex-start',alignItems:'center',borderRadius:10,flexDirection:'row',backgroundColor:'#33353D'}}>
      <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-search'} size={20}/>
      <TextInput placeholderTextColor='#8E8E93' placeholder='ค้นหา' style={{width:'87%',fontSize:17,color:'#8E8E93',fontFamily:'kanitRegular'}} value={(value!=undefined)?value:null} onChangeText={(text)=>Func_Search(text)}/>
    </View>
  </View>
);
export default SearchTab
