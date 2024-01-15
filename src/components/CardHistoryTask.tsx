import React from 'react';
import { Dimensions, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Badge, Divider } from 'react-native-paper';
import colors from '../assets/theme/colors';
import { styles } from '../assets/theme/styles';
import {convertDateTime} from './DateTimeFormat';
import convertDate from './DateTimeFormat';
import CurrencyFormat from './CurrencyFormat';
import { typeRemarks } from '../constants/typeRemarks';

type CardHsitoryTaskProps = {
    item: any; 
    handlePress : () => void;
};


const CardHistoryTask: React.FC<CardHsitoryTaskProps> = ({ item,handlePress }) => {

    const remarks = typeRemarks(item.type);

    const WIDTH = Dimensions.get('window').width * 0.95;
    return (
                
            <TouchableOpacity style={{
                backgroundColor: colors.white,
                height: "auto",
                width: WIDTH,
                borderStyle: "solid",
                borderColor: colors.line,
                elevation: 5,
                borderRadius: 10,
                marginBottom: 10,
                marginHorizontal: 10,
                padding: 10,
                // justifyContent: "center",
            }}
            key={item.id}
            onPress={handlePress}
            >
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <View>
                        <View style={{ flexDirection: "row",alignItems:"center",marginVertical:2}}>
                                <Text style={{ fontSize: 12}}>
                                    Order ID 
                                </Text>
                                <View style={{marginLeft:2}}>
                                    <Text style={[styles.fs12, { color: colors.dark,marginLeft:10,fontWeight:"600" }]}>
                                    : {item.order_id}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    <View style={{ flexDirection: "row"}}>
                        <Text style={[styles.fs12, { color: colors.dark }]}>
                            Waktu : 
                        </Text>
                        <Text style={[styles.fs12, { color: colors.dark,marginLeft:5,fontWeight:"600" }]}>
                            {convertDateTime(item.created_at)}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: "row",alignItems:"center"}}>
                        <View style={styles.col6}>
                        <Text style={{ fontSize: 12, fontWeight:"700"}}>
                            Tipe :
                        </Text>
                        </View>
                        <View style={[styles.col9,{alignItems:"flex-start"}]}>
                            <Text style={{ backgroundColor: remarks?.color, borderRadius: 5, fontSize: 12, padding: 3, color: colors.white,fontWeight:"600",textDecorationStyle:"double" }}>
                                {remarks?.text}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <View style={styles.col6}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                               No Telepon (Terbaru)
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark,fontWeight:"700" }]}>
                                {item.update_phone_number ?? 'Tidak Ada'}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <View style={styles.col6}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Alamat
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark,fontWeight:"700" }]}>
                                {item.is_address ? "Sesuai" : "Tidak Sesuai"}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <View style={styles.col6}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Jumlah Bayar
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark,fontWeight:"700" }]}>
                            Rp{CurrencyFormat(item.payment_amount)}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <View style={styles.col6}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Janji Bayar
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark,fontWeight:"700" }]}>
                                { item.ptp_date ? convertDate(item.ptp_date) : "-"}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <View style={styles.col6}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Catatan
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                { item.message}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
    );
}
export default CardHistoryTask;