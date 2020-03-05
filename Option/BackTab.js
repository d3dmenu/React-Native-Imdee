import React from 'react';
import { Constants, ImagePicker, Permissions} from 'expo';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  Button,Image
} from 'react-native';
import { Ionicons,FontAwesome } from '@expo/vector-icons';

const BackTab = ({iconBackSM, txtBackSM, iconBackLG, txtBackLG, btnBack, imgProfile, textProfile, headTitle, iconCart, btnCart, iconChat, btnMess, colorBG, borderBottom}) => (
  <View style={{flex:0.1,marginBottom:10,backgroundColor: (colorBG!=undefined)?'#151A20':'transparent'}}>
    <View style={{flex:1,flexDirection:'row'}}>
      <View style={{flex:0.7,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginLeft:15}}>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} onPress={btnBack}>
          {(iconBackSM)
              ? <Ionicons style={{marginLeft:5}} name={'ios-arrow-back'} size={35} color={'#DB3966'}/>
              : null
          }
          {(txtBackSM!=undefined)
              ? <Text style={{color:'#DB3966',marginLeft:10,fontSize:17,fontFamily:'kanitSemiBold'}}>{txtBackSM}</Text>
              : null
          }
          {(imgProfile!=undefined)
            ? <View style={{marginLeft:10,justifyContent:'center',alignItems:'center',borderRadius:100}}>
                {imgProfile}
              </View>
            : null
          }
          {(textProfile!=undefined)
            ? <Text style={{color:'white',marginLeft:10,fontSize:17,fontFamily:'kanitMedium'}}>{textProfile}</Text>
            : null
          }
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} onPress={btnBack}>
          {(iconBackLG)
              ? <Ionicons style={{marginLeft:5}} name={'ios-arrow-back'} size={35} color={'white'}/>
              : null
          }
          {(txtBackLG!=undefined)
              ? <Text style={{color:'white',marginLeft:10,fontSize:20,fontFamily:'kanitSemiBold'}}>{txtBackLG}</Text>
              : null
          }
        </TouchableOpacity>
        {(headTitle!=undefined)
          ? <Text style={{color:'white',marginLeft:5,fontSize:34,fontFamily:'kanitSemiBold'}}>{headTitle}</Text>
          : null
        }
      </View>
      <View style={{flex:0.3,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',marginRight:15}}>
        {(iconCart)
          ? <TouchableOpacity style={{width:40,height:40,marginRight:10,backgroundColor:'#007AFF',justifyContent:'center',alignItems:'center',borderRadius:100,padding:10}} onPress={btnCart}>
              <FontAwesome style={{alignSelf:'flex-start'}} name={'shopping-cart'} color={'white'} size={20}/>
            </TouchableOpacity>
          : null
        }
        {(iconChat)
          ? <TouchableOpacity style={{width:40,height:40,marginRight:5,backgroundColor:'#007AFF',justifyContent:'center',alignItems:'center',borderRadius:100,padding:10}} onPress={btnMess}>
              <Ionicons name={'ios-chatbubbles'} color={'white'} size={20}/>
            </TouchableOpacity>
          : null
        }
      </View>
    </View>
    {(borderBottom==undefined)?<View style={{width:'100%',height:0.5,backgroundColor:'#6B6A6B'}}/>:null}
  </View>
);
export default BackTab
