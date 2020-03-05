import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default class Test extends React.Component{
    constructor(props){
      super(props);
      this.register();
    }
    componentWillMount(){
      this.listener = Notifications.addListener(this.listen)
    }
    register = async () =>{
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)

      if(status !== 'granted'){
        Alert.alert('คุณสามารถเปิดแจ้งเตือนแอพได้ในตั้งค่า')
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log(status, token)
    }

    listen = ({origin, data}) =>{
      console.log('cool data',origin,data);
    }

    sendPushNotification = () =>{

      let response = fetch('https://exp.host/--/api/v2/push/send',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          to : 'ExponentPushToken[Pnx0rgNcpqR2VYPWBPzer6]',
          sound : 'default',
          body : 'Demo notification',
        })
      });
    }
    render() {
        return (
          <View style={styles.container}>
            <TouchableOpacity onPress={this.sendPushNotification}>
              <Text style={{color:'white',fontFamily:'kanitBold',fontSize:20}}>Push Notification</Text>
            </TouchableOpacity>
          </View>
      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20',
    justifyContent:'center',
    alignItems:'center'
  },
});
