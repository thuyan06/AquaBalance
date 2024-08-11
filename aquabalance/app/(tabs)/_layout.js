<<<<<<< HEAD
import { Slot, Tabs, Stack } from "expo-router" 
import { MaterialIcons } from '@expo/vector-icons';
 
export default function TabsLayout() { 
    return ( 
        <>
            <Tabs
            screenOptions={{
                tabBarHideOnKeyboard: true
            }}> 
                <Tabs.Screen 
                    name="home/index"
                    options={{ 
                        title: "Home", 
                        tabBarIcon: ({ color }) => ( 
                            <MaterialIcons name="home" size={30}/>
                        ), 
                    }}
                /> 
                <Tabs.Screen 
                    name="profile/index"
                    options={{ 
                        title: "Profile", 
                        tabBarIcon: ({ color }) => ( 
                            <MaterialIcons name="person" size={30} color="#000" />
                        ), 
                    }}
                /> 
                <Tabs.Screen 
                    name="history/index"
                    options={{ 
                        title: "History", 
                        tabBarIcon: ({ color }) => ( 
                            <MaterialIcons name="history" size={30} color="#000" />
                        ), 
                    }}
                /> 
            </Tabs>
        </>
=======
import { Slot, Tabs } from "expo-router" 
import { Text } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons" 
 
export default function TabsLayout() { 
    return ( 
        <Tabs> 
            <Tabs.Screen 
                name="home/index"
                options={{ 
                    title: "Home", 
                    tabBarIcon: ({ color }) => ( 
                        <Ionicons 
                            size={28} 
                            style={{ marginBottom: -3 }} 
                            name="home-outline" 
                            color={color} 
                        /> 
                    ), 
                }}
            /> 
            <Tabs.Screen 
                name="progress/index"
                options={{ 
                    title: "Progress", 
                    tabBarIcon: ({ color }) => ( 
                        <Ionicons 
                            size={28} 
                            style={{ marginBottom: -3 }} 
                            name="trending-up-outline" 
                            color={color} 
                        /> 
                    ), 
                }}
            /> 
            <Tabs.Screen 
                name="history/index"
                options={{ 
                    title: "History", 
                    tabBarIcon: ({ color }) => ( 
                        <Ionicons 
                            size={28} 
                            style={{ marginBottom: -3 }} 
                            name="clipboard-outline" 
                            color={color} 
                        /> 
                    ), 
                }}
            /> 
        </Tabs> 
>>>>>>> 76a6f8faa99d728825d7d3ba25dc005bbcdf649f
    ) 
} 