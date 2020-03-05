import * as React from 'react';

import SpashPage from '../Components/SpashPage.js';

import LoginPage from '../Components/LoginPage.js';
import RegisterPage from '../Components/RegisterPage.js';

import HomePage from '../Components/HomePage.js';

import AllCartPage from '../Components/AllCartPage.js';
import MessengerPage from '../Components/MessengerPage.js';
import RestaurantPage from '../Components/RestaurantPage.js';
import ProfilePage from '../Components/ProfilePage.js';
import MyOrderCustomerPage from '../Components/MyOrderCustomerPage.js';
import MyOrderMerchantPage from '../Components/MyOrderMerchantPage.js';
import MyShopEmptyPage from '../Components/MyShopEmptyPage.js';
import MyShopPage from '../Components/MyShopPage.js';
import ProfileRestaurantPage from '../Components/ProfileRestaurantPage.js';

import ChatPage from '../Components/ChatPage.js';
import CreateShopPage from '../Components/CreateShopPage.js';
import CreateMenuPage from '../Components/CreateMenuPage.js';
import MyShopNotEmptyPage from '../Components/MyShopNotEmptyPage.js';
import OrderSummaryPage from '../Components/OrderSummaryPage.js';
import StatusPage from '../Components/StatusPage.js';
import MyCartPage from '../Components/MyCartPage.js';
import AddressPage from '../Components/AddressPage.js';
import WalletPage from '../Components/WalletPage.js';
import DepositPage from '../Components/DepositPage.js';
import CreateAddressPage from '../Components/CreateAddressPage.js';


import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

const Login = createStackNavigator({
  LoginScreen:{screen:LoginPage,navigationOptions: {header: null}},
  RegisterScreen:{screen:RegisterPage,navigationOptions: {header: null}},
});

const TopTabRestaurant = createMaterialTopTabNavigator({
    MyShopScreen:{screen:MyShopPage,navigationOptions: {header: null, title:'เมนูร้าน'}},
    MyOrderMerchantScreen:{screen:MyOrderMerchantPage,navigationOptions: {header: null, title:'คำสั่งซื้อ'}},
    ProfileRestaurantScreen:{screen:ProfileRestaurantPage,navigationOptions: {header: null, title:'ข้อมูลร้าน'}},
},{
  tabBarOptions:{
    activeTintColor:'#FF2D55',
    inactiveTintColor:'#6B6A6B',
    showIcon : true,
    style: {backgroundColor: '#151A20',borderBottomColor:'#6B6A6B',borderBottomWidth:0.5},
    labelStyle:{fontSize:20, fontFamily:'kanitRegular'},
    indicatorStyle:{backgroundColor:'#FF2D55'},
  }
});

const Home = createStackNavigator({
  HomeScreen:{screen:HomePage,navigationOptions: {header: null}},
  AllCartScreen:{screen:AllCartPage,navigationOptions: {header: null}},
  MessengerScreen:{screen:MessengerPage,navigationOptions: {header: null}},
  RestaurantScreen:{screen:RestaurantPage,navigationOptions: {header: null}},
  ProfileScreen:{screen:ProfilePage,navigationOptions: {header: null}},
  MyOrderScreen:{screen:MyOrderCustomerPage,navigationOptions: {header: null}},
  MyShopScreen:{screen:TopTabRestaurant,navigationOptions: {header: null}},
  ChatScreen:{screen:ChatPage,navigationOptions: {header: null}},
  OrderSummaryScreen:{screen:OrderSummaryPage,navigationOptions: {header: null}},
  StatusScreen:{screen:StatusPage,navigationOptions: {header: null}},
  MyCartScreen:{screen:MyCartPage,navigationOptions: {header: null}},
  CreateMenuScreen:{screen:CreateMenuPage,navigationOptions: {header: null}},
  AddressScreen:{screen:AddressPage,navigationOptions: {header: null}},
  WalletScreen:{screen:WalletPage,navigationOptions: {header: null}},
  CreateAddressScreen:{screen:CreateAddressPage,navigationOptions:{header: null}},
})

const navigate = createSwitchNavigator({
  SpashScreen:{screen:SpashPage,navigationOptions: {header: null}},
  FirstScreen:{screen:Login,navigationOptions: {header: null}},
  SecondScreen:{screen:Home,navigationOptions: {header: null}},
  DepositScreen:{screen:DepositPage,navigationOptions:{header: null}},
});

export default createAppContainer(navigate);
