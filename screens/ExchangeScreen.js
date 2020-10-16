import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
  } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'


export default class HomeScreen extends React.Component{
 constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            item:"",
            description:"",

            isExchangeRequestActive:'',
             
            requestedItemName:'',
            ItemStatus:'',
            ItemValue:'',

            requestId:'',
            userDocId:'',
            docId:'',
        }
    }

          getisExchangeRequestActive=()=>{
          db.collection('users').where("email_id","==",this.state.userId)
          .onSnapshot(querySnapshot=>{
           querySnapshot.forEach(doc=>{
            this.setState({
            isExchangeRequestActive:doc.data().isExchangeRequestActive,
            userDocId:doc.id,

            })
        })
          }
          )
      }
      
       getItemRequest=()=>{
           db.collection('Recieved_Items').where("email_id","==",this.state.userId)
           .onSnapshot(
               querySnapshot=>{
                   querySnapshot.forEach(doc=>{
                       this.setState({
                           requestId:doc.data().request_id,
                           requestedItemName:doc.data().item_name,
                           ItemStatus:doc.data().item_status,
                           docId:doc.id,
                       })
                   })
               }
           )
       }

       getData(){
         fetch("http://data.fixer.io/api/latest?access_key=e698abf69c885d37e4a0133745ddc581&format=1")
         .then(response=>{
           return response.json()
         }).then(responseData=>{
           var currencyCode = this.state.currencyCode
           var currency = responseData.rates.INR
           var value = 69/currency
           console.log(value)
         })
       }

      componentDidMount=()=>{
        this.getisExchangeRequestActive();
        this.getItemRequest();
      }

      RecievedItems=(ItemName)=>{
        var userId= this.state.userId
        var requestId = this.state.requestId
       db.collection("Recieved_Items").add({
        "user_Id":userId,
        "item_name":ItemName,
        "request_id":requestId,
        "item_status":"recieved",
       })
      }

      updateItemRequestStatus=()=>{
        db.collection("Recieved_Items").doc(this.state.docId).update({
            item_status:"recieved",
        })

        db.collection("users").where("email_id","==",this.state.userId)
        .onSnapshot(
            querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    db.collection("users").doc(doc.id).update({
                        isExchangeRequestActive:false
                    })
                })
            }
        )
      }

      sendNotification=()=>{
          db.collection("users").where("email_id","==",this.state.userId)
          .onSnapshot(
              querySnapshot=>{
                  querySnapshot.forEach(doc=>{
                      var name = doc.data().first_name
                      var lastName = doc.data().last_name

              db.collection("all_notifications")
                .where("request_id","==",this.state.requestId)
                   .onSnapshot(
                      querySnapshot=>{
                        querySnapshot.forEach(doc=>{
                           var donorId = doc.data().donor_id
                           var ItemName = ItemName
                db.collection('all_notifications').add({
                  "targeted_userId":donorId,
                  "message":name + " " + lastName + "recieved the book" + bookName,
                  "notification_status":"unread",
                  "item_name":ItemName,
                })

                          })
                        }
                      )
                  })
              }
          )
      }
   
    createUniqueId=()=>{
        return Math.random().toString(36).substring(7)
    }

    addRequest = ()=>{
        var uniqueId = this.createUniqueId();
         var userId = this.state.userId
        db.collection("requests").add({
            "userId":userId,
            "item" : this.state.item,
            "description" : this.state.description ,
            "Exchange_Id":uniqueId,
             "Item_Status":'Recieved',
            "date":firebase.firestore.FieldValue.serverTimestamp(),
            "value":this.state.ItemValue
        });

    this.setState({
        item :'',
        description : '',
        isExchangeRequestActive:true,
        value:''
    })

        return(alert("item added"));
    }

   render(){

    if(this.state.isExchangeRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Item Name</Text>
          <Text>{this.state.requestedItemName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Item Status </Text>

          <Text>{this.state.ItemStatus}</Text>
          </View>

           <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Item Value </Text>
          <Text>{this.state.ItemValue}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateItemRequestStatus();
            this.receivedItems(this.state.requestedItemName)
          }}>
          <Text>I recieved the book </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter Item name"}
                onChangeText={(text)=>{
                    this.setState({
                        item:text
                    })
                }}
                value={this.state.item}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Description the book"}
                onChangeText ={(text)=>{
                    this.setState({
                       description:text
                    })
                }}
                value ={this.state.description}
              />

               <TextInput
               style={styles.formTextInput}
               placeholder="value"
               onChangeText={(text)=>{
                 this.setState({
                   ItemValue:text
                 })
               }}
               value={this.state.ItemValue}
               />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.bookName,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
   }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"50%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"15%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )
  