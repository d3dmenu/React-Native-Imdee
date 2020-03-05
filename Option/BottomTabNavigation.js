import React from 'react';
import { TouchableOpacity, View } from 'react-native';

function createBottomTab(lengthTab,dataIcon,dataText,dataMode,dataFunction,dataBorderColor){
  var dataSource = [];
  for(var i=0;i<lengthTab;i++){
    var data;
    if(dataMode[i]=='TouchableOpacity'){
      data = <TouchableOpacity style={{flex:1,width:'100%',borderColor:'#151A20',borderTopColor:'#6B6A6B',borderWidth:0.5,justifyContent:'center',alignItems:'center'}} onPress={dataFunction[i]}>
               {dataIcon[i]}
               {dataText[i]}
             </TouchableOpacity>
    }
    else{
      data = <View style={{flex:1,borderColor:'#151A20',borderTopColor:dataBorderColor[i],borderWidth:1,justifyContent:'center',alignItems:'center'}}>
               {dataIcon[i]}
               {dataText[i]}
             </View>
    }
    dataSource.push(data);
  }
  return dataSource;
}
const BottomTabNavigation = ({lengthTab,dataIcon,dataText,dataMode,dataFunction,dataBorderColor}) => (
  <View style={{flex:0.09,flexDirection:'row'}}>
    {createBottomTab(lengthTab,dataIcon,dataText,dataMode,dataFunction,dataBorderColor)}
  </View>
);
export default BottomTabNavigation
