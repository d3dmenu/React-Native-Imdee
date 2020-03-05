import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation, Dimensions, Alert, AsyncStorage } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import * as firebase from "firebase";
import database from "../Database/Database.js";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default class LoginPage extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        user: "",
        password: "",
        pixel: Dimensions.get("window"),
        errorMessage: null,
        secureChange:true,
    };

    handleLogin = async () => {
        if(this.state.user.length>0 && this.state.password.length>0){
          const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)

          if(status !== 'granted'){
            Alert.alert('คุณสามารถเปิดแจ้งเตือนแอพได้ในตั้งค่า')
            return;
          }

          //const token = await Notifications.getExpoPushTokenAsync();
          var pass = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256, this.state.password
          );

          var account = {
            Username : this.state.user,
            Password : pass.substring(0,32)
          };

          database.loginAccount(account, "ExponentPushToken[5YrjEGCdfDlrW0SNKZeyMy]", this.loginAccount_success, this.loginAccount_fail);
          console.log(this.state.password);
        }
        else
          Alert.alert("กรอกข้อมูลให้ครบถ้วน");
    };
    
    loginAccount_success = async (account) =>{
      await database.readCart(account.Email+':'+account.Phone);
      await database.checkRestaurant(account.Email+':'+account.Phone);
      await AsyncStorage.setItem("account_IMDEE", JSON.stringify(account));
      this.props.navigation.navigate("SecondScreen");
    }

    loginAccount_fail = (state) =>{
      if(state==1){
        Alert.alert("ไม่พบอีเมลหรือเบอร์โทรนี้");
        this.setState({user: ''});
      }
      else if(state==2){
        Alert.alert("รหัสผ่านผิด");
        this.setState({password: ''});
      }
      else if(state==3){
        Alert.alert("บัญชีนี้ถูกใช้อยู่แล้วบนอุปกรณ์อื่น");
        this.setState({user: '', password: ''});
      }
    }
    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                { this.state.pixel.height == 1194 && this.state.pixel.width == 834 || this.state.pixel.height == 834 && this.state.pixel.width == 1194  ? (
                <Image
                    source={require("../assets/authHeader2x.png")}
                    style={{ marginTop: -450, marginLeft: -50 }}
                    ></Image>
                ) : (
                    <Image
                    source={require("../assets/authHeader.png")}
                    style={{ marginTop: -176, marginLeft: -50 }}
                    ></Image>
                )}
                <Image
                    source={require("../assets/authFooter.png")}
                    style={{ position: "absolute", bottom: -325, right: -225 }}
                ></Image>
                <Image
                    source={require("../image/fooddome_116536.png")}
                    style={{ width:120, height:120, marginTop: -70, alignSelf: "center"}}
                ></Image>
                <Text style={styles.greeting}>ยินดีต้อนรับสู่ IMDEE</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>อีเมล / เบอร์โทร</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={user => this.setState({ user })}
                            value={this.state.user}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>รหัสผ่าน</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={this.state.secureChange}
                            autoCapitalize="none"
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        ></TextInput>
                        <TouchableOpacity style={{position:"absolute",width:30,height:30,justifyContent:"center",alignItems:"center",bottom:1.1, right:0, backgroundColor:"#151A20"}} onPress={()=>this.setState({secureChange:!this.state.secureChange})}>
                          <MaterialCommunityIcons name={(this.state.secureChange)?"eye-off":"eye"} color="white" size={20}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={{ color: "#FFF", fontFamily:"kanitSemiBold" }}>เข้าสู่ระบบ</Text>
                </TouchableOpacity>

                <View
                    style={{ alignSelf: "center", marginTop: 32, flexDirection:"row" }}
                >
                    <Text style={{ color: "#8C8C8C", fontSize: 13, fontFamily:"kanitRegular" }}>
                    ถ้ายังไม่มีบัญชีผู้ใช้ IMDEE
                    </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("RegisterScreen")}>
                      <Text style={{ marginLeft:5, fontSize: 13, color: "#FF2D55", fontFamily:"kanitRegular" }}>สมัครที่นี่</Text>
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
        marginTop: 10,
        fontSize: 18,
        color: "#FFFFFF",
        textAlign: "center",
        fontFamily:"kanitBold"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        textTransform: "uppercase",
        fontFamily:"kanitMedium"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: 1,
        height: 40,
        fontSize: 15,
        color: "white"
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
    }
});
