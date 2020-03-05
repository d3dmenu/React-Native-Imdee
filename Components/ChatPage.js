import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage, Platform } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js'

var lenForLine =  [];
var text2 = "";
var text3 = "";
var countNewLine = 0;
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export default class ChatPage extends React.Component{
    constructor(props){
      super(props);
      var items = this.props.navigation.getParam('items','No-name');
      this.onAsyncRead();
      this.state = {
            keyboardOffset: 0,
            text: '',
            image : items.Logo,
            name:items.restaurant.Name,
            showTime : <View></View>,
            height: 60,
            height2: 0,
            items : items,
            realuser:'',
            dataSource : [],
            index:-1,
            oldindex:-1,
      };
    }
    ///////////////////////// TextInput Above Keyboard ////////////////////////
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (event) =>{
        this.setState({keyboardOffset: event.endCoordinates.height,height2:350});
    }

    _keyboardDidHide = () =>{
      this.setState({keyboardOffset: 0,height2:0});
    }
    ///////////////////////////////////////////////////////////////////////////
    onPressSend = () => {
      countNewLine = 0;
      text2 = this.state.text;
      for(var i=0;i<lenForLine.length;i++){
        text2 = text2.slice(0,lenForLine[i]+i) + '\n' + text2.slice(lenForLine[i]+i);
      }
      text3 = "";
      for(var i=0;i<text2.length;i++){
        if(text2[i] == '\n'){
          countNewLine++;
        }
        else{
          countNewLine=0;
        }
        if(countNewLine==2){
          countNewLine = 0;
        }
        else{
          text3 += text2[i];
        }
      }
      if(text3.trim()!=''){
        var message = {
          Name : this.state.realuser,
          Message : text3.trim(),
          Time : new Date()
        }
        database.addMessage(this.state.realuser, this.state.items.id, message)
        this.setState({text:'', height:60})
      }
    }

    onChangeText = (text) => {
      var lengLastArr = lenForLine[lenForLine.length-1];
      if(lengLastArr != undefined){
        if(text.length<=lengLastArr){
          lenForLine.pop();
          if (this.state.height>60 && lenForLine.length<5) {
            this.setState({height:this.state.height-15});
          }
        }
      }
      if(text.length==0){
        lenForLine =  [];
        this.setState({height:60});
      }
      this.setState({text:text});
    }

    onNewLine = () =>{
      var message = this.state.text;
      if(message.substring(message.length-2,message.length-1) == '\n' && message.substring(message.length-1,message.length) != '\n'){
        this.setState({state:1});
      }
      else {
        this.setState({state:0});
      }
      if(this.state.state==0){
        if (this.state.height<135) {
          this.setState({height:this.state.height+15});
        }
        this.setState({state:1});
        lenForLine.push(message.length-1);
      }
    }

    onPressShowTime = (times,index) =>{
      if (Platform.OS === 'ios') {
        console.log('ios');
        var day = times.substring(0,times.indexOf('/'))
        times = times.substring(times.indexOf('/')+1).trim();
        var month = times.substring(0,times.indexOf('/'))
        times = times.substring(times.indexOf('/')+1).trim();
        var year = String(Number(times.substring(0,times.indexOf(' ')))-543)
        times = times.substring(times.indexOf(' ')+1).trim();
        var time = times;
        if(day.length==1){
          day = '0'+day
        }
        if(month.length==1){
          month = '0'+month
        }

        var times2 = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"});
        var day2 = times2.substring(0,times2.indexOf('/'))
        times2 = times2.substring(times2.indexOf('/')+1).trim();
        var month2 = times2.substring(0,times2.indexOf('/'))
        times2 = times2.substring(times2.indexOf('/')+1).trim();
        var year2 = String(Number(times2.substring(0,times2.indexOf(' ')))-543)
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var time2 = times2;
        if(day2.length==1){
          day2 = '0'+day2
        }
        if(month2.length==1){
          month2 = '0'+month2
        }
        const ago = new Date(month + '/' + day + '/' + year);
        const now = new Date(month2 + '/' + day2 + '/' + year2);
        const diffTime = Math.abs(now - ago);
        const diffDays = Math.ceil(diffTime/(60*60*24*1000));
        if(diffDays < 2 && diffDays >= 1)
          times = time + ', Yesterday'
        else if(diffDays < 1)
          times = time + ', Today'
        else
          times = time + ', ' + day + '/' + month + '/' + year
      }
      else if (Platform.OS === 'android') {
        console.log('android');
        var dayText = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var month = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var day = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var time = times.substring(0,times.indexOf(' '))
        times = times.substring(times.indexOf(' ')+1).trim();
        var year = times
        if(day.length==1){
          day = '0'+day
        }
        if(String(Number(months.indexOf(month)+1)).length==1){
          month = '0'+String(Number(months.indexOf(month)+1))
        }

        var times2 = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"});
        var dayText2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var month2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var day2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var time2 = times2.substring(0,times2.indexOf(' '))
        times2 = times2.substring(times2.indexOf(' ')+1).trim();
        var year2 = times2;
        if(day2.length==1){
          day2 = '0'+day2
        }
        if(String(Number(months.indexOf(month2)+1)).length==1){
          month2 = '0'+String(Number(months.indexOf(month2)+1))
        }

        const ago = new Date(month + '/' + day + '/' + year);
        const now = new Date(month2 + '/' + day2 + '/' + year2);
        const diffTime = Math.abs(now - ago);
        const diffDays = Math.ceil(diffTime/(60*60*24*1000));
        if(diffDays < 2 && diffDays >= 1)
          times = time + ', Yesterday'
        else if(diffDays < 1)
          times = time + ', Today'
        else
          times = time + ', ' + day + '/' + month + '/' + year
      }
      if(index!=this.state.oldindex){
        this.setState({showTime:<Text style={{color:'#797b85',fontSize:12,fontFamily:'kanitRegular'}}>{times}</Text>, oldindex:index});
      }
      else{
        this.setState({showTime:null, oldindex:-1});
      }
      this.setState({index:index})
    }

    randomMessage = (item,index) => {
      if(item.Name == ''){
        return (<View style={{width:'100%',height:this.state.height2}}/>);
      }
      else{
        if(item.Name!=this.state.realuser){
          return (<View style={{width:'100%',alignItems:'flex-start'}}><View style={{alignItems:'flex-start',marginTop:15,width:'85%'}}><TouchableOpacity onPress={()=>{this.onPressShowTime(item.Time,index)}} style={{flex:1,marginBottom:10,marginLeft:15, backgroundColor:'#5F6168',borderRadius:25,justifyContent:'center',alignItems:'center',textalign:'center',padding:15}}><Text style={{fontSize:15,color:'white',fontFamily:'kanitRegular'}}>{item.Message}</Text></TouchableOpacity><View style={{marginLeft:20}}>{(this.state.index==index)?this.state.showTime:null}</View></View></View>);
        }
        else{
          return (<View style={{width:'100%',alignItems:'flex-end'}}><View style={{alignItems:'flex-end',marginTop:15,width:'85%'}}><TouchableOpacity onPress={()=>{this.onPressShowTime(item.Time,index)}}><LinearGradient colors={['#F85568', '#DD3C4B']} style={{marginBottom:10,marginRight:15,borderRadius:25,justifyContent:'center',alignItems:'center',textalign:'center',padding:15}}><Text style={{fontSize:15,color:'white',fontFamily:'kanitRegular'}}>{item.Message}</Text></LinearGradient></TouchableOpacity><View style={{marginRight:20}}>{(this.state.index==index)?this.state.showTime:null}</View></View></View>);
        }
      }
    }

    onPressBack = () =>{
      this.props.navigation.goBack();
    }

    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);

      this.setState({realuser:account.Email+':'+account.Phone})
      database.readMessage(account.Email+':'+account.Phone,this.state.items.id,this.readMessage_success);
    }

    readMessage_success = (messages) =>{
      this.setState({dataSource:messages.reverse(), showTime:null, oldindex:-1})
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={styles.container2}>
              <View style={{height:'10%',bottom:this.state.keyboardOffset}}/>
              <View style={{flex:1,bottom:this.state.keyboardOffset}}>
                <FlatList
                    data = {this.state.dataSource}
                    renderItem={({item,index}) => this.randomMessage(item,index)}
                    inverted = {true}
                  />
              </View>
              <View style={{bottom:this.state.keyboardOffset,width:'100%',height:this.state.height,justifyContent:'center',alignItems:'center',backgroundColor:'#151A20',paddingTop:8,paddingBottom:8,paddingLeft:10,paddingRight:10}}>
                  <View style={{flex:1,width:'95%',justifyContent:'center',alignItems:'center',backgroundColor:'#35363C',flexDirection:'row',borderRadius:20}}>
                    <View style={styles.spaceView003}/>
                    <View style={{flex:1,margin:10,justifyContent:'center',alignItems:'center'}}>
                      <ScrollView style={{width:'100%'}}>
                        <TextInput placeholderTextColor='#6A6A6A' placeholder='พิมข้อความ...' style={{color:'white',fontSize:15,fontFamily:'kanitRegular'}} multiline={true} onChangeText={text=>this.onChangeText(text)} value={this.state.text} onScroll={this.onNewLine}>
                        </TextInput>
                      </ScrollView>
                    </View>
                    <View style={{flex:0.2,height:'100%',justifyContent:'flex-end',alignItems:'flex-end',marginBottom:8,marginRight:4}}>
                      <TouchableOpacity onPress={()=>this.onPressSend()}>
                        <Image source={{ uri: 'https://www.img.in.th/images/1c04464430f769d81475bcc0134f7578.png' }} style={{ width: 35, height:35, borderRadius:100}}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
            </View>
              <View style={{flex:0.03,backgroundColor:'#151A20'}}/>
              <BackTab
                iconBackSM = {true}
                btnBack = {this.onPressBack}
                imgProfile = <Image source={{ uri: this.state.image }} style={{ width: 40, height:40, borderRadius:100}}></Image>
                textProfile = {this.state.name}
                colorBG = {true}
              />
          </View>
      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20'
  },
  container2: {
    position:'absolute',
    width:'100%',
    height:'100%'
  },
  spaceView003: {
    flex:0.03,
    backgroundColor:'#151A20'
  },
});
