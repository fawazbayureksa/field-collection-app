import React, { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../assets/theme/colors';
import { Card, Button, Avatar, IconButton, Divider } from 'react-native-paper';
import { styles } from '../../assets/theme/styles';
import CardTask from '../../components/CardTask';
import Tabs from '../../components/Tab';
import axiosInstance from '../../components/AxiosInstance';
import CurrencyFormat from '../../components/CurrencyFormat';
import convertDate from '../../components/DateTimeFormat';
import { MainRouteName } from '../../constants/mainRouteName';
import { navigationRef } from '../../navigations/RootNavigations';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast, { InfoToast } from 'react-native-toast-message';

type DetailTaskProps = {
    route: any; // Add data prop here
    Detail: {
        id: string; // Adjust the type based on the actual type of your id
    };
};

interface DataProps {
    id: number;
    order_id: any;
    name: string;
    phone_number: number;
    province: string;
    city: string;
    district: string;
    subdistrict: string;
    address: string;
    contract_amount: any;
    due_amount: any;
    date_disbursement: any;
    days_overdue: any;
    expired_date: Date;
}

function DetailTask({ route }: DetailTaskProps): JSX.Element {

    const WIDTH = Dimensions.get('window').width * 0.9;
    const navigation = useNavigation<any>();
    const [data, setData] = useState<DataProps | undefined>();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getDetailOrder()
    }, []);


    const getDetailOrder = () => {
        setLoading(true)
        axiosInstance
            .get(`detail-task/${route.params.id}`)
            .then(res => {
                setData(res.data.data)
            }).catch(error => {
                console.error('error getDetail: ', error.response);
            }).finally(() => {
                setLoading(false);
            });
    }

    const copyToClipboard = (phone: any) => {
        Clipboard.setString('+62' + phone);
        Toast.show({
            type: 'success',
            text1: 'Notifikasi',
            text2: 'Salin nomor telepon berhasil'
        });
    };



    return (<>
        {loading ?
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
            :
            <ScrollView style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginBottom: 10

                }}
                >
                    <Text style={[styles.fs14, {
                        fontWeight: "700",
                        color: colors.dark
                    }]}>
                        Informasi Peminjam
                    </Text>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col3}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Order ID
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {data?.order_id}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col3}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Nama
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {data?.name}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col3}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                No Telepon
                            </Text>
                        </View>
                        <View style={[styles.col9, { flexDirection: "row", alignItems: "center" }]}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {data?.phone_number}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.primary,
                                    marginLeft: 2,
                                    paddingHorizontal: 5,
                                    borderRadius: 5,
                                    elevation: 2
                                }}
                                onPress={() => copyToClipboard(data?.phone_number)}
                            >
                                <Text style={[styles.fs10, { color: colors.white }]}>
                                    Salin
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col3}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Alamat
                            </Text>
                        </View>
                        <View style={styles.col9}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {data?.province},{data?.city},{data?.district},{data?.subdistrict},{data?.address}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: 10,
                    paddingVertical: 10

                }}
                >
                    <Text style={[styles.fs14, {
                        fontWeight: "700",
                        color: colors.dark
                    }]}>
                        Rincian Pinjaman
                    </Text>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col4}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                jumlah Tagihan
                            </Text>
                        </View>
                        <View style={styles.col8}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Rp{CurrencyFormat(data?.contract_amount)}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col4}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Total Pinjaman
                            </Text>
                        </View>
                        <View style={styles.col8}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Rp{CurrencyFormat(data?.due_amount)}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col4}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Tanggal Menerima Pinjaman
                            </Text>
                        </View>
                        <View style={[styles.col8]}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {convertDate(data?.date_disbursement)}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col4}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Total Hari Keterlambatan
                            </Text>
                        </View>
                        <View style={styles.col8}>
                            <Text style={[[styles.fs12, { color: colors.dark }], { color: colors.bg_screen1 }]}>
                                {data?.days_overdue} Hari
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={styles.col4}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                Tanggal Jatuh Tempo
                            </Text>
                        </View>
                        <View style={styles.col8}>
                            <Text style={[styles.fs12, { color: colors.dark }]}>
                                {convertDate(data?.expired_date)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity style={{
                        height: 40,
                        width: WIDTH,
                        backgroundColor: colors.primary,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10
                    }}
                        onPress={() => navigation.navigate(MainRouteName.REMARK_TASK, {
                            id: data?.id,
                            name: data?.name,
                            phone_number: data?.phone_number,
                            address: `${data?.province} ${data?.city}, ${data?.district}, ${data?.subdistrict}, ${data?.address}`,
                            due_amount: data?.due_amount
                        })}
                    >
                        <Text style={[styles.fs16, { color: colors.white }]}>Remark</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        }
    </>
    )
}

export default DetailTask;