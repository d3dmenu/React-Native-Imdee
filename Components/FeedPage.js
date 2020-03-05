import React from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, AsyncStorage } from 'react-native';
import { MaterialIcons,Foundation } from '@expo/vector-icons';
import SearchTab from '../Option/SearchTab.js'
import BackTab from '../Option/BackTab.js'
import BottomTabNavigation from '../Option/BottomTabNavigation.js'
import database from '../Database/Database.js'

export default class FeedPage extends React.Component{
  constructor(props){
    super(props);
    this.onAsyncRead();
    this.state = {
        length : 0,
        i : 0,
        stateRead : 0,
        full : 0,
        dataObjShow : [],
        dataSource : [],
        dataObjOld : [],
      }
  }
  readRestaurant_success = (obj) =>{
    if(this.state.length > obj.length){ //// some restaurant delete
      this.setState({dataSource:obj, dataObjShow:[], dataObjOld:[]})
      if(this.state.full == 0){ //// not open total
        for(var i=0;i<this.state.i;i++){
          this.state.dataObjShow.push(obj[i]);
        }
        if(this.state.i!=obj.length){
          var data = {
            mode : 'Loadmore'
          }
          this.state.dataObjShow.push(data);
        }
        else{
          this.setState({full:1})
        }
        var x = this.state.dataObjShow
        this.setState({dataObjShow:x,dataObjOld:x,length:obj.length})
      }
      else{ //// open total
        this.setState({i:0});
        for(var i=0;i<obj.length;i++){
          this.state.dataObjShow.push(obj[i]);
          this.setState({i:this.state.i+1})
        }
        var x = this.state.dataObjShow
        this.setState({dataObjShow:x,dataObjOld:x,length:obj.length})
      }
    }
    else{
      if(this.state.stateRead==1 && this.state.full==1){ //// use for have new restaurant
        if(this.state.length!=obj.length){
          var data = {
            mode : 'Loadmore'
          }
          this.state.dataObjShow.push(data);
          var x = this.state.dataObjShow
          this.setState({full:0,dataObjShow:x,dataObjOld:x})
        }
      }
      this.setState({dataSource:obj, length:obj.length});
      if(this.state.stateRead==0){
        var length = obj.length;
        if(obj.length>6)
          length = 6;
        for(var i=0;i<length;i++){
          this.state.dataObjShow.push(obj[i]);
          this.setState({i:this.state.i+1})
        }
        if(obj.length>6){
          var data = {
            mode : 'Loadmore'
          }
          this.state.dataObjShow.push(data);
        }
        else{
          this.setState({full:1})
        }
        var x = this.state.dataObjShow
        this.setState({stateRead:1,dataObjShow:x,dataObjOld:x})
      }
    }
  }
  changeLengthMessage = (text) =>{
    if(text.indexOf('\n')<20 && text.indexOf('\n')>-1){
      text = text.substring(0,text.indexOf('\n'))+'...';
    }
    if(text.length>=20){
      text = text.substring(0,20)+'...';
    }
    return text;
  }
  onPressLoadmore = ()=>{
    if(this.state.i < this.state.length){
      var length = this.state.length-this.state.i;
      if(length > 6)
        length = 6;
      for(var i=this.state.i;i<(length+this.state.i);i++){
        this.state.dataObjShow.splice(this.state.dataObjShow.length-1 ,0 ,this.state.dataSource[i]);
      }
      if(this.state.full == 0)
        if(length < 6){
          this.state.dataObjShow.pop();
          this.setState({full:1})
        }
      var x = this.state.dataObjShow;
      this.setState({i:this.state.i+length,dataObjShow:x,dataObjOld:x})
    }
  }
  SearchFilterFunction = (text) =>{
    if(text!=''){
      const newData = this.state.dataSource.filter(function(item) {
        const itemData = item.Name ? item.Name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({dataObjShow:newData});
    }
    else{
      this.setState({dataObjShow:this.state.dataObjOld});
    }
  }
  onAsyncRead=async ()=>{
    var account = await AsyncStorage.getItem('account_IMDEE');
    account = JSON.parse(account);

    database.readRestaurant(account.Email+':'+account.Phone, this.readRestaurant_success);
  }
  render() {
    const { btnCart, btnMess, btnRest} = this.props;
      return (
          <View style={{flex: 1,backgroundColor:'#151A20'}}>
            <View style={{flex:0.03}}/>
            <BackTab
              headTitle = 'ร้านอาหาร'
              iconCart = {true}
              iconChat = {true}
              btnCart = {btnCart}
              btnMess = {btnMess}
            />
            <SearchTab Func_Search={this.SearchFilterFunction}/>
            <View style={{flex:0.8,marginLeft:15,marginRight:15}}>
              <FlatList
                data = {this.state.dataObjShow}
                style={{marginTop:10}}
                renderItem = {({item}) =>
                  (item.mode=='Loadmore' && this.state.i!=this.state.length)
                  ? <View style={{justifyContent:'center',alignItems:'center',margin:25}}>
                      <TouchableOpacity style={{flexDirection:'row',padding:5,paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center',backgroundColor:'#31343D',borderRadius:100}} onPress={()=>this.onPressLoadmore()}>
                        <Foundation style={{paddingRight:5,color:'#ADADAD'}} name={'refresh'} size={20}/>
                        <Text style={{color:'#ADADAD',fontSize:15, fontFamily:'kanitRegular'}}>Load more</Text>
                      </TouchableOpacity>
                    </View>
                  : <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>btnRest(item)}>
                      <View style={{flexDirection:'row',padding:10,backgroundColor:'#31343D',borderRadius:10,marginBottom:15}}>
                        <Image source={{ uri: item.Logo+item.Token }} style={{ alignSelf:'center',width: 40, height:40, borderRadius:100,borderWidth:2,borderColor:'#C4C4C4'}}></Image>
                        <View style={{flex:1,marginLeft:10,height:'100%'}}>
                          <View style={{flex:0.3,flexDirection:'row'}}>
                            <View style={{flex:0.5,justifyContent:'center'}}>
                              <Text style={{fontSize:17,color:'#CECECE', fontFamily:'kanitSemiBold'}}>{item.Name}</Text>
                            </View>
                            <View style={{flex:0.5,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
                              <Text style={{fontSize:9,color:'#8C8C8C'}}></Text>
                            </View>
                          </View>
                          <View style={{flex:0.25,justifyContent:'center'}}>
                          </View>
                          <View style={{flex:0.45,justifyContent:'center'}}>
                            <Text style={{fontSize:15,color:'#8C8C8C', fontFamily:'kanitRegular'}}>{this.changeLengthMessage(item.Information)}</Text>
                          </View>
                        </View>
                        <View style={{alignItems:'center',justifyContent:'flex-end',flexDirection:'row',paddingTop:10,paddingBottom:10}}>
                          <MaterialIcons style={{color:'#D1D1D6'}} name={'navigate-next'} size={30}/>
                        </View>
                      </View>
                      {(false) ? <View style={{height:0.5,width:'95%',backgroundColor:'#6B6A6B'}}/> : <View/>}
                    </TouchableOpacity>
                  }
              />
            </View>
          </View>
        );
      }
    }
