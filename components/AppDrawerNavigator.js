import React from 'react';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { DrawerItems , createDrawerNavigator } from 'react-navigation-drawer';
import {Icon} from 'react-native-elements'
import customSideBarMenu from './customSideBarMenu'
import { BottomNavigator } from './BottomNavigator';
import  settings  from './settings';

import LoginScreen from '../screens/LoginScreen'
import MyBarters from '../screens/MyBarters'
import NotificationScreen from '../screens/NotificationScreen'
import MyRecievedItems from '../screens/MyRecievedItems'

export const AppDrawerNavigator = createDrawerNavigator(
 {
   Home:{screen:BottomNavigator},
   Settings:{screen:settings},
   MyBarters:{screen:MyBarters},
   RecievedItems:{screen:MyRecievedItems},
   Notification:{screen:NotificationScreen},
 },
 {
        contentComponent: customSideBarMenu
    },
    {
        initialRouteName : "Home"
    }
 )