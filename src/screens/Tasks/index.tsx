import React, { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Image, Modal, Alert, Pressable } from 'react-native';
import colors from '../../assets/theme/colors';
import { Card, Button, Avatar, IconButton, Divider } from 'react-native-paper';
import { styles } from '../../assets/theme/styles';
import CardTask from '../../components/CardTask';
import Tabs from '../../components/Tab';
import axiosInstance from '../../components/AxiosInstance';
import FloatingButton from '../../components/FloatingButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import convertDate from '../../components/DateTimeFormat';

type StackParamList = {
    Home: undefined;
    Details: { itemId: number };
};

interface Datatype {
    length: any;

}

function Tasks(): JSX.Element {

    const WIDTH = Dimensions.get('window').width * 0.9;

    const [data, setData] = useState<Datatype | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [tabName, setTabName] = useState([{ name: 'Hari Ini', id: 'today' }, { name: 'Bayar Sebagian', id: 'partial' }, { name: 'Janji Bayar', id: 'promise_to_pay' }, { name: 'Lunas', id: 'paid_off' }])
    const [selectedTab, setSelectedTab] = useState("semua");
    const [id, setId] = useState();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    // Filter

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);
    const [open, setOpen] = useState(false)
    const [openEndDate, setOpenEndDate] = useState(false)


    useEffect(() => {
        getTasks("false");
    }, [id])

    const onChangeTab = (name: any, id: any) => {
        setSelectedTab(name)
        setId(id)
    }

    const getTasks = (filter: string) => {
        setIsLoading(true);
        let params = {
            is_type: id,
            filter: filter,
            entry_start_date: startDate,
            entry_end_date: endDate,
        }


        axiosInstance.get('my-tasks-filter', { params })
            .then(res => {
                setData(res.data.data)
            }).catch(error => {
                console.error('get error my tasks filter', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }


    const handleFilter = () => {
        hideDatePicker();
        hideDatePickerEnd();
        setModalVisible(!modalVisible);
        getTasks("true");
    };

    const handleConfirm = (date: any, type: string) => {
        if (type == 'startDate') {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const hideDatePickerEnd = () => {
        setDatePickerVisibilityEnd(false);
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    return (
        <>
            <ScrollView
                stickyHeaderIndices={[0]}
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                style={{ backgroundColor: colors.white, flex: 1, minHeight: "100%" }}
            >
                <Tabs
                    selectedTab={selectedTab}
                    tabName={tabName}
                    onChangeTab={onChangeTab}
                />
                <View style={{ flex: 1, alignItems: "center" }}>
                    {isLoading ?
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                        :
                        <>
                            {data?.length > 0 ?

                                <CardTask data={data} />

                                :
                                <View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                    <Image source={require('../../assets/images/empty.png')} style={{ width: 300, maxHeight: 300 }} />
                                    <Text style={[styles.fs14, { color: colors.dark }]}>Tidak Ada Data!</Text>
                                </View>
                            }
                        </>
                    }
                </View>
            </ScrollView>
            <FloatingButton
                style={{
                    position: 'absolute',
                    bottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    left: 0,
                    right: 0,
                }}
                onPress={() => setModalVisible(!modalVisible)}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={[styles.centeredView, { marginHorizontal: 20 }]}>
                    <View style={[styles.modalView, { width: WIDTH }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: 14, fontWeight: "700", marginRight: WIDTH * 0.3 }}>Modal Filter</Text>
                            <Pressable
                                style={{
                                    padding: 5,
                                    width: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 25,
                                    borderRadius: 10,
                                    backgroundColor: colors.approved,
                                }}
                                onPress={() => { getTasks("false"); setModalVisible(!modalVisible) }}>
                                <Text style={{ fontSize: 12, color: colors.white }}>Reset</Text>
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity style={{
                                padding: 5, backgroundColor: colors.white, width: WIDTH * 0.3,
                                borderRadius: 10,
                                marginTop: 5,
                                marginRight: 10,
                                borderWidth: 1,
                            }}
                                onPress={showDatePicker}
                            >
                                <Text style={[{ fontSize: 12, color: colors.dark }]}>
                                    Tanggal Mulai
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={(date) => handleConfirm(date, 'startDate')}
                                onCancel={hideDatePicker}
                            />
                            <Text style={{ color: colors.dark, }}>
                                {convertDate(startDate)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity style={{
                                padding: 5, backgroundColor: colors.white, width: WIDTH * 0.3,
                                borderRadius: 10,
                                marginTop: 5,
                                marginRight: 10,
                                borderWidth: 1,
                            }}
                                onPress={() => setDatePickerVisibilityEnd(!isDatePickerVisibleEnd)}
                            >
                                <Text style={[{ fontSize: 12, color: colors.dark }]}>
                                    Tanggal Akhir
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisibleEnd}
                                mode="date"
                                onConfirm={(date) => handleConfirm(date, 'endDate')}
                                onCancel={hideDatePickerEnd}
                            />
                            <Text style={{ color: colors.dark, }}>
                                {convertDate(endDate)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row-reverse", marginTop: 20 }}>
                            <Pressable
                                style={{
                                    padding: 5,
                                    width: 80,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 30,
                                    borderRadius: 10,
                                    marginLeft: 20,
                                    backgroundColor: colors.accent_primary,
                                }}
                                onPress={handleFilter}>
                                <Text style={{ fontSize: 14, color: colors.white }}>Cari</Text>
                            </Pressable>
                            <Pressable
                                style={{
                                    padding: 5,
                                    width: 80,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 30,
                                    borderRadius: 10,
                                    backgroundColor: colors.grey,
                                }}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={{ fontSize: 14, color: colors.white }}>Tutup</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default Tasks;