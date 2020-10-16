import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {SwipeListView} from 'react-native-swipe-list-view'
import { ListItem,Icon } from 'react-native-elements'
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'


export default class SwipableFlatListView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            allNotifications:this.props.allNotifications
        }
    }

    updateMarkAsRead=(notification)=>{
     db.collection("all_notifications").doc(notification.doc_id).update({
         "notification_status":"read"
     })
    }

    onChangeSwipeValue=(swipeData)=>{
      var allNotifications = this.state.allNotifications
      const {key,value} = swipeData
      if (value<-Dimensions.get('window').width) {
          const newData = [...this.state.allNotifications]
          const preIndex = allNotifications.findItem((item)=>{
             this.updateMarkAsRead(allNotifications[preIndex])
             newData.splice(preIndex,1)
             this.setState({allNotifications:newData})
          })
      }
    }

       renderItem=(data)=>{
         <Animated.View>
          <ListItem 
       title={data.item.book_name}
       titleStyle={{color:"black" ,fontWeight:"bold" , }}
       subtitle={data.item.message}
       leftComponent={
       <Icon name="book" type="font-awesome" color="#696969" />
       }
       bottomDivider
          />
         </Animated.View>
       }
      
    renderHiddenItem=()=>{
     <View style={styles.rowBack}>
      <View style={[styles.backTextWhite,styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}></Text>
      </View>
     </View>
    }

    render(){
        return(
            <View>
            <SwipeListView
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get('window').width}
            previewRowKey={0}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipeValueChange={onChangeSwipeValue()}
            />
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
container: { backgroundColor: 'white', flex: 1, },
 backTextWhite: { color: '#FFF', fontWeight:'bold', fontSize:15 }, 
 rowBack: { alignItems: 'center', backgroundColor: '#29b6f6', flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, },
 backRightBtn: { alignItems: 'center', bottom: 0, justifyContent: 'center', position: 'absolute', top: 0, width: 100, },
 backRightBtnRight: { backgroundColor: '#29b6f6', right: 0, }, 
 });