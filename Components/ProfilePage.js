import React from 'react';
import { Text, View, TouchableOpacity, Image, Alert, AsyncStorage, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js';
import * as ImagePicker from 'expo-image-picker';

export default class ProfilePage extends React.Component {

    constructor(props) {
      super(props);
      this.onAsyncRead();
      this.state = {
          imageMemory:'',
          image:'',
          name:'',
          phone:'',
          email:'',
          credit:'',
          token:'',
      };
    }
    onPressNext() {
      if(this.state.name.length<10){
        Alert.alert("ชื่อ-นามสกุลสั้นเกินไป");
      }
      else if(this.state.credit<10){
        Alert.alert("เลขบัญชีธนาคารไม่ถูกต้อง");
      }
      else{
        if(this.state.imageMemory!=this.state.image){
          database.uploadImage("User/", this.state.image, this.state.realuser);
        }
        database.updateProfile(this.state.realuser, this.state.name, this.state.credit, this.updateProfile_success);
      }
    }
    updateProfile_success = (account) =>{
      this.onAsyncWrite(account);
    }
    updateToken = (token) =>{
      this.setState({token:token})
    }
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem("account_IMDEE");
      account = JSON.parse(account);
      database.randomToken(this.updateToken);

      var mail = account.Email.substring(0,account.Email.indexOf('@'));
      var domain = account.Email.substring(account.Email.indexOf('@')+1,account.Email.length);
      setTimeout(()=>{
        this.setState({
          realuser : account.Email+':'+account.Phone,
          image : "https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/User%2F"+mail+"%40"+domain+"%3A"+account.Phone+".jpg?alt=media&token="+this.state.token,
          imageMemory : "https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/User%2F"+mail+"%40"+domain+"%3A"+account.Phone+".jpg?alt=media&token="+this.state.token,
          name : account.Name,
          phone : account.Phone,
          email : account.Email,
          credit : account.CreditCard,
        });
      },100)
    }
    onAsyncWrite= async (account) => {
      await AsyncStorage.setItem("account_IMDEE", JSON.stringify(account));
      Alert.alert("บันทึกข้อมูลสำเร็จ")
      this.props.navigation.navigate("HomeScreen");
    };
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    onChangeFullName = (name) =>{
      this.setState({ name:name });
    }
    onChangeCredit = (credit) =>{
      this.setState({ credit:credit });
    }
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,

      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    };
    render() {
        return (
            <LinearGradient
                colors={['#151A20', '#151A20', '#151A20']}
                style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    alignContent: 'center',
                    flexDirection: 'column',
                }}>
                    <View style={{flex:0.03}}/>
                    <BackTab
                      iconBackLG = {true}
                      txtBackLG = 'ข้อมูลส่วนตัว'
                      btnBack = {this.onPressBack}
                    />
                    <View style={{flex:0.94,marginLeft:15,marginRight:15}}>
                      <View style={{
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '15%',
                          marginBottom: '5%',

                      }}>

                          <TouchableOpacity style={{
                              backgroundColor: '#FF2D55',
                              borderRadius: 156 / 2,
                              width: 156,
                              height: 156,
                              alignContent: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row'

                          }} onPress={this._pickImage}>
                            {(this.state.image!='')
                              ? <Image source={{ uri: this.state.image }} style={{ width: '100%', height:'100%', borderRadius:100}}></Image>
                              : null
                            }
                          </TouchableOpacity>
                      </View>


                      <View style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '5%',
                          borderBottomWidth: 1,
                          borderBottomColor: '#31343D',
                          flex: 1,

                      }}>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              flex: 0.3,

                          }}>
                              <Text style={{
                                  fontSize: 16,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>ชื่อ-นามสกุล</Text>
                          </View>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-end',
                              flex: 1,



                          }}>
                              <TextInput style={{
                                  fontSize: 15,
                                  color: '#E4E4E4',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}
                              maxLength={30}
                              onChangeText={(name)=>this.onChangeFullName(name)}
                              value={this.state.name}
                              ></TextInput>
                          </View>

                      </View>

                      <View style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '5%',
                          borderBottomWidth: 1,
                          borderBottomColor: '#31343D',
                          flex: 1,


                      }}>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              flex: 0.3,

                          }}>
                              <Text style={{
                                  fontSize: 16,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>เบอร์โทร</Text>
                          </View>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-end',
                              flex: 1,

                          }}>
                              <Text style={{
                                  fontSize: 15,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>{this.state.phone}</Text>
                          </View>

                      </View>

                      <View style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '5%',
                          borderBottomWidth: 1,
                          borderBottomColor: '#31343D',
                          flex: 1,



                      }}>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              flex: 0.3,
                          }}>
                              <Text style={{
                                  fontSize: 16,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>อีเมล</Text>
                          </View>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-end',
                              flex: 1,

                          }}>
                              <Text style={{
                                  fontSize: 15,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>{this.state.email}</Text>
                          </View>

                      </View>

                      <View style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '5%',
                          borderBottomWidth: 1,
                          borderBottomColor: '#31343D',
                          flex: 1,


                      }}>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              flex: 0.5,
                          }}>
                              <Text style={{
                                  fontSize: 16,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>บัตรเครดิต</Text>
                          </View>
                          <View style={{
                              flexDirection: 'column',
                              alignContent: 'flex-start',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-end',
                              flex: 1,
                          }}>
                              {/*<TextInput style={{
                                  fontSize: 15,
                                  color: '#E4E4E4',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}
                              value={this.state.credit}
                              keyboardType = 'numeric'
                              maxLength={10}
                              autoCapitalize="null"
                              onChangeText={(credit)=>this.onChangeCredit(credit)}
                              ></TextInput>*/}
                              <Text style={{
                                  fontSize: 15,
                                  color: '#848484',
                                  fontWeight: 'normal',
                                  textAlign: 'left',
                                  marginBottom: '2%',
                                  fontFamily:'kanitRegular'
                              }}>{this.state.credit}</Text>
                          </View>

                      </View>

                      <View style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '20%',
                          marginBottom: '5%',
                          marginRight: '5%',
                          marginLeft: '5%',
                          flex: 1,

                      }}>
                          <TouchableOpacity style={{
                              backgroundColor: '#FF2D55',
                              alignItems: 'center',
                              alignContent: 'center',
                              justifyContent: 'center',
                              borderRadius: 100,
                              width: '75%',
                              height: 37,
                          }}
                              onPress={() => this.onPressNext()}>
                              <View style={{
                                  alignContent: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  flex: 1,
                              }}>
                                  <Text style={{
                                      fontSize: 17,
                                      color: '#FFFFFF',
                                      textAlign: 'left',
                                      marginBottom: '2%',
                                      fontFamily:'kanitMedium'
                                  }}>บันทึก</Text>
                              </View>
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={{flex:0.02}}/>
                </View>
            </LinearGradient>
        );
    }
}
