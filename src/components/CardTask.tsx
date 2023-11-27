import React from 'react';
import { Dimensions, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Badge, Divider } from 'react-native-paper';
import colors from '../assets/theme/colors';
import { styles } from '../assets/theme/styles';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../constants/mainRouteName';
import convertDate from './DateTimeFormat';
import CurrencyFormat from './CurrencyFormat';

type CardTaskProps = {
    data: any; // Add data prop here
};


const CardTask: React.FC<CardTaskProps> = ({ data }) => {

    const WIDTH = Dimensions.get('window').width * 0.95;
    const navigation = useNavigation<any>()
    return (
        <>
            {data?.map((item: any, index: number) => (
                <TouchableOpacity style={{
                    backgroundColor: colors.white,
                    height: 135,
                    width: WIDTH,
                    borderStyle: "solid",
                    borderColor: colors.line,
                    elevation: 5,
                    borderRadius: 10,
                    marginVertical: 10,
                    padding: 10,
                    justifyContent: "center",
                }}
                    onPress={() => navigation.navigate(MainRouteName.DETAIL_TASK, {
                        id: item.order_id
                    })}
                    key={index}
                >
                    <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row" }}>
                        <View>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                +62 {item.phone_number}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ backgroundColor: colors.danger, borderRadius: 10, fontSize: 10, padding: 5, color: colors.white }}>{item?.days_overdue} Hari</Text>
                        </View>
                        <View>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {item?.order_id}
                            </Text>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {convertDate(item.expired_date)}
                            </Text>
                        </View>
                    </View>
                    <Divider />
                    <View >
                        <Text style={[styles.fs14, { color: colors.dark, fontWeight: "bold" }]}>
                            {item.province},
                            {item.city},
                            {item.district},
                            {item.subdistrict},
                            {item.address},
                        </Text>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 3
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Total Pinjaman :
                            </Text>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {/* Rp.1,100,000 */}
                                {CurrencyFormat(item.due_amount)}
                            </Text>
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <TouchableOpacity style={{
                                height: 30,
                                width: WIDTH * 0.3,
                                backgroundColor: colors.primary,
                                borderRadius: 50,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                                onPress={() => navigation.navigate(MainRouteName.REMARK_TASK, {
                                    id: item.id,
                                    name: item.name,
                                    phone_number: item.phone_number,
                                    address: `${item.province} ${item.city}, ${item.district}, ${item.subdistrict}, ${item.address}`,
                                    due_amount: item.due_amount
                                }
                                )}
                            >
                                <Text style={[styles.fs12, { color: colors.white }]}>Remark</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    );
}


export default CardTask;