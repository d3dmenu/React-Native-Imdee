import React from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, StatusBar, Dimensions, Alert, Picker, ScrollView} from "react-native";
import { Ionicons,FontAwesome,MaterialCommunityIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import database from '../Database/Database.js';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

var alltypeMail = [
  '@gmail.com','@gmail.co.th',
  '@hotmail.com','@hotmail.co.th',
]
var alltypeBank = [
  '[กรุงเทพ]','[กรุงไทย]','[กรุงศรีอยุธยา]','[กสิกรไทย]',
  '[ทหารไทย]','[ไทยพาณิชย์]','[ออมสิน]'
]
export default class RegisterPage extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = { name: "", email: "", password: "", credit: "", phone:"", image:null,//'https://www.img.in.th/images/1c04464430f769d81475bcc0134f7578.png',
              namestate: false, emailstate: false, passwordstate: false, creditstate: false, phonestate: false,
              pixel: Dimensions.get('window'), errorMessage: null, secureChange:true,
              picker:[], picker2:[], type:'@gmail.com', type2:'[กรุงเทพ]', dataSourceEmail:[], dataSourcePhone:[], dataSourceCredit:[]};

    constructor(props){
      super(props);
      database.readAllDataEveryTime("Email", this.updateEmail);
      database.readAllDataEveryTime("Phone", this.updatePhone);
      database.readAllDataEveryTime("Bank", this.updateCredit);
      for(var i=0;i<alltypeMail.length;i++){
        this.state.picker.push(<Picker.Item label={alltypeMail[i]} value={alltypeMail[i]}/>);
      }
      for(var i=0;i<alltypeBank.length;i++){
        this.state.picker2.push(<Picker.Item label={alltypeBank[i]} value={alltypeBank[i]}/>);
      }
    }

    handleSignUp = async () => {
        if(this.state.namestate==false){
          Alert.alert('ชื่อ-นามสกุลสั้นเกินไป');
          this.setState({name:'', namestate:false});
        }
        else if(this.state.emailstate==false){
          if(this.state.email.length>3)
            Alert.alert('อีเมลนี่ถูกใช้ไปแล้ว');
          else
            Alert.alert('อีเมลสั้นเกินไป');
          this.setState({email:'', emailstate:false});
        }
        else if(this.state.passwordstate==false){
          Alert.alert('รหัสผ่านสั้นเกินไป');
          this.setState({password:'', passwordstate:false});
        }
        else if(this.state.phonestate==false){
          if(this.state.phone.length==10)
            Alert.alert('เบอร์โทรนี้ถูกใช้ไปแล้ว');
          else
            Alert.alert('เบอร์โทรไม่ถูกต้อง');
        }
        else if(this.state.creditstate==false){
          if(this.state.credit.length<10 || this.state.credit.length>16)
            Alert.alert('เลขบัญชีธนาคารไม่ถูกต้อง');
          else
            Alert.alert('เลขบัญชีธนาคารถูกใช้ไปแล้ว');
          this.setState({credit:'', creditstate:false});
        }
        else{
          if(this.state.email.indexOf('@') > -1){
            this.setState({email:this.state.email.substring(0,this.state.email.indexOf('@'))});
          }
          var pass = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256, this.state.password
          );
          var account = {
            CreditCard : this.state.credit+this.state.type2,
            Email : this.state.email+this.state.type,
            Name : this.state.name,
            Password : pass.substring(0,32),
            Phone : this.state.phone,
            StateLogin : 0,
            NotificationToken : ''
          }
          database.uploadImage("User/", this.state.image, account.Email+':'+account.Phone)
          await database.createAccount(account, this.createAccount_success);
        }
    };
    updateEmail = (email) =>{
      this.setState({dataSourceEmail:email}); // Append email to Array dataSourceEmail
      this.onChangeEmail(this.state.email);
    }
    updatePhone = (phone) =>{
      this.setState({dataSourcePhone:phone});
      this.onChangePhone(this.state.phone);
    }
    updateCredit = (credit) =>{
      this.setState({dataSourceCredit:credit});
      this.onChangeCredit(this.state.credit)
    }

    createAccount_success = () =>{
      Alert.alert('สร้างบัญชีเรียบร้อยแล้ว');
      this.props.navigation.navigate('LoginScreen');
    }

    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    };

    onChangeFullName = (name) =>{
      if(name.length>=10)
        this.setState({ name:name, namestate:true });
      else
        this.setState({ name:name, namestate:false });
    }

    onChangeEmail = (email) =>{
      if(email.indexOf('@') > -1){
        email = email.substring(0,email.indexOf('@'))
      }
      if(email.indexOf(':') > -1){
        email = email.substring(0,email.indexOf(':'))
      }
      if(this.state.dataSourceEmail.indexOf(email+this.state.type) == -1 && email.length>2)
        this.setState({ email:email, emailstate:true });
      else
        this.setState({ email:email, emailstate:false });
    }

    onChangePicker = (itemValue) =>{
      this.setState({ type: itemValue });
      setTimeout(()=>{this.onChangeEmail(this.state.email)},100);
    }

    onChangePicker2 = (itemValue) =>{
      this.setState({ type2: itemValue });
      setTimeout(()=>{this.onChangeCredit(this.state.credit)},100);
    }

    onChangePassword = (password) =>{
      if(password.length>=6)
        this.setState({ password:password, passwordstate:true });
      else
        this.setState({ password:password, passwordstate:false });
    }

    onChangePhone = (phone) =>{
      if(this.state.dataSourcePhone.indexOf(phone) == -1 && phone.length==10 && phone[0] == '0' && (phone[1] == '6' || phone[1] == '8' || phone[1] == '9'))
        this.setState({ phone:phone, phonestate:true });
      else
        this.setState({ phone:phone, phonestate:false });
    }

    onChangeCredit = (credit) =>{
      if(credit.length>=10 && credit.length<=16 && this.state.dataSourceCredit.indexOf(credit+this.state.type2) == -1)
        this.setState({ credit:credit, creditstate:true });
      else
        this.setState({ credit:credit, creditstate:false });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                { this.state.pixel.height == 1194 && this.state.pixel.width == 834 ? (
                    <Image
                        source={require("../assets/authHeader2x.png")}
                        style={{ marginTop: -400, marginLeft: -100 }}
                    ></Image>
                ) : (
                    <Image
                        source={require("../assets/authHeader.png")}
                        style={{ marginTop: -200, marginLeft: -50 }}
                    ></Image>
                )}
                <Image
                    source={require("../assets/authFooter.png")}
                    style={{ position: "absolute", bottom: -325, right: -225 }}
                ></Image>
                <View style={{ position: "absolute", top: 15, alignItems: "center", width: "100%" }}>
                    <Text style={styles.greeting}>ลงทะเบียนเพื่อเริ่มต้น</Text>
                    <TouchableOpacity style={styles.avatar} onPress={this._pickImage}>
                        {(this.state.image==null)
                          ? <Ionicons
                              name="ios-add"
                              size={40}
                              color="#FFF"
                              style={{ marginTop: 6, marginLeft: 2 }}
                            ></Ionicons>
                          : <Image source={{ uri: this.state.image }} style={{ width: '100%', height:'100%', borderRadius:100}}></Image>
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
                    <Ionicons name="ios-arrow-round-back" size={32} color="#FFF"></Ionicons>
                </TouchableOpacity>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>ชื่อ-นามสกุล</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <TextInput
                              maxLength={30}
                              style={styles.input}
                              onChangeText={(name)=>this.onChangeFullName(name)}
                              value={this.state.name}
                          ></TextInput>
                          { (this.state.namestate)
                            ? <FontAwesome name={'check'} color={'green'} size={20} style={{paddingLeft:15}}/>
                            : <FontAwesome name={'close'} color={'red'} size={20} style={{paddingLeft:15}}/>
                          }
                        </View>
                    </View>

                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.inputTitle}>อีเมล</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <TextInput
                              style={styles.input2}
                              autoCapitalize="none"
                              onChangeText={(email)=>this.onChangeEmail(email)}
                              value={this.state.email}
                          ></TextInput>
                          <Picker selectedValue={this.state.type} itemStyle={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'50%',color:'white'}} style={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'50%',color:'white'}}
                          onValueChange={(itemValue)=>this.onChangePicker(itemValue)}>
                            {this.state.picker}
                          </Picker>
                          { (this.state.emailstate)
                            ? <FontAwesome name={'check'} color={'green'} size={20} style={{paddingLeft:15}}/>
                            : <FontAwesome name={'close'} color={'red'} size={20} style={{paddingLeft:15}}/>
                          }
                        </View>
                    </View>

                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.inputTitle}>รหัสผ่าน</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <TextInput
                              style={styles.input}
                              secureTextEntry={this.state.secureChange}
                              autoCapitalize="none"
                              onChangeText={(password)=>this.onChangePassword(password)}
                              value={this.state.password}
                          ></TextInput>
                          <TouchableOpacity style={{position:'absolute',width:30,height:30,justifyContent:'center',alignItems:'center',bottom:StyleSheet.hairlineWidth, right:30, backgroundColor:'#151A20'}} onPress={()=>this.setState({secureChange:!this.state.secureChange})}>
                            <MaterialCommunityIcons name={(this.state.secureChange)?'eye-off':'eye'} color='white' size={20}/>
                          </TouchableOpacity>
                          { (this.state.passwordstate)
                            ? <FontAwesome name={'check'} color={'green'} size={20} style={{paddingLeft:15}}/>
                            : <FontAwesome name={'close'} color={'red'} size={20} style={{paddingLeft:15}}/>
                          }
                        </View>
                    </View>

                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.inputTitle}>เบอร์โทร</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <TextInput
                              maxLength={10}
                              style={styles.input}
                              autoCapitalize="none"
                              onChangeText={(phone)=>this.onChangePhone(phone)}
                              value={this.state.phone}
                              keyboardType = 'numeric'
                          ></TextInput>
                          { (this.state.phonestate)
                            ? <FontAwesome name={'check'} color={'green'} size={20} style={{paddingLeft:15}}/>
                            : <FontAwesome name={'close'} color={'red'} size={20} style={{paddingLeft:15}}/>
                          }
                        </View>
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.inputTitle}>เลขบัญชีธนาคาร</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <TextInput
                              style={styles.input2}
                              autoCapitalize="null"
                              onChangeText={(credit)=>this.onChangeCredit(credit)}
                              value={this.state.credit}
                              keyboardType = 'numeric'
                          ></TextInput>
                          <Picker selectedValue={this.state.type2} itemStyle={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'50%',color:'white'}} style={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'50%',color:'white'}}
                          onValueChange={(itemValue)=>this.onChangePicker2(itemValue)}>
                            {this.state.picker2}
                          </Picker>
                          { (this.state.creditstate)
                            ? <FontAwesome name={'check'} color={'green'} size={20} style={{paddingLeft:15}}/>
                            : <FontAwesome name={'close'} color={'red'} size={20} style={{paddingLeft:15}}/>
                          }
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{ color: "#FFF", fontFamily:'kanitSemiBold' }}>ลงทะเบียน</Text>
                </TouchableOpacity>

                <View
                    style={{ alignSelf: "center", marginTop: 32 , flexDirection:'row' }}
                >
                    <Text style={{ color: "#8C8C8C", fontSize: 13, fontFamily:'kanitRegular' }}>
                        ถ้ามีบัญชีผู้ใช้ IMDEE อยู่แล้ว
                    </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("LoginScreen")}>
                      <Text style={{ marginLeft:5, color: "#FF2D55", fontFamily:'kanitRegular' }}>เข้าสู่ระบบที่นี่</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#151A20"
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        textAlign: "center",
        color: "#FFF",
        fontFamily:'kanitBold'
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase",
        fontFamily:'kanitMedium'
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "white",
        width: '90%',
    },
    input2: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "white",
        width: '40%',
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    back: {
        position: "absolute",
        top: 48,
        left: 32,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center"
    },
    avatar: {
        width: 100,
        height: 100,
        backgroundColor: "#585A5D",
        borderRadius: 50,
        marginTop: 48,
        justifyContent: "center",
        alignItems: "center"
    }
});
