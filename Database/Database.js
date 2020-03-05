import * as firebase from "firebase";
import "@firebase/firestore";
import { AsyncStorage, Alert } from 'react-native';

const config = {
  apiKey: "AIzaSyAw8nAmR93uOPIND2E0QukW01S5DrrwRb4",
  authDomain: "imdee-a212d.firebaseapp.com",
  databaseURL: "https://imdee-a212d.firebaseio.com",
  projectId: "imdee-a212d",
  storageBucket: "imdee-a212d.appspot.com",
  messagingSenderId: "784464487189",
  appId: "1:784464487189:web:eb6a42fa3f45ce6933bf1c",
  measurementId: "G-356YRXK110"
};

const a_z = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9']

class Database{

  constructor()
  {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
          console.log("firebase apps initializeApp");
    } else {
        console.log("firebase apps already running...");
    }
  }

  async randomToken(success_callback)
  {
    var token = '';
    for(var i=0;i<32;i++){
      if(i==8 || i==12 || i==16 || i==20)
        token += '-';
      token += a_z[Math.floor(Math.random() * a_z.length)];
    }
    success_callback(token);
  }

  async sendNotification()
  {

  }

//////////////////////// ok ////////////////////////////////////////////////
  async readAllDataEveryTime(collection, success_callback)
  {
    firebase.firestore().collection("SE_Restaurant/IMDEE/"+collection).onSnapshot(
      snapshot => {
        var objData = [];
        snapshot.forEach(doc => {
          objData.push(doc.id);
        })
        success_callback(objData);
      });
  }
  async readWallet(idUser, success_callback){
    firebase.firestore().collection("SE_Restaurant/IMDEE/Wallet").doc(idUser).get().then(doc=>{
      if(doc.exists){
        firebase.firestore().collection("SE_Restaurant/IMDEE/Wallet/"+idUser+"/History").orderBy('Date').get().then(
          snapshot=>{
            var objHistory = [], moneyStr;
            snapshot.forEach(docs => {
              if(docs.data().Status==1) // amount Income
                moneyStr = '+ ฿ '+String(parseFloat(docs.data().Amount).toFixed(2));
              else if(docs.data().Status==0)
                moneyStr = '- ฿ '+String(parseFloat(docs.data().Amount).toFixed(2));
              var data = {
                Time : docs.data().Date.toDate().toLocaleString('th-TH',{timeZone:'Asia/Bangkok'}),
                Money : moneyStr
              }
              objHistory.push(data);
            });
            var data = {
              Money : doc.data().Money,
              Income : doc.data().Income,
              Expense : doc.data().Expense,
              History : objHistory.reverse()
            }
            success_callback(data)
        });
      }
    });
  }
  async readRestaurantUser(object, success_callback){
    firebase.firestore().collection("SE_Restaurant/IMDEE/Restaurant").doc(object.id).get().then(doc=>{
      var token = '';
      for(var i=0;i<32;i++){
        if(i==8 || i==12 || i==16 || i==20)
          token += '-';
        token += a_z[Math.floor(Math.random() * a_z.length)];
      }
      var mail = object.id.substring(0,object.id.indexOf('@'));
      var domain = object.id.substring(object.id.indexOf('@')+1,object.id.indexOf(':'));
      var phone = object.id.substring(object.id.indexOf(':')+1,object.id.length);

      if(doc.exists)
      {
        var newchat = {
          Name : object.Name,
          Message : object.Message,
          Time : object.Time,
          id : object.newchat_ID,
        }
        var restaurant = {
          id : object.id,
          restaurant : doc.data(),
          Logo : 'https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/Restaurant%2F'+mail+'%40'+domain+'%3A'+phone+'%2FLogo.jpg?alt=media&token='+token,
        }
        var objAll = {
          restaurants : restaurant,
          newchat : newchat,
          TimeSort : new Date(object.Time)
        }
        success_callback(objAll);
      }
      else
      {
        firebase.firestore().collection("SE_Restaurant/IMDEE/Phone").doc(phone).get().then(docs=>{
          if(docs.exists){
            var newchat = {
              Name : object.Name,
              Message : object.Message,
              Time : object.Time,
              id : object.newchat_ID,
            }
            var restaurant = {
              id : object.id,
              restaurant : docs.data(),
              Logo : 'https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/User%2F'+mail+'%40'+domain+'%3A'+phone+'.jpg?alt=media&token='+token,
            }
            var objAll = {
              restaurants : restaurant,
              newchat : newchat,
              TimeSort : new Date(object.Time)
            }
            success_callback(objAll);
          }
        });
      }
    });
  }
  async readNumCart(user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/').doc(user).get().then(doc=>{
      if(doc.exists)
      {
        success_callback(doc.data().Value);
      }
    });
  }
  async updateCart(user, objRestaurant, index, success_callback){
    var data = {
      Name : objRestaurant.allMenu[index].dataMenu.Name,
      Price : objRestaurant.allMenu[index].dataMenu.Price,
      State : objRestaurant.allMenu[index].dataMenu.State,
      Type : objRestaurant.allMenu[index].dataMenu.Type,
      Value : objRestaurant.allMenu[index].dataMenu.Value,
      image : objRestaurant.allMenu[index].image,
    }
    firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+user+'/AllRestaurant/'+objRestaurant.idRestaurant+'/AllMenu/').doc(objRestaurant.allMenu[index].idMenu).set(data)
    success_callback(objRestaurant)
  }
  async updateNumCart(user, value){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Cart').doc(user).update({Value:value});
  }
  async readCart(idUser){
    firebase.firestore().collection("SE_Restaurant/IMDEE/Cart").doc(idUser).get().then(async doc=>{
      if(doc.exists)
      {
        var myCart = [];
        await firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/"+idUser+"/AllRestaurant").get().then(snapshotRestaurant => {
            if (snapshotRestaurant.empty) return;
            snapshotRestaurant.forEach(async restaurant => {
              var total = 0, objMenu = [];
              await firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/"+idUser+"/AllRestaurant/"+restaurant.id+"/AllMenu").get().then(snapshotMenu => {
                  if (snapshotMenu.empty) return;
                  snapshotMenu.forEach(menu => {
                    var token = '';
                    for(var i=0;i<32;i++){
                      if(i==8 || i==12 || i==16 || i==20)
                        token += '-';
                      token += a_z[Math.floor(Math.random() * a_z.length)];
                    }
                    var data = {
                      image : menu.data().image,
                      token : token,
                      idMenu : menu.id,
                      dataMenu : {
                        Name : menu.data().Name,
                        Type : menu.data().Type,
                        Price : menu.data().Price,
                        Value : menu.data().Value,
                        State : menu.data().State,
                      }
                    }
                    objMenu.push(data);
                    total += menu.data().Price*menu.data().Value;
                  })
                });
                var token = '';
                for(var i=0;i<32;i++){
                  if(i==8 || i==12 || i==16 || i==20)
                    token += '-';
                  token += a_z[Math.floor(Math.random() * a_z.length)];
                }
                var restaurant = {
                  Logo : restaurant.data().image,
                  token : token,
                  idRestaurant : restaurant.id,
                  dataRestaurant : restaurant.data(),
                  allMenu : objMenu,
                  totalPrice : total
                }
                myCart.push(restaurant);
            });
          });
          setTimeout(async ()=>{
            if(myCart == []){
              firebase.firestore().collection("SE_Restaurant/IMDEE/Cart").doc(idUser).set({Value:0});
            }
            await AsyncStorage.setItem("myCart_IMDEE", JSON.stringify(myCart));
          },2000)
      }
    });
  }
  async addCart(user, restaurant, menu, success_callback){
    var restaurants = {
      image : restaurant.Logo,
      Address : restaurant.Address,
      Information : restaurant.Information,
      Name : restaurant.Name,
      Phone : restaurant.Phone,
    }
    firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/"+user+"/AllRestaurant/").doc(restaurant.ID).set(restaurants);
    var allValue = 0;
    firebase.firestore().collection("SE_Restaurant/IMDEE/Cart").doc(user).get().then(doc=>{
      if(doc.exists)
      {
        allValue = doc.data().Value;
      }
    });
    var objMenu;
    firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/"+user+"/AllRestaurant/"+restaurant.ID+"/AllMenu/").doc(menu.id).get().then(doc=>{
      if(doc.exists)
      {
        var value = doc.data().Value+1;
        firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/"+user+"/AllRestaurant/"+restaurant.ID+"/AllMenu/").doc(menu.id).update({Value:value});
        firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/").doc(user).set({Value:allValue+1});
      }else {
        var objMenu = {
          Value : 1,
          State : true,
          image : menu.image.substring(0,menu.image.length-36),
          Name : menu.menu.Name,
          Price : menu.menu.Price,
          Type : menu.menu.Type,
        }
        firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/"+user+"/AllRestaurant/"+restaurant.ID+"/AllMenu/").doc(menu.id).set(objMenu);
        firebase.firestore().collection("SE_Restaurant/IMDEE/Cart/").doc(user).set({Value:allValue+1});
      }
    });
    firebase.firestore().collection("SE_Restaurant/IMDEE/Restaurant/"+restaurant.ID+"/AllMenuCartCustomer/").doc(menu.id).set({text:''});
    firebase.firestore().collection("SE_Restaurant/IMDEE/Restaurant/"+restaurant.ID+"/AllMenuCartCustomer/"+menu.id+"/AllUser").doc(user).set({text:''});
    this.readCart(user);
    success_callback();
  }
  async deleteCart(user, restaurant, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+user+'/AllRestaurant/'+restaurant+'/AllMenu/').get().then(
      snapshot => {
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+user+'/AllRestaurant/'+restaurant+'/AllMenu/').doc(doc.id).delete();
          firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+restaurant+'/AllMenuCartCustomer/'+doc.id+'/AllUser/').doc(user).delete();
        })

      });
    firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+user+'/AllRestaurant/').doc(restaurant).delete();
    this.readCart(user);
    success_callback();
  }
  async readRestaurant(user,success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').onSnapshot(
      snapshot => {
        var objRestaurant = [], sortRestaurant=[], j=0, sortable = [];
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          if(doc.id != 'Add Restaurant' && doc.id != user){
            if(doc.data().ValueMenu > 0){
              var token = '';
              for(var i=0;i<32;i++){
                if(i==8 || i==12 || i==16 || i==20)
                  token += '-';
                token += a_z[Math.floor(Math.random() * a_z.length)];
              }
              var mail = doc.id.substring(0,doc.id.indexOf('@'));
              var domain = doc.id.substring(doc.id.indexOf('@')+1,doc.id.indexOf(':'));
              var phone = doc.id.substring(doc.id.indexOf(':')+1,doc.id.length);
              var data = {
                ID : doc.id,
                Logo : "https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/Restaurant%2F"+mail+"%40"+domain+"%3A"+phone+"%2FLogo.jpg?alt=media&token=",
                Token : token,
                Name : doc.data().Name,
                Information : doc.data().Information,
                Phone : doc.data().Phone,
                Address : doc.data().Address,
                mode : 'restaurant'
              }
              objRestaurant.push(data);
              sortable.push([j,doc.data().ID]);
              j++;
            }
          }
        })
        sortable.sort((function(a, b){
          return a[1] - b[1];
        }))
        for(var i=0; i<sortable.length; i++){
          sortRestaurant.push(objRestaurant[sortable[i][0]])
        }
        success_callback(sortRestaurant);
      });
  }
  async readNotify(user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Notify/'+user+'/AllInbox').orderBy('Date').onSnapshot(
      snapshot => {
        var objNotify = [];
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          var data = {
            ID : doc.id,
            Notify : doc.data(),
            Mode : 'Notify'
          }
          objNotify.push(data);
        })
        objNotify = objNotify.reverse();
        success_callback(objNotify);
      });
  }
  async readMyMenu(user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Menu').onSnapshot(
      snapshot => {
        var objMenu = [], sortMenu = [], sortable=[];
        var count = 0;
        var j=0;
        snapshot.forEach(doc => {
          var token = '';
          for(var i=0;i<32;i++){
            if(i==8 || i==12 || i==16 || i==20)
              token += '-';
            token += a_z[Math.floor(Math.random() * a_z.length)];
          }
          var mail = user.substring(0,user.indexOf('@'));
          var domain = user.substring(user.indexOf('@')+1,user.indexOf(':'));
          var phone = user.substring(user.indexOf(':')+1,user.length);
          var data = {
            id : doc.id,
            image : 'https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/Restaurant%2F'+mail+'%40'+domain+'%3A'+phone+'%2FMenu%2F'+doc.id+'.jpg?alt=media&token='+token,
            menu : doc.data()
          }
          objMenu.push(data);
          sortable.push([j,doc.data().ID]);
          j++;
          count += doc.data().Value;
        })
        sortable.sort((function(a, b){
          return a[1] - b[1];
        }))
        for(var i=0; i<sortable.length; i++){
          sortMenu.push(objMenu[sortable[i][0]])
        }
        success_callback(sortMenu);
      });
  }

  async readMyType(user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').onSnapshot(
      snapshot => {
        var objType = [], sortType = [], sortable=[];
        var count = 0;
        var i=0;
        snapshot.forEach(doc => {
          var data = {
            id : doc.id,
            type : doc.data()
          }
          objType.push(data);
          sortable.push([i,doc.data().ID]);
          i++;
          count += doc.data().Value;
        })
        sortable.sort((function(a, b){
          return a[1] - b[1];
        }))
        for(var i=0; i<sortable.length; i++){
          sortType.push(objType[sortable[i][0]])
        }
        if(sortType.length>1){
          var data = {
            id : '',
            type : {
              ID : -1,
              Name : 'สินค้าทั้งหมด',
              Value : count
            }
          }
          sortType.splice(0, 0, data);
        }
        success_callback(sortType);
      });
  }
  async readMessage(user, who, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Chat/'+user+'/AllChannel/'+who+'/AllMessage/').orderBy('Time').onSnapshot(
      snapshot => {
        var objChat=[], sort_objChat=[];
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          var data = {
            Message : doc.data().Message,
            Name : doc.data().Name,
            Time : doc.data().Time.toDate().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"})
          }
          objChat.push(data);
        })
        var data = {
          Message : '',
          Name : '',
          Time : new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"}),
        }
        objChat.splice(0, 0, data);
        success_callback(objChat);
      });
  }
  async addMessage(user, who, message){
    firebase.firestore().collection("SE_Restaurant/IMDEE/Chat").doc(user).set({text:''});
    firebase.firestore().collection('SE_Restaurant/IMDEE/Chat/'+user+'/AllChannel/'+who+'/AllMessage/').add(message).then((ref)=>{
      var data = {
        newChat_ID : ref.id,
        Message : message.Message,
        Time : message.Time,
        Name : message.Name
      }
      firebase.firestore().collection('SE_Restaurant/IMDEE/Chat/'+user+'/AllChannel/').doc(who).set(data);
    });

    firebase.firestore().collection("SE_Restaurant/IMDEE/Chat").doc(who).set({text:''});
    firebase.firestore().collection('SE_Restaurant/IMDEE/Chat/'+who+'/AllChannel/'+user+'/AllMessage/').add(message).then((ref)=>{
      var data = {
        newChat_ID : ref.id,
        Message : message.Message,
        Time : message.Time,
        Name : message.Name
      }
      firebase.firestore().collection('SE_Restaurant/IMDEE/Chat/'+who+'/AllChannel/').doc(user).set(data);
    });
  }

  async readListChat(user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Chat/'+user+'/AllChannel/').onSnapshot(
      snapshot => {
        var objListChat = [];
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          var data = {
            id : doc.id,
            newchat_ID : doc.data().newChat_ID,
            Message : doc.data().Message,
            Time : doc.data().Time.toDate().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"}),
            Name : doc.data().Name
          };
          objListChat.push(data);
        });
        success_callback(objListChat);
      });
  }
  async checkRestaurant(user){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).get().then(async doc=>{
      if(doc.exists)
      {
        var token = '';
        for(var i=0;i<32;i++){
          if(i==8 || i==12 || i==16 || i==20)
            token += '-';
          token += a_z[Math.floor(Math.random() * a_z.length)];
        }
        var mail = user.substring(0,user.indexOf('@'));
        var domain = user.substring(user.indexOf('@')+1,user.indexOf(':'));
        var phone = user.substring(user.indexOf(':')+1,user.length);
        var restaurant = {
          ImageMemory:'https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/Restaurant%2F'+mail+'%40'+domain+'%3A'+phone+'%2FLogo.jpg?alt=media&token='+token,
          Image:'https://firebasestorage.googleapis.com/v0/b/imdee-a212d.appspot.com/o/Restaurant%2F'+mail+'%40'+domain+'%3A'+phone+'%2FLogo.jpg?alt=media&token='+token,
          Name:doc.data().Name,
          Phone:doc.data().Phone,
          Address:doc.data().Address,
          Information:doc.data().Information,
        }
        await AsyncStorage.setItem("stateRestaurant_IMDEE", '1');
        await AsyncStorage.setItem("profileRestaurant_IMDEE", JSON.stringify(restaurant));
      }else {
        await AsyncStorage.setItem("stateRestaurant_IMDEE", '0');
        await AsyncStorage.setItem("profileRestaurant_IMDEE", '');
      }
    });
  }
  async saveRestaurant(restaurant, uri, user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).update({Name:restaurant.Name,Phone:restaurant.Phone,Address:restaurant.Address,Information:restaurant.Information});

    var metadata = {
      contentType: 'image/jpeg',
    };
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref('Restaurant/'+user+'/').child('Logo.jpg').put(blob, metadata);
    this.checkRestaurant(user);
    success_callback();
  }
  async addType(type, user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').add(type);
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').doc('Add Type').update({Add:type.ID+1, ID:type.ID+1}).then(success_callback());
  }

  async addMenu(menu, uri, user, objtype, old_objtype, index_old_type, idMenu, success_callback){
    if(index_old_type == -1){ // Add Menu
      firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Menu').add(menu).then(async (ref)=>{
        var metadata = {
          contentType: 'image/jpeg',
        };
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref('Restaurant/'+user+'/Menu/').child(ref.id+'.jpg').put(blob, metadata);
      });
      firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Menu').doc('Add Menu').update({Add:menu.ID+1, ID:menu.ID+1});

      firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).get().then(doc=>{
        if(doc.exists){
          firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).update({ValueMenu:doc.data().ValueMenu+1});
        }
      });
      firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').doc(objtype.id).update({Value:objtype.type.Value+1});
      success_callback();
    }
  }
  async deleteMenu(objmenu, user, objtype, state, success_callback){
    await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/AllMenuCartCustomer/'+objmenu.id+'/AllUser').get().then(snapshot=>{
      snapshot.forEach(async doc => {
        await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+doc.id+'/AllRestaurant/'+user+'/AllMenu').doc(objmenu.id).get().then(async docs=>{
          if(docs.exists){
            await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+doc.id+'/AllRestaurant/'+user+'/AllMenu').doc(objmenu.id).delete();
          }
        })
        await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/AllMenuCartCustomer/'+objmenu.id+'/AllUser').doc(doc.id).delete();
        await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+doc.id+'/AllRestaurant/'+user+'/AllMenu').get().then(snapshots=>{
            var count = 0, valueN=0;
            snapshots.forEach(docsss => {
              count++;
              valueN+=docsss.data().Value;
            });
            firebase.firestore().collection('SE_Restaurant/IMDEE/Cart').doc(doc.id).update({Value:valueN});
            if(count==0){
              firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+doc.id+'/AllRestaurant').doc(user).delete();
              firebase.firestore().collection('SE_Restaurant/IMDEE/Cart').doc(doc.id).update({Value:0});
            }
          });
      });
    });
    await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/AllMenuCartCustomer').doc(objmenu.id).delete();
    await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Menu').doc(objmenu.id).delete();
    await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').doc(objtype.id).update({Value:objtype.type.Value-1});
    await firebase.storage().ref('Restaurant/'+user+'/Menu/').child(objmenu.id+'.jpg').delete();
    if(state==1){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).get().then(doc=>{
        if(doc.exists){
            firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).update({ValueMenu:doc.data().ValueMenu-1});
        }
      });
    }
    if(success_callback!=undefined){
      success_callback(2);
    }
  }

  async deleteType(objtype, user, objmenu, success_callback){
    var count = 0;
    for(var i=0;i<objmenu.length;i++){
      if(objtype.type.Name==objmenu[i].menu.Type){
        this.deleteMenu(objmenu[i], user, objtype, 0);
        count += 1;
      }
    }
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).get().then(doc=>{
      if(doc.exists){
        firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).update({ValueMenu:doc.data().ValueMenu-count});
      }
    });
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').doc(objtype.id).delete();
    success_callback(1);
  }
  async uploadImage(ref, uri, imageName)
  {
    if(uri=='' || uri==null || uri==undefined){
      uri = "https://www.img.in.th/images/987fa234253fb2281a66a31ee839a528.jpg"; // Default Image
    }
    var metadata = {
      contentType: "image/jpeg",
    };
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref(ref).child(imageName+".jpg").put(blob, metadata);
  }
  async deleteImage(ref, imageName){
    firebase.storage().ref(ref).child(imageName+'.jpg').delete()
  }
  async createAccount(account, success_callback)
  {
    firebase.firestore().collection("SE_Restaurant/IMDEE/Email").doc(account.Email).set(account);
    firebase.firestore().collection("SE_Restaurant/IMDEE/Phone").doc(account.Phone).set(account);
    firebase.firestore().collection("SE_Restaurant/IMDEE/Bank").doc(account.CreditCard).set(account);
    var wallet = {
      Money : 0,
      Expense : 0,
      Income : 0
    }
    firebase.firestore().collection("SE_Restaurant/IMDEE/Wallet").doc(account.Email+':'+account.Phone).set(wallet);

    var address = {
      ID : 0,
      Information : '',
      Mode: "Add Address"
    }
    firebase.firestore().collection("SE_Restaurant/IMDEE/Address").doc(account.Email+':'+account.Phone).set({Default:''});
    firebase.firestore().collection("SE_Restaurant/IMDEE/Address/"+account.Email+':'+account.Phone+"/AllAddress").doc("Add Address").set(address);

    var cart = {
      Value : 0,
    }
    firebase.firestore().collection("SE_Restaurant/IMDEE/Cart").doc(account.Email+':'+account.Phone).set(cart);

    success_callback();
  }
  async createRestaurant(restaurant, uri, user, success_callback){
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).set(restaurant);
    var menu = {
      ID : 0,
      Add : 0,
      Name:'',
      Price:0,
      Type:''
    }
    var type1 = {
      ID : 0,
      Add : 0,
      Name:'อาหาร',
      Value:0
    }
    var type2 = {
      ID : 1,
      Add : 1,
      Name:'เครื่องดื่ม',
      Value:0
    }
    var type3 = {
      ID : 2,
      Add : 2,
      Name:'',
      Value:0
    }
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Menu').doc('Add Menu').set(menu);
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').add(type1);
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').add(type2);
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+user+'/Type').doc('Add Type').set(type3);
    var metadata = {
      contentType: 'image/jpeg',
    };
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref('Restaurant/'+user+'/').child('Logo.jpg').put(blob, metadata);
    this.checkRestaurant(user)
    success_callback();
  }

  async loginAccount(account, token_noti, success_callback, fail_callback)
  {
    var mode;
    if(account.Username.indexOf('@') == -1)
      mode = "Phone"; // login with phone
    else
      mode = "Email"; // login with email

    firebase.firestore().collection("SE_Restaurant/IMDEE/"+mode).doc(account.Username).get().then(doc=>{
      if(doc.exists){ // check have email/phone?
        if(doc.data().Password==account.Password){ // check pass = pass
          if(doc.data().StateLogin==0){ // check 1 id = 1 device
            firebase.firestore().collection("SE_Restaurant/IMDEE/Email").doc(doc.data().Email).update({StateLogin:1,NotificationToken:token_noti});
            firebase.firestore().collection("SE_Restaurant/IMDEE/Phone").doc(doc.data().Phone).update({StateLogin:1,NotificationToken:token_noti});
            var data = {
                CreditCard: doc.data().CreditCard,
                Email: doc.data().Email,
                Name: doc.data().Name,
                NotificationToken: token_noti,
                Password: doc.data().Password,
                Phone: doc.data().Phone,
                StateLogin: 1,
            }
            success_callback(data);
          }
          else
            fail_callback(3); /// not logout on other device
        }
        else
          fail_callback(2); /// password don't match
      }
      else
        fail_callback(1); /// No email/phone
    });
  }

  async logoutAccount(user, success_callback)
  {
    firebase.firestore().collection("SE_Restaurant/IMDEE/Email").doc(user.substring(0,user.indexOf(':'))).update({StateLogin:0,NotificationToken:''});
    firebase.firestore().collection("SE_Restaurant/IMDEE/Phone").doc(user.substring(user.indexOf(':')+1,user.length)).update({StateLogin:0,NotificationToken:''});
    success_callback(0);
  }

  async updateProfile(user, name, credit, success_callback){
    firebase.firestore().collection("SE_Restaurant/IMDEE/Email").doc(user.substring(0,user.indexOf(':'))).update({Name:name, CreditCard:credit});
    firebase.firestore().collection("SE_Restaurant/IMDEE/Phone").doc(user.substring(user.indexOf(':')+1,user.length)).update({Name:name, CreditCard:credit});
    firebase.firestore().collection("SE_Restaurant/IMDEE/Email").doc(user.substring(0,user.indexOf(':'))).get().then(doc=>{
      if(doc.exists)
      {
        success_callback(doc.data());
      }
    })
  }
  async checkQR_Payment(user,obj,success_callback,fail_callback){
    firebase.firestore().collection('BankClient').get().then(
      snapshot=>{
        var check=false;
        snapshot.forEach(doc => {
          var date1 = doc.data().Date.toDate().toLocaleString('th-TH',{timeZone:'Asia/Bangkok'})
          var date2 = obj.Date.toLocaleString('th-TH',{timeZone:'Asia/Bangkok'})
          if(date1 == date2 && Number(doc.data().Amount) == Number(obj.Amount) && doc.data().Type == obj.Type){
            if(doc.data().Type == 'SCB'){//check name
              var firstnameU = obj.Name.substring(0,obj.Name.indexOf(' ')).toUpperCase().trim();
              var lastnameU = obj.Name.substring(obj.Name.indexOf(' ')+1,obj.Name.length).toUpperCase().trim();
              var firstnameF = doc.data().Name.substring(0,doc.data().Name.indexOf(' ')).toUpperCase().trim();
              var lastnameF = doc.data().Name.substring(doc.data().Name.indexOf(' ')+1,doc.data().Name.length).toUpperCase().trim();
              var checkN1 = true, checkN2 = true;
              for(var i=0;i<firstnameF.length;i++){
                if(firstnameF[i] != firstnameU[i]){
                  checkN1 = false
                }
              }
              for(var i=0;i<lastnameF.length;i++){
                if(lastnameF[i] != lastnameU[i]){
                  checkN2 = false
                }
              }
              if(checkN1==true && checkN2==true){
                firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(user).get().then(docs=>{
                  if(docs.exists){
                    firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(user).update({Money:docs.data().Money+Number(doc.data().Amount), Income:docs.data().Income+Number(doc.data().Amount)});
                  }
                });
                var data = {
                  Amount : Number(doc.data().Amount),
                  Date : doc.data().Date,
                  Status : 1
                }
                firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet/'+user+'/History').add(data);
                firebase.firestore().collection('BankClient').doc(doc.id).delete();
                check = true;
                success_callback();
                return;
              }
            }
            else{ // check idcard
              if(obj.IDCard.substring(obj.IDCard.length-6,obj.IDCard.length) == doc.data().IDCard){
                firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(user).get().then(docs=>{
                  if(docs.exists){
                    firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(user).update({Money:docs.data().Money+Number(doc.data().Amount), Income:docs.data().Income+Number(doc.data().Amount)});
                  }
                });
                var data = {
                  Amount : Number(doc.data().Amount),
                  Date : doc.data().Date,
                  Status : 1
                }
                firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet/'+user+'/History').add(data);
                firebase.firestore().collection('BankClient').doc(doc.id).delete();
                check = true;
                success_callback();
                return;
              }
              else{
                check = true;
                fail_callback();
                return;
              }
            }
          }
        })
        if(check==false){
          fail_callback();
        }
    });
  }

    async addAddress(id, user, address, success_callback){
      if(id!=''){ // Edit address
        firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc(id).set(address).then(success_callback(1));
      }
      else{ // Add address
        firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc('Add Address').get().then(doc => {
          if(doc.exists){
            firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').add(address).then(ref=>{
              if(doc.data().ID==0){
                firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc(ref.id).update({State:1});
              }
              firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc(ref.id).update({ID:doc.data().ID});
            });
            firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc('Add Address').update({ID:doc.data().ID+1});
            success_callback(2);
          }
        });
      }
    }

    async readAddress(user, sendAddress){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').orderBy('ID').onSnapshot(
        snapshot => {
          var objAddress = [];
          snapshot.forEach(doc => {
            var data = {
              id : doc.id,
              address : doc.data()
            }
            objAddress.push(data)
          })
          sendAddress(objAddress);
        });
    }

    async changeDefaultAddress(user, id_new, id_old){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc(id_new).update({State:1});
      firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc(id_old).update({State:0});
      firebase.firestore().collection('SE_Restaurant/IMDEE/Address').doc(user).update({Default:id_new});
    }

    async readAddressCart(user, success_callback){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Address').doc(user).get().then(doc=>{
        if(doc.exists){
          if(doc.data().Default!=''){
            firebase.firestore().collection('SE_Restaurant/IMDEE/Address/'+user+'/AllAddress').doc(doc.data().Default).get().then(docs=>{
              success_callback(docs.data());
            });
          }
        }
      });
    }

    async checkMenu(idUser, objOrder, success_callback, fail_callback){
      var check = true;
      firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(objOrder.order.idRestaurant).get().then(doc=>{
        if(doc.exists){
          for(var i=0;i<objOrder.order.allMenu.length;i++){
            firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+doc.id+'/Menu').doc(objOrder.order.allMenu[i].idMenu).get().then(docs=>{
              if(docs.exists){
                // have menu not event
              }
              else{
                check = false;
                fail_callback();
                return;
              }
            });
          }
          if(check==false){
            return;
          }
        }
        else{
          check = false;
          fail_callback();
          return;
        }
        setTimeout(()=>{
          if(check==true){
            success_callback()
          }
        },1500)
      });
    }
    async checkMoney(idUser, idRestaurant, totalPrice, objOrder, objMenu, success_callback, fail_callback){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(idUser).get().then(async doc=>{
        if(doc.exists){
          if(totalPrice <= doc.data().Money){
            await firebase.firestore().collection('SE_Restaurant/IMDEE/Order').doc(idUser).set({Text:''});
            var reference_id;
            await firebase.firestore().collection('SE_Restaurant/IMDEE/Order/'+idUser+'/AllOrder').add(objOrder).then(async ref=>{
              reference_id = ref.id;
              for(var i=0;i<objMenu.length;i++){
                var data = {
                  Name : objMenu[i].dataMenu.Name,
                  Price :objMenu[i].dataMenu.Price,
                  Value :objMenu[i].dataMenu.Value,
                  Type :objMenu[i].dataMenu.Type,
                  ID_Menu : objMenu[i].idMenu
                }
                await firebase.firestore().collection('SE_Restaurant/IMDEE/Order/'+idUser+'/AllOrder/'+ref.id+'/AllMenu').add(data);
              }
            });
            await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+idRestaurant+'/AllOrder').doc(reference_id).set(objOrder).then(async ref=>{
              for(var i=0;i<objMenu.length;i++){
                var data = {
                  Name : objMenu[i].dataMenu.Name,
                  Price :objMenu[i].dataMenu.Price,
                  Value :objMenu[i].dataMenu.Value,
                  Type :objMenu[i].dataMenu.Type,
                  ID_Menu : objMenu[i].idMenu
                }
                await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+idRestaurant+'/AllMenuCartCustomer/'+objMenu[i].idMenu+'/AllUser').doc(idUser).delete();
                await firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant/'+idRestaurant+'/AllOrder/'+reference_id+'/AllMenu').add(data);
              }
            });
            await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+idUser+'/AllRestaurant/'+idRestaurant+'/AllMenu').get().then(async snapshots=>{
              var count=0;
              snapshots.forEach(async docs=>{
                count+=docs.data().Value;
                await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+idUser+'/AllRestaurant/'+idRestaurant+'/AllMenu').doc(docs.id).delete()
              })
              await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart').doc(idUser).get().then(docs=>{
                if(docs.exists){
                  firebase.firestore().collection('SE_Restaurant/IMDEE/Cart').doc(idUser).update({Value:docs.data().Value-count});
                }
              })
            })
            await success_callback();
            await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+idUser+'/AllRestaurant/'+idRestaurant+'/AllMenu').get().then(async snapshots=>{
              var count=0;
              snapshots.forEach(async docs=>{
                count++;
              })
              if(count==0){
                await firebase.firestore().collection('SE_Restaurant/IMDEE/Cart/'+idUser+'/AllRestaurant').doc(idRestaurant).delete();
              }
            })
            await this.paymentOrder(idUser, totalPrice);
            await this.sendNotification(idUser, 'ทำรายการสั่งซื้อสำเร็จแล้ว', 'รายการที่สั่งซื้อของคุณถูกส่งให้กับทางร้าน '+objOrder.NameRestaurant+' แล้ว \nระบบได้ทำการหักเงินจำนวน '+totalPrice+' บาทของคุณสำหรับรายการสินค้าแล้ว\nคุณสามารถตรวจสอบสถานะของคุณได้ที่รายการคำสั่งซื้อ')
            await this.sendNotification(idRestaurant, 'คุณได้รับรายการสั่งซื้อใหม่', 'คุณมีรายการสั่งซื้อใหม่จากคุณ '+objOrder.NameUser+' \nคุณสามารถตรวจสอบรายการสินค้าได้ที่ร้านค้าของคุณ')
          }
          else{
            fail_callback();
          }
        }
      });
    }
    async sendNotification(user, title, body){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Email').doc(user.substring(0,user.indexOf(':'))).get().then(doc=>{
        if(doc.exists){
          if(doc.data().NotificationToken != ''){
            firebase.firestore().collection('SE_Restaurant/IMDEE/Email/'+user.substring(0,user.indexOf(':'))+'/AllInbox').add({Title:title, Body:body}); // notify
          }
        }
      });
      var data = {
        Title : title,
        Body : body,
        Date : new Date(),
        Status : false,
      }
      firebase.firestore().collection('SE_Restaurant/IMDEE/Notify').doc(user).set({Text:''});
      firebase.firestore().collection('SE_Restaurant/IMDEE/Notify/'+user+'/AllInbox').add(data); // history
    }
    async updateStateNotify(user, idNotify){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Notify/'+user+'/AllInbox').doc(idNotify).update({Status:true});
    }
    async paymentOrder(idUser, totalPrice){
      firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(idUser).get().then(async doc=>{
        if(doc.exists){
          await firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(idUser).update({Money:doc.data().Money-totalPrice, Expense:doc.data().Expense+totalPrice});
          var data = {
            Amount : totalPrice,
            Date : new Date(),
            Status : 0,
          }
          await firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet/'+idUser+'/History').add(data);
          await firebase.firestore().collection('BankServer').doc('ADMIN').get().then(docs=>{
            if(docs.exists){
              firebase.firestore().collection('BankServer').doc('ADMIN').update({Money:docs.data().Money+totalPrice})
            }
          });
        }
      })
    }
    async readOrder(idUser, path, success_callback){
      firebase.firestore().collection('SE_Restaurant/IMDEE/'+path+'/'+idUser+'/AllOrder').orderBy('Time').onSnapshot(snapshot=>{
        var objOrder = [];
        snapshot.forEach(doc => {
          var data = {
            ID : doc.id,
            Order : doc.data(),
            Mode : 'Order'
          }
          objOrder.push(data);
        });
        objOrder = objOrder.reverse();
        success_callback(objOrder);
      });
    }
    async readMenuInOrder(idUser, idOrder, path, success_callback){
      firebase.firestore().collection('SE_Restaurant/IMDEE/'+path+'/'+idUser+'/AllOrder/'+idOrder+'/AllMenu').get().then(snapshot=>{
        var objMenu = [];
        snapshot.forEach(doc => {
          objMenu.push(doc.data());
        });
        success_callback(objMenu);
      });
    }
/////////////////////////// not ok ////////////////////////////
  async deleteUser(user, success_callback){
    this.deleteImage('User/', user);

    firebase.firestore().collection('SE_Restaurant/IMDEE/Email').doc(user.substring(0,user.indexOf(':'))).delete();
    firebase.firestore().collection('SE_Restaurant/IMDEE/Phone').doc(user.substring(user.indexOf(':')+1,user.length)).delete();
    firebase.firestore().collection('SE_Restaurant/IMDEE/Wallet').doc(user).delete();
    firebase.firestore().collection('SE_Restaurant/IMDEE/Address').doc(user).delete();
    firebase.firestore().collection('SE_Restaurant/IMDEE/Cart').doc(user).delete();
    firebase.firestore().collection('SE_Restaurant/IMDEE/Chat').doc(user).delete();
    firebase.firestore().collection('SE_Restaurant/IMDEE/Restaurant').doc(user).delete();
    success_callback(1);
  }
}
///////////////////////////////////////////

const database = new Database();
export default database;
