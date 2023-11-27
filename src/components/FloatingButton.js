import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '../assets/theme/colors';

export default function FloatingButton(props) {
    return (
        <TouchableOpacity onPress={props.onPress} style={props.style}>
            <View
                style={{
                    borderColor: colors.accent_primary,
                    borderWidth: 2,
                    width: 125,
                    height: 35,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',

                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 2,
                        height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3.84,
                    elevation: 3,
                    flexDirection: 'row',
                    backgroundColor: colors.white,
                    paddingHorizontal: 30,
                }}>
                {/* <Icon name="tune" size={20} color="#fff" /> */}
                <Text style={{ color: colors.dark, fontWeight: '500', marginLeft: 5 }}>
                    Filter
                </Text>
            </View>
        </TouchableOpacity>
    );
}
