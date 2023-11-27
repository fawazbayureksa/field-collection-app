import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { Badge, Card, Divider } from 'react-native-paper';
import colors from '../assets/theme/colors';
import { styles } from '../assets/theme/styles';


type StackParamList = {
    tabName: any; // Assuming the tab names are strings, replace with the actual type
    onChangeTab: any; // Adjust the type based on how onChangeTab is used
    selectedTab: string | null; // Adjust the type based on how selectedTab is used
};
function Tabs({ tabName, onChangeTab, selectedTab }: StackParamList): JSX.Element {

    const WIDTH = Dimensions.get('window').width;

    return (
        <>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", maxHeight: 50, maxWidth: WIDTH, width: WIDTH, backgroundColor: "#FFFFFF" }}>
                <View>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    >
                        <Text
                            onPress={() => onChangeTab('semua', '')}
                            style={{
                                color: selectedTab === "semua" ? colors.primary : '#000',
                                fontWeight: selectedTab === "semua" ? '700' : '400',
                            }}
                        >
                            Semua
                        </Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 5, height: selectedTab == "semua" ? 3 : 2, backgroundColor: selectedTab == "semua" ? colors.primary : '#DCDCDC' }} />
                </View>
                {tabName?.map((item, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                            >
                                <Text
                                    onPress={() => onChangeTab(item.name, item.id)}
                                    style={{
                                        color: selectedTab === item.name ? colors?.primary : '#000',
                                        fontWeight: selectedTab === item.name ? '700' : '400',
                                    }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ marginVertical: 5, height: selectedTab == item.name ? 3 : 2, backgroundColor: selectedTab == item.name ? colors.primary : '#DCDCDC' }} />
                        </View>
                    );
                })
                }

            </ScrollView>
        </>
    )
}

export default Tabs;