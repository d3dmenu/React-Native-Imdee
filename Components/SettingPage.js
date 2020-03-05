import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { Ionicons,MaterialCommunityIcons,MaterialIcons,Entypo } from '@expo/vector-icons';
import BackTab from '../Option/BackTab.js'
import BottomTabNavigation from '../Option/BottomTabNavigation.js'

const SettingPage = ({btnCart, btnMess, btnProf, btnAddr, btnOrder, btnShop, btnWallet, btnDel, btnLogout}) => (
          <View style={{flex: 1,backgroundColor:'#151A20'}}>
            <View style={{flex:0.03}}/>
            <BackTab
              headTitle = 'ตั้งค่า'
              iconCart = {true}
              iconChat = {true}
              btnCart = {btnCart}
              btnMess = {btnMess}
            />
            <View style={{flex:0.87,marginLeft:15,marginRight:15}}>
              <ScrollView>
                <View style={{marginTop:5}}>
                  <View style={{backgroundColor:'#44464D',borderRadius:10}}>
                    <Text style={{color:'white',padding:25,fontSize:16,fontWeight:'bold'}}/>
                    <TouchableOpacity style={{padding:5,flexDirection:'row',alignItems:'center'}}  onPress={btnProf}>
                      <View style={{width:20,height:20,marginLeft:10,justifyContent:'center',alignItems:'center',backgroundColor:'#E5E5E5',borderRadius:100}}>
                        <Ionicons color='#44464D' name='ios-person' size={15}/>
                      </View>
                      <Text style={{color:'#D3D3D3',padding:10,fontSize:16, fontFamily:'kanitRegular'}}>ข้อมูลส่วนตัว</Text>
                    </TouchableOpacity>
                    <View style={{widte:'100%',height:0.5,backgroundColor:'#7B7B7B'}}/>
                    <TouchableOpacity style={{padding:5,flexDirection:'row',alignItems:'center'}}  onPress={btnAddr}>
                      <MaterialCommunityIcons style={{marginLeft:10}} color='#E5E5E5' name='map-marker' size={20}/>
                      <Text style={{color:'#D3D3D3',padding:10,fontSize:16, fontFamily:'kanitRegular'}}>ที่อยู่</Text>
                    </TouchableOpacity>
                    <View style={{widte:'100%',height:0.5,backgroundColor:'#7B7B7B'}}/>
                    <TouchableOpacity style={{padding:5,flexDirection:'row',alignItems:'center'}}  onPress={btnOrder}>
                      <MaterialCommunityIcons style={{marginLeft:10}} color='#E5E5E5' name='vector-combine' size={20}/>
                      <Text style={{color:'#D3D3D3',padding:10,fontSize:16, fontFamily:'kanitRegular'}}>คำสั่งซื้อ</Text>
                    </TouchableOpacity>
                    <View style={{widte:'100%',height:0.5,backgroundColor:'#7B7B7B'}}/>
                    <TouchableOpacity style={{padding:5,flexDirection:'row',alignItems:'center'}}  onPress={btnShop}>
                      <Entypo style={{marginLeft:10}} color='#E5E5E5' name='shop' size={20}/>
                      <Text style={{color:'#D3D3D3',padding:10,fontSize:16, fontFamily:'kanitRegular'}}>ร้านอาหารของฉัน</Text>
                    </TouchableOpacity>
                    <View style={{widte:'100%',height:0.5,backgroundColor:'#7B7B7B'}}/>
                    <TouchableOpacity style={{padding:5,flexDirection:'row',alignItems:'center'}}  onPress={btnWallet}>
                      <Entypo style={{marginLeft:10}} color='#E5E5E5' name='wallet' size={20}/>
                      <Text style={{color:'#D3D3D3',padding:10,fontSize:16, fontFamily:'kanitRegular'}}>วอลเล็ท</Text>
                    </TouchableOpacity>
                    <View style={{widte:'100%',height:0.5,backgroundColor:'#7B7B7B'}}/>
                    <TouchableOpacity style={{padding:5,flexDirection:'row',alignItems:'center'}}  onPress={btnDel}>
                      <MaterialIcons style={{marginLeft:10}} color='#E5E5E5' name='cancel' size={20}/>
                      <Text style={{color:'#D3D3D3',padding:10,fontSize:16, fontFamily:'kanitRegular'}}>ลบบัญชีผู้ใช้</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{position:'absolute',width:'100%',padding:15,paddingTop:22,paddingBottom:22,backgroundColor:'#31343D',borderTopStartRadius:10,borderTopEndRadius:10,elevation:15}}>
                    <Text style={{color:'white',paddingLeft:5,fontSize:20, fontFamily:'kanitBold'}}>บัญชีผู้ใช้</Text>
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity style={{width:'100%',backgroundColor:'#FF2D55',marginTop:15,marginBottom:15,padding:15,alignItems:'center',justifyContent:'center',borderRadius:100}} onPress={btnLogout}>
                <Text style={{color:'white',fontSize:15, fontFamily:'kanitSemiBold'}}>ออกจากระบบ</Text>
              </TouchableOpacity>
            </View>
          </View>
);
export default SettingPage
