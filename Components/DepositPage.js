import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage, Picker } from 'react-native';
import BackTab from '../Option/BackTab.js'
import {FontAwesome} from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import database from '../Database/Database.js'
import moment from 'moment';

var banks = ['เลือกธนาคาร','ธนาคารกรุงเทพ','ธนาคารกรุงไทย','ธนาคารกรุงศรีอยุธยา','ธนาคารกสิกรไทย','ธนาคารไทยพาณิชย์','ธนาคารทหารไทย','ธนาคารออมสิน']
var banksES = ['','BBLA','KTBA','BAYA','KBNK','SCB','TMBA','MYMO']
export default class DepositPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead();
      this.state = {
        pushBtn : -1,
        value : 0,
        dataSource : [ 50, 100, 200, 300, 400, 500, 600, 900,1000, 1500, 1900, 2000, 3000, 4000, 5000, 7000, 10000, 12000, 15000, 20000 ],
        payload : '',
        check : false,
        account : null,
        realuser : '',
        isModalVisible:false,
        isModalVisible2:false,
        isVisible:false,

        name:'',
        bank:0,
        credit:'',
        chosenDate : 'เลือกเวลา',
        chosenDateEng : '',
        picker:[],
      }
      for(var i=0;i<banks.length;i++){
        this.state.picker.push(<Picker.Item label={String(banks[i])} value={i}/>);
      }
    }
    onPressPrice = (index) =>{
      if(this.state.check==0){
        if(this.state.pushBtn==index)
          this.setState({pushBtn:-1,value:0})
        else
          this.setState({pushBtn:index, value:this.state.dataSource[index]})
      }
    }
    onChangePrice = (value) =>{
      if(this.state.check==0){
        if(this.state.dataSource.indexOf(Number(value))>-1)
          this.setState({pushBtn:this.state.dataSource.indexOf(Number(value))});
        else
          this.setState({pushBtn:-1});

        if(value >= 20000)
          this.setState({value:20000})
        else if(value<0)
          this.setState({value:0})
        else
          this.setState({value:value})
      }
    }
    onPressCreateQR = () =>{
      if(this.state.value>=50 && this.state.value<=20000){
        const generatePayload = require('promptpay-qr')
        const qrcode = require('qrcode')

        const mobileNumber = '090-991-4829'
        const IDCardNumber = '1-9098-023-92-448'
        const amount = Number(this.state.value)
        const payload = generatePayload(mobileNumber, { amount })

        setTimeout(()=>{
          this.setState({payload:payload,check:true,isModalVisible: false,chosenDate : 'เลือกเวลา',name:'',bank:0,credit:''})
        },0)
      }
      else{
        this.setState({payload:'',check:false,isModalVisible: false})
        Alert.alert('ฝากเงินขั้นต่ำ 50 บาท')
      }
    }
    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);
      this.setState({account:account, realuser:account.Email+':'+account.Phone});
    }
    onPressBack = () =>{
      this.props.navigation.navigate('WalletScreen');
    }
    onPressOK = () =>{
      if(this.state.name.trim().length == 0){
        Alert.alert('โปรดกรอกชื่อบัญชีที่โอน')
      }
      else if(this.state.name.indexOf(' ')==-1){
        Alert.alert('ชื่อบัญชีไม่ถูกต้อง')
      }
      else if(this.state.bank==0){
        Alert.alert('โปรดเลือกธนาคาร')
      }
      else if(this.state.credit.length == 0){
        Alert.alert('โปรดกรอกเลขที่บัญชี')
      }
      else if(this.state.credit.length < 10){
        Alert.alert('เลขที่บัญชีไม่ถูกต้อง')
      }
      else if(this.state.chosenDateEng == ''){
        Alert.alert('โปรดเลือกวันเวลาที่โอน')
      }
      else{
        var data = {
          IDCard : this.state.credit,
          Type : banksES[this.state.bank],
          Amount : parseFloat(this.state.value).toFixed(2),
          Date : this.state.chosenDateEng,
          Name : this.state.name.trim(),
        }
        database.checkQR_Payment(this.state.realuser, data, this.checkDeposit_Success, this.checkDeposit_Fail)
      }
    }
    checkDeposit_Success = () =>{
      database.sendNotification(this.state.realuser, 'ฝากเงินเข้าวอลเล็ทสำเร็จแล้ว', 'รายการฝากเงินของคุณสำเร็จแล้ว \nยอดเงินจำนวน '+String(parseFloat(this.state.value).toFixed(2))+' บาทได้ถูกเพิ่มเข้าไปในวอลเล็ทของคุณแล้ว โปรดตรวจสอบได้ที่หน้าวอลเล็ท')
      Alert.alert('โอนเงินสำเร็จ')
      this.props.navigation.navigate('HomeScreen');
    }
    checkDeposit_Fail = () =>{
      this.setState({name:'',bank:0,credit:'',chosenDate : 'เลือกเวลา',chosenDateEng : ''})
      Alert.alert('เงินยังไม่เข้าระบบ')
    }
    _showModal = () =>{
      if(this.state.check==0){
        this.setState({ isModalVisible: true})
      }
    }
    _hideModal = () => {
      this.setState({ isModalVisible: false })
    }
    _showModal2 = () =>{
      this.setState({ isModalVisible2: true})
    }
    _hideModal2 = () => {
      this.setState({ isModalVisible2: false })
    }

    handlePicker = (datetime) => {
      this.setState({
        isVisible : false,
        chosenDate : moment(datetime).format('DD/MM/YYYY HH:mm:SS'),
        chosenDateEng : new Date(datetime.toLocaleString('th-TH',{timeZone:'Asia/Bangkok'})),
      })
    }
    showPicker = () =>{
      this.setState({
        isVisible : true
      })
    }
    hidePicker = () => {
      this.setState({
        isVisible : false
      })
    }
    render() {
        return (
          <View style={styles.container}>
            <View style={{flex:0.03}}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = 'ฝากเงิน'
              btnBack = {this._showModal2}
            />
            <View style={{flex:0.85,marginLeft:15,marginRight:15}}>
              <Text style={{color:'#D8D8D8',fontSize:14,fontFamily:'kanitMedium'}}>กรุณาระบุจำนวนเงินฝากเข้าบัญชี</Text>
              <View style={{height:40,marginTop:10}}>
                <FlatList
                  horizontal={true}
                  data={this.state.dataSource}
                  renderItem={({item,index}) =>
                    <TouchableOpacity style={{width:80,height:40,backgroundColor:(this.state.pushBtn==index)?'#FF2D55':'#404040',marginRight:10,borderRadius:50,justifyContent:'center',alignItems:'center'}} onPress={()=>this.onPressPrice(index)}>
                      <Text style={{color:'white',fontSize:18,fontFamily:'kanitSemiBold'}}>{item}</Text>
                    </TouchableOpacity>
                  }
                />
              </View>
              {(this.state.check==0)
                ?<TextInput style={{color:'#737070',backgroundColor:'#33353D',height:40,borderRadius:10,paddingLeft:20,paddingRight:20,textAlign:'right',fontFamily:'kanitSemiBold',marginTop:10}} placeholder='จำนวนเงิน 50.00 - 20,000.00 บาท' placeholderTextColor='#737070' keyboardType='numeric' value={(this.state.value>0)?String(this.state.value):''} onChangeText={(value)=>this.onChangePrice(value)}/>
                :<View style={{backgroundColor:'#33353D',height:40,width:'100%',borderRadius:10,paddingLeft:20,paddingRight:20,marginTop:10,justifyContent:'center'}}>
                  <Text style={{color:'white',textAlign:'right',fontFamily:'kanitSemiBold'}}>{String(parseFloat(this.state.value).toFixed(2))} บาท</Text>
                </View>
              }
              <TouchableOpacity style={{height:50,backgroundColor:'#F4F4F4',justifyContent:'center',alignItems:'center',borderRadius:50,marginTop:10}} onPress={this._showModal}>
                <Text style={{color:'#FF2D55',fontSize:16,fontFamily:'kanitSemiBold'}}>สร้าง QR CODE</Text>
              </TouchableOpacity>
              <ScrollView>
                {
                (this.state.check==true)
                ? <View style={{width:'100%',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                    <View style={{borderWidth:20,borderColor:'white',borderRadius:10}}>
                      <QRCode
                        value={this.state.payload}
                        size={300}
                        bgColor="#000"
                        fgColor="#fff"
                      />
                    </View>
                    <View style={{width:'100%',marginTop:20,borderBottomWidth:1,borderBottomColor:'#737070'}}>
                      <Text style={{color:'#737070',fontSize:15}}>ชื่อบัญชีที่โอน (ชื่อต้องเป็นภาษาอังกฤษเท่านั้น)</Text>
                      <TextInput style={{color:'white',fontSize:13}} value={this.state.name} onChangeText={(name)=>this.setState({name})}/>
                    </View>
                    <View style={{width:'100%',marginTop:20,borderBottomWidth:1,borderBottomColor:'#737070'}}>
                      <Text style={{color:'#737070',fontSize:15}}>ธนาคารที่โอน</Text>
                      <Picker selectedValue={this.state.bank} itemStyle={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'50%',color:'white'}} style={{alignItems:'center',borderColor:'gray',borderRadius:25,height:45,width:'65%',color:'white'}}
                      onValueChange={(itemValue)=>{this.setState({bank:itemValue})}}>
                        {this.state.picker}
                      </Picker>
                    </View>
                    <View style={{width:'100%',marginTop:20,borderBottomWidth:1,borderBottomColor:'#737070'}}>
                      <Text style={{color:'#737070',fontSize:15}}>เลขที่บัญชีที่โอน</Text>
                      <TextInput keyboardType={'numeric'} style={{color:'white',fontSize:13}} value={this.state.credit} onChangeText={(credit)=>this.setState({credit})}/>
                    </View>
                    <View style={{width:'100%',marginTop:20,borderBottomWidth:1,borderBottomColor:'#737070'}}>
                      <Text style={{color:'#737070',fontSize:15}}>วันเวลาที่โอน</Text>
                      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:'100%'}} onPress={this.showPicker}>
                        <Text style={{color:'white',fontSize:16,padding:10}}>{this.state.chosenDate}</Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={this.state.isVisible}
                        mode="datetime"
                        onConfirm={this.handlePicker}
                        onCancel={this.hidePicker}
                      />
                    </View>
                  </View>
                :null
              }
              </ScrollView>
              <TouchableOpacity style={{height:50,backgroundColor:'#FF2D55',justifyContent:'center',alignItems:'center',borderRadius:50,marginTop:10}} onPress={this.onPressOK}>
                <Text style={{color:'#F4F4F4',fontSize:16,fontFamily:'kanitSemiBold'}}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:0.02}}/>

            <View style={{marginTop: 22,position:'absolute' }}>
              <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: 'transparent',alignItems:'center'}}>
                <TouchableOpacity style={{flex:1,width:'100%',backgroundColor:'transparent',justifyContent:'center'}} onPress={this._hideModal}>
                </TouchableOpacity>
                <View style={{ height:140,width:'80%',backgroundColor:'#31343D',borderRadius:20,position:'absolute',alignItems:'center' }}>
                  <Text style={{color:'white',fontSize:15,fontFamily:'kanitBold',padding:15}}>เมื่อคุณโอนเงินผ่าน PromptPay แล้ว{'\n'}โปรดกรอกข้อมูลของคุณที่โอนเงินตามบิล/ใบเสร็จที่คุณได้โอนเงินไปพร้อมกดตกลง</Text>
                  <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={this.onPressCreateQR}>
                      <Text style={{color:'#2BF658',fontSize:20,fontFamily:'kanitMedium'}}>ตกลง</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={this._hideModal}>
                      <Text style={{color:'#FF2D55',fontSize:20,fontFamily:'kanitMedium'}}>ยกเลิก</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={{marginTop: 22,position:'absolute' }}>
              <Modal isVisible={this.state.isModalVisible2} style={{backgroundColor: 'transparent',alignItems:'center'}}>
                <TouchableOpacity style={{flex:1,width:'100%',backgroundColor:'transparent',justifyContent:'center'}} onPress={this._hideModal2}>
                </TouchableOpacity>
                <View style={{ height:140,width:'80%',backgroundColor:'#31343D',borderRadius:20,position:'absolute',alignItems:'center' }}>
                  <Text style={{color:'white',fontSize:23,fontFamily:'kanitBold',padding:10,paddingTop:30}}>ต้องการยกเลิกรายการหรือไม่</Text>
                  <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={this.onPressBack}>
                      <Text style={{color:'#2BF658',fontSize:30,fontFamily:'kanitMedium'}}>ตกลง</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={this._hideModal2}>
                      <Text style={{color:'#FF2D55',fontSize:30,fontFamily:'kanitMedium'}}>ยกเลิก</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
      );}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#151A20'
  },
});
