import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    KeyboardAvoidingView,
    Alert,
    TextInput, 
    Modal,
    FlatList,
} from 'react-native';
import db from "../config";
import firebase from "firebase";
import { ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader'



export default class MyRecievedItems extends React.Component {
    constructor(){
        super()
        this.state = {
          userId:firebase.auth().currentUser.email,
          Recieved_Items : []
        }
      this.requestRef= null
      }
      
  MyRecievedItems=()=>{
   this.requestRef =  db.collection("Recieved_Items")
   .where("email_id","==",this.state.userId)
   .where("item_status","==","recieved")
    .onSnapshot((snapshot)=>{
      var Recieved_Items = snapshot.docs.map(document => document.data())
      this.setState({Recieved_Items:Recieved_Items})
    })
  }

  componentDidMount=()=>{
    this.MyRecievedItems();
  }
   
  keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return(
            <ListItem
                key={i}
                title={item.item}
                subtitle={item.item_status}
                titleStyle={{color:"black", fontWeight:"bold"}}
                rightElement={
                   <TouchableOpacity style={styles.button}>
                   <Text style={{color:'#ffff'}}>Recieved</Text>
                   </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }
  render(){
      return(
         <View style={{flex:1}}>
                <MyHeader title="Recieved Items" navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.Recieved_Items.length === 0 ? 
                        (
                            <View style={styles.subContainer}>
                                <Text style={{fontSize:20}}>List Of All Recieved Items</Text>
                            </View>
                        ) 
                        :(
                            <FlatList
                                data={this.state.Recieved_Items}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
      )
  }
}

const styles = StyleSheet.create({
    subContainer : {
        flex:1, 
        fontSize:20,
        justifyContent:"center",
        alignItems:"center"
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
      }
})