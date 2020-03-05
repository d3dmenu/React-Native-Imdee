import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage } from 'react-native';
import FeedPage from './FeedPage.js';
import NotificationPage from './NotificationPage.js';
import SettingPage from './SettingPage.js'
import BottomTabNavigation from '../Option/BottomTabNavigation.js'
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import database from '../Database/Database.js'
import * as Crypto from 'expo-crypto';

export default class HomePage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead();
      this.state = {
        secureChange:true,
        isModalVisible: false,
        realuser:'',
        password:'',
        realpassword:'',
        onPage : <View style={{flex:1}}/>,
        lengthTab : 3,
        dataIcon : [
                     <Ionicons style={{padding:10,color:'#FF2D55'}} name={'md-restaurant'} size={35}/>,
                     <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-notifications'} size={35}/>,
                     <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-menu'} size={35}/>,
                   ],
        dataText : [ null,null,null ],
        dataMode : [
                     'View',
                     'TouchableOpacity',
                     'TouchableOpacity',
                   ],
        dataFunction : [
                          null,
                          this.onPressNotification,
                          this.onPressSetting
                       ],
        dataBorderColor : [
                            '#FF2D55',
                            '#FF2D55',
                            '#FF2D55',
                          ],
      };
    }
    onPressFeed = () =>{
      this.setState({onPage : <FeedPage btnCart={this.onPressCart} btnMess={this.onPressMessenger} btnRest={this.onPressRestaurant}/>,
                    dataIcon : [
                                 <Ionicons style={{padding:10,color:'#FF2D55'}} name={'md-restaurant'} size={35}/>,
                                 <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-notifications'} size={35}/>,
                                 <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-menu'} size={35}/>,
                               ],
                    dataMode : [
                                 'View',
                                 'TouchableOpacity',
                                 'TouchableOpacity',
                               ],
                    dataFunction : [
                                     null,
                                     this.onPressNotification,
                                     this.onPressSetting
                                   ],
                  });
    }
    onPressNotification = () =>{
      this.setState({onPage : <NotificationPage btnCart={this.onPressCart} btnMess={this.onPressMessenger}/>,
                    dataIcon : [
                                 <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-restaurant'} size={35}/>,
                                 <Ionicons style={{padding:10,color:'#FF2D55'}} name={'md-notifications'} size={35}/>,
                                 <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-menu'} size={35}/>,
                               ],
                    dataMode : [
                                 'TouchableOpacity',
                                 'View',
                                 'TouchableOpacity',
                               ],
                    dataFunction : [
                                     this.onPressFeed,
                                     null,
                                     this.onPressSetting
                                   ],
                  });
    }
    onPressSetting = () =>{
      this.setState({onPage : <SettingPage btnCart={this.onPressCart} btnMess={this.onPressMessenger}
                                btnProf={this.onPressProfile} btnAddr={this.onPressAddress} btnOrder={this.onPressOrder}
                                btnShop={this.onPressShop} btnDel={this.onPressDeleteAccount} btnLogout={this.onPressLogout}
                                btnWallet={this.onPressWallet}
                              />,
                    dataIcon : [
                                 <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-restaurant'} size={35}/>,
                                 <Ionicons style={{padding:10,color:'#8E8E93'}} name={'md-notifications'} size={35}/>,
                                 <Ionicons style={{padding:10,color:'#FF2D55'}} name={'md-menu'} size={35}/>,
                               ],
                    dataMode : [
                                 'TouchableOpacity',
                                 'TouchableOpacity',
                                 'View',
                               ],
                    dataFunction : [
                                     this.onPressFeed,
                                     this.onPressNotification,
                                     null
                                   ],
                  });
    }

    _showModal = () => this.setState({ isModalVisible: true })

    _hideModal = () => this.setState({ isModalVisible: false, password:'' })

    onAsyncWrite= async () => {
      await AsyncStorage.setItem('account_IMDEE', '');
      await AsyncStorage.setItem('myCart_IMDEE', '');
      this.props.navigation.navigate('SpashScreen');
    };

    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);
      this.setState({realuser:(account.Email+':'+account.Phone), realpassword:account.Password});
      this.onPressFeed();
    }

    logoutAccount_success = () =>{
      this.onAsyncWrite();
    }

    onPressDelete = async () =>{
      var pass = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256, this.state.password
      );
      if(pass.substring(0,32)!=this.state.realpassword){
        Alert.alert('รหัสผ่านผิด');
      }
      else{
        database.deleteUser(this.state.realuser, this.onPressLogout);
      }
    }

    /////////////////// Button ////////////////////
    onPressCart = () =>{
      this.props.navigation.navigate('AllCartScreen');
    }
    onPressMessenger = () =>{
      this.props.navigation.navigate('MessengerScreen');
    }
    onPressRestaurant = (items) =>{
      this.props.navigation.navigate('RestaurantScreen' ,{items:items});
    }
    onPressProfile = () =>{
      this.props.navigation.navigate('ProfileScreen');
    }
    onPressAddress = () =>{
      this.props.navigation.navigate('AddressScreen');
    }
    onPressOrder = () =>{
      this.props.navigation.navigate('MyOrderScreen');
    }
    onPressShop = () =>{
      this.props.navigation.navigate('MyShopScreen');
    }
    onPressWallet = () =>{
      this.props.navigation.navigate('WalletScreen');
    }
    onPressDeleteAccount = () =>{
      this._showModal();
    }
    onPressLogout = (state) =>{
      if(state==1)
        Alert.alert('ลบบัญชีเรียบร้อยแล้ว');
      database.logoutAccount(this.state.realuser, this.logoutAccount_success);
    }
    ///////////////////////////////////////////////
    render() {
        return (
          <View style={styles.container}>
            {this.state.onPage}
            {(this.state.isModalVisible)
              ?<View style={{marginTop: 22,position:'absolute' }}>
                <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: 'transparent'}}>
                  <TouchableOpacity style={{flex:1,width:'100%',backgroundColor:'transparent',justifyContent:'center'}} onPress={this._hideModal}>
                  </TouchableOpacity>
                  <View style={{ height:250,width:'100%',backgroundColor:'#31343D',borderRadius:10,position:'absolute' }}>
                    <Text style={{color:'#FF2D55',fontSize:25,fontFamily:'kanitBold',padding:10,paddingBottom:0}}>คำเตือน</Text>
                    <Text style={{color:'white',fontSize:15,padding:10,paddingTop:5,fontFamily:'kanitRegular'}}>โปรดตรวจสอบเงินในวอลเล็ทของคุณ {'\n'}เพราะถ้าคุณลบบัญชี ทางเราไม่สามารถคืนเงินให้คุณได้ {'\n\n'}ถ้าคุณโอเคแล้วโปรดใส่รหัสผ่านของคุณ</Text>
                    <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
                      <TextInput secureTextEntry={this.state.secureChange} style={{borderBottomWidth:1,borderBottomColor:'white',width:'50%',left:10,color:'white',fontSize:20,fontWeight:'bold'}} value={this.state.password} onChangeText={(password)=>this.setState({password})}/>
                      <TouchableOpacity style={{justifyContent:'center',alignItems:'center',padding:15,paddingTop:0,paddingBottom:0}} onPress={()=>this.setState({secureChange:!this.state.secureChange})}>
                        <MaterialCommunityIcons name={(this.state.secureChange)?'eye-off':'eye'} color='white' size={20}/>
                      </TouchableOpacity>
                      <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={this.onPressDelete}>
                        <Text style={{color:'#FF2D55',fontSize:15,fontFamily:'kanitBold'}}>ลบบัญชี</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
               :null
            }
            <BottomTabNavigation
              lengthTab = {this.state.lengthTab}
              dataIcon = {this.state.dataIcon}
              dataText = {this.state.dataText}
              dataMode = {this.state.dataMode}
              dataFunction = {this.state.dataFunction}
              dataBorderColor = {this.state.dataBorderColor}
            />
          </View>

      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20'
  },
});
