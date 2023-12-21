import React, { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import colors from '../../assets/theme/colors';
import { Card, Divider } from 'react-native-paper';
import { styles } from '../../assets/theme/styles';
import CardTask from '../../components/CardTask';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MainRouteName } from '../../constants/mainRouteName';
import { useSelector } from 'react-redux';
import axiosInstance from '../../components/AxiosInstance';
import { Skeleton } from '../../components/Skeleton';

interface DataProps {
    task_running: number;
    task_done: number;
};


function HomeScreen(): JSX.Element {


    const [userData, setUserData] = useState<any>(useSelector<any>(state => state.authReducer.user));
    const isLoggedIn = useSelector<any>(state => state.authReducer.isLoggedIn);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const [dashboard, setDashboard] = useState<DataProps | undefined>(undefined);

    useEffect(() => {
        handleLogout();
        getTasks();
        getDashboard();

    }, [isLoggedIn])

    const WIDTH = Dimensions.get('window').width * 0.9;

    const navigation = useNavigation<any>();

    const handleListTasks = () => {
        navigation.navigate(MainRouteName.TASK_LIST);
    }

    const handleLogout = () => {
        if (isLoggedIn == false) {
            navigation.navigate(MainRouteName.LOGIN);
        }
    }

    const getTasks = () => {
        setIsLoading(true);

        let params = {
            page:1,
            per_page:3
        }
        axiosInstance.get('my-tasks',{params})
            .then(res => {
                if (res.data.status === 'success') {
                    // setData(res.data.data.slice(0, 3))
                    setData(res.data.data)
                }
            }).catch(error => {
                console.error('get error my tasks', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    const getDashboard = () => {
        setLoading(true);

        axiosInstance.get('get-dashboard')
            .then(res => {
                setDashboard(res.data.data)
            }).catch(error => {
                console.error('get error dashboard', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const refreshControl = () => {
        getTasks();
        getDashboard();
    }

    return (
        <>
            <ScrollView style={{ backgroundColor: colors.white }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refreshControl}
                    />
                }
            >
                <View style={{ paddingHorizontal: 0 }}>
                    <View style={{
                        paddingHorizontal: 10,
                        backgroundColor: colors.primary,
                        paddingBottom: 30,
                        borderBottomEndRadius: 20,
                        borderBottomStartRadius: 20
                    }}>
                        <View style={{
                            flex: 1,
                            justifyContent: "space-between",
                            flexDirection: "row",
                            marginVertical: 10,
                            marginHorizontal: 10,
                            alignItems: "center",
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 18, color: colors.white, fontWeight: "700" }}>
                                    Selamat Datang !
                                </Text>
                                <Image source={require('../../assets/images/leona-1.png')} style={{ width: 30, height: 30 }} />
                            </View>
                            <Text style={{ color: colors.white }}>
                                {JSON.parse(userData)?.name}
                            </Text>
                        </View>
                        <Divider />
                        <Card style={{ marginVertical: 10, backgroundColor: colors.white }}>
                            <Card.Actions
                                style={{
                                    width: WIDTH,
                                    marginHorizontal: 10,
                                    height: 60,
                                }}
                            >
                                <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                    <Text style={{ color: colors.text }}>
                                        Jumlah Tugas Berjalan
                                    </Text>
                                    <Text style={{ color: colors.text }}>
                                        {dashboard?.task_running}
                                    </Text>
                                </View>
                            </Card.Actions>
                        </Card>
                        <Card style={{
                            backgroundColor: colors.white,
                        }}>
                            <Card.Actions
                                style={{
                                    width: WIDTH,
                                    marginHorizontal: 10,
                                    height: 60,
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}>
                                    <Text style={{ color: colors.bg_screen1 }}>
                                        Jumlah Tugas Selesai
                                    </Text>
                                    <Text style={{ color: colors.bg_screen1 }}>
                                        {dashboard?.task_done}
                                    </Text>
                                </View>
                            </Card.Actions>
                        </Card>

                    </View>
                    <View style={{ marginVertical: 10, alignItems: "center", marginTop: -20 }}>
                        <TouchableOpacity style={{
                            height: 40,
                            width: WIDTH * 0.5,
                            padding: 10,
                            borderWidth: 1, // Add a border
                            borderStyle: "solid",
                            borderColor: colors.primary,
                            backgroundColor: colors.white,
                            borderRadius: 10,
                            alignItems: "center",
                        }}
                            onPress={() => handleListTasks()}
                        >
                            <Text style={[styles.fs12, { color: colors.primary }]}>Tugas Saya</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                        {isLoading ?
                                [3,2,1].map((item,index) => (
                                    <View key={index}>
                                    <Skeleton width={WIDTH} height={135}/>
                                    </View>
                                ))
                            // <ActivityIndicator size="large" color={colors.primary} />
                            :
                            <>
                                {data?.length > 0 ?
                                    <CardTask data={data} />
                                    :
                                    <View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                        <Image source={require('../../assets/images/empty.png')} style={{ width: 150, maxHeight: 150 }} />
                                        <Text>Tidak Ada Data</Text>
                                    </View>
                                }
                            </>
                        }
                    </View>
                </View>
            </ScrollView>
        </>
    );
}


export default HomeScreen;