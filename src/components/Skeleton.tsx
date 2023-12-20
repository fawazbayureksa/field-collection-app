import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from 'react-native';


interface Props  {
    width:number;
    height:number;
}

export const Skeleton: React.FC<Props> = ({width,height}) => {
   const opacity = useRef(new Animated.Value(0.3));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current,{
                    toValue:1,
                    useNativeDriver:true,
                    duration:500,
                }),
                Animated.timing(opacity.current,{
                    toValue:0.3,
                    useNativeDriver:true,
                    duration:800,
                })
            ])
        ).start();
    }, [opacity]);


   return (
    <>
         <Animated.View style={[{opacity:opacity.current, height, width,borderRadius:10,marginBottom:10},styleSkeleton.Skeleton]}>
            <View style={{position:"relative",top:10,marginHorizontal:10}} >
                <Animated.View style={[{opacity:opacity.current, height:30, width:"100%",borderRadius:3,backgroundColor:"#ddd",marginBottom:5}]} />
                <Animated.View style={[{opacity:opacity.current, height:10, width:"100%",borderRadius:3,backgroundColor:"#ddd",marginBottom:5}]} />
                <Animated.View style={[{opacity:opacity.current, height:20, width:"100%",borderRadius:3,backgroundColor:"#ddd",marginBottom:5}]} />
                <Animated.View style={[{opacity:opacity.current, height:10, width:"100%",borderRadius:3,backgroundColor:"#ddd",marginBottom:5}]} />
                <Animated.View style={[{opacity:opacity.current, height:20, width:"100%",borderRadius:3,backgroundColor:"#ddd",marginBottom:5}]} />
            </View>
         </Animated.View>
    </>
   )
};

const styleSkeleton = StyleSheet.create({
    Skeleton:{
        backgroundColor:"#eeeeee",
    }
})