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
import convertDate, { convertDate2 } from '../../components/DateTimeFormat';
import TaskList from './TaskList';
import { ArrowRotateLeft, ArrowSwapHorizontal, Calendar, CloseCircle, SearchNormal1 } from 'iconsax-react-native';

type StackParamList = {
    Home: undefined;
    Details: { itemId: number };
};

interface Datatype {
    length: any;

}

function Tasks(): JSX.Element {

    const WIDTH = Dimensions.get('window').width * 0.9;

    const [data, setData] = useState<Array<any>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tabName, setTabName] = useState([{ name: 'Hari Ini', id: 'today' }, { name: 'Bayar Sebagian', id: 'partial' }, { name: 'Janji Bayar', id: 'promise_to_pay' }])
    // { name: 'Lunas', id: 'paid_off' }
    
    const [selectedTab, setSelectedTab] = useState("semua");
    const [id, setId] = useState();
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    // Filter
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);

    const onChangeTab = (name: any, id: any) => {
        setSelectedTab(name)
        setId(id)
    }

    const handleFilter = () => {
        hideDatePicker();
        hideDatePickerEnd();
        setModalVisible(!modalVisible);
        setIsFilter(!isFilter);
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
                style={{ backgroundColor: colors.white, flex: 1}}
            >
                <Tabs
                    selectedTab={selectedTab}
                    tabName={tabName}
                    onChangeTab={onChangeTab}
                />

                <TaskList 
                    id={id} 
                    isFilter={isFilter} 
                    startDate={startDate}
                    endDate={endDate}
                />
                  
            </ScrollView>
            <FloatingButton
                style={{
                    position: 'absolute',
                    bottom: 30,
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
                <View style={[styles.centeredView, { marginHorizontal: 20}]}>
                    <View style={[styles.modalView, { width: WIDTH, backgroundColor:colors.accent }]}>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right:5,
                                    padding: 5,
                                    height: 30,
                                    borderRadius: 10,
                                }}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <CloseCircle size="24" color={colors.white} variant="Outline"/>
                            </TouchableOpacity>
                        {/* <View style={{ flexDirection: "row", justifyContent: "center",marginTop:10 }}> */}
                            {/* <Text style={{ fontSize: 18, fontWeight: "600",color:colors.white }}>Modal Filter</Text> */}
                        {/* </View> */}
                        <View style={{flexDirection:"row",marginVertical:20,alignItems:"center"}}>
                                <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} onPress={showDatePicker}>
                                     <Calendar size="40" color={colors.white} variant='Bold'/>
                                     <View style={{backgroundColor:colors.white,borderRadius:5,padding:5}}>
                                        <Text  style={{ fontSize: 14, color: colors.accent }}>Mulai</Text>
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                mode="date"
                                                onConfirm={(date) => handleConfirm(date, 'startDate')}
                                                onCancel={hideDatePicker}
                                            />
                                            <Divider />
                                            <Text style={{ color:colors.accent,fontWeight:"600" }}>
                                                {convertDate2(startDate)}
                                            </Text>
                                     </View>
                                </TouchableOpacity>
                                <View style={{marginHorizontal:10}}>
                                    <ArrowSwapHorizontal size="20" color="#FFFFFF" variant="Outline"/>
                                </View>
                                <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} onPress={() => setDatePickerVisibilityEnd(!isDatePickerVisibleEnd)}>
                                     <Calendar size="32" color={colors.white} variant='Bold'/>
                                     <View style={{backgroundColor:colors.white,borderRadius:5,padding:5}}>
                                        <Text  style={{ fontSize: 14, color: colors.accent }}>Akhir</Text>
                                     <DateTimePickerModal
                                        isVisible={isDatePickerVisibleEnd}
                                        mode="date"
                                        onConfirm={(date) => handleConfirm(date, 'endDate')}
                                        onCancel={hideDatePickerEnd}
                                    />
                                     <Divider />
                                    <Text style={{ color:colors.accent,fontWeight:"600" }}>
                                        {convertDate2(endDate)}
                                    </Text>
                                     </View>
                                </TouchableOpacity>
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
                                    backgroundColor: colors.white,
                                    flexDirection:"row"
                                }}
                                onPress={handleFilter}>
                                    <SearchNormal1 size="14" color={colors.accent} variant="Outline" />
                                <Text style={{ fontSize: 14, color: colors.accent }}>Cari</Text>
                            </Pressable>
                            <Pressable
                                style={{
                                    padding: 5,
                                    width: 80,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 30,
                                    borderRadius: 10,
                                    marginLeft: 20,
                                    backgroundColor: colors.danger,
                                    flexDirection:"row"
                                }}
                                onPress={() => { setIsFilter(false); setModalVisible(!modalVisible) }}>
                                    <ArrowRotateLeft size="14" color={colors.white}/>
                                <Text style={{ fontSize: 12, color: colors.white }}>Reset</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default Tasks;