import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, Text, View,TouchableOpacity, Image, RefreshControl, Animated, Easing,ImageProps, Modal, Pressable, FlatList } from 'react-native'
import colors from '../../assets/theme/colors';
import { styles } from '../../assets/theme/styles';
import {  ArrowRotateLeft, ArrowSwapHorizontal, Calendar, CloseCircle, SearchNormal1, Setting4, Setting5 } from 'iconsax-react-native';
import CardHistoryTask from '../../components/CardHistoryTask';
import axiosInstance from '../../components/AxiosInstance';
import { Skeleton } from '../../components/Skeleton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';
import { convertDate2 } from '../../components/DateTimeFormat';
import { Picker } from '@react-native-picker/picker';

type Props = {}

// interface ImagesProps {
//     payment_proof: string,
//     visit_proof:string
// }
interface ImagesProps {
    [key: string]: any;
  }
  
function HistoryTask({}: Props) {
    const WIDTH = Dimensions.get('window').width * 0.95;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>([]);
    const [modalUp, setModalUp] = useState(false);
    const [images, setImages] = useState<ImagesProps | undefined>();

    // Filter
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [type,setType] = useState("");

    const [isLoadMore, setIsLoadMore] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
 
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        getHistoryRemarks()
    },[type]);


    
      const showModal = (id:number) => {
        getImageData(id);
      };
    
      const hideModal = () => {
        setImages({});
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }).start(() => setModalUp(false));
      };
    
    const getHistoryRemarks = () => {
        setLoading(true);

        let params = {
            is_type: type ? type : 'all',
            filter: isFilter ? "true" : "false",
            entry_start_date: startDate,
            entry_end_date: endDate,
            page:1,
            per_page:10
        }
        axiosInstance.get('history-remarks',{params})
            .then(res => {
                if (res.data.status === 'success') {
                    setData(res.data.data)
                    setCurrentPage(res.data.pagination.currentPage);
                    setLastPage(res.data.pagination.totalPages);
                }
            }).catch(error => {
                console.error('error get my history remark', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleFilter = () => {
        hideDatePicker();
        hideDatePickerEnd();
        setModalVisible(!modalVisible);
        setIsFilter(!isFilter);
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

    const handleConfirm = (date: any, type: string) => {
        if (type == 'startDate') {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const handlePagination = async () => {
        let filter = {
            is_type: type ? type : 'all',
            page: 1,
            per_page: 5,
            filter: isFilter ? "true" : "false",
            entry_start_date: startDate,
            entry_end_date: endDate,
        }
        
        let newPage = currentPage + 1;

        if (newPage > lastPage) {
            return;
        } else if (isLoadMore) {
            return;
        } else {
            let params = {
                ...filter,
                page: newPage
            };
            setIsLoadMore(true);
        await axiosInstance
            .get(`history-remarks`, { params })
            .then(res => {
                const newList = data.concat(res.data.data);
                setData(newList);
                setCurrentPage(newPage);
            }).finally(() => setIsLoadMore(false));
    }
    };

    const getImageData = (id:number) => {
        axiosInstance.get(`getImage/${id}`)
            .then((res : any) => {
            if (res.data.status === 'success') {
                    setImages(res.data.data);
                    setModalUp(true);
                    Animated.timing(translateY, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                    }).start();
                }
            }).catch((err :any) => {
                console.log('error get image proof',err);
            }).finally(() => {
            });
    }

    const refreshControl = () => {
        getHistoryRemarks();
    }

    const _renderItem = (value:any,index:number) => (
        <CardHistoryTask item={value} handlePress={() => showModal(value.id)} />
    )

    const renderFooter = () => {
        return (
            <>
                {isLoadMore && (
                      <View style={{
                        alignItems: "center",
                        marginHorizontal: 20,
                        marginVertical: 10
                    }}>{
                    [3,2,1].map((item) => (
                        <Skeleton width={WIDTH} height={135} bgColor='#eeeeee' key={item} />
                    ))}
                    </View>
                )}
            </>
        );
    };

  return (
    <>
    <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        refreshControl={
            <RefreshControl
                refreshing={loading}
                onRefresh={refreshControl}
            />
        }
    >
            <View style={{flex:1,flexDirection:"row",marginHorizontal:10,justifyContent:"flex-end"}}>
              <TouchableOpacity style={{
                    backgroundColor: colors.white,
                    height: 30,
                    width: WIDTH * 0.2,
                    elevation: 5,
                    marginRight: 5,
                    borderRadius: 2,
                    marginVertical: 5,
                    padding: 5,
                    justifyContent: "center",
                    alignItems:"center",
                    flexDirection:"row"
                }}>
                    <Setting4
                        size="12"
                        color={colors.dark}
                        variant="Bold"
                    />
                    <Text style={[styles.fs12,]}>Sort</Text>
                </TouchableOpacity>
              <TouchableOpacity style={{
                    backgroundColor: colors.white,
                    height: 30,
                    width: WIDTH * 0.2,
                    elevation: 5,
                    marginRight: 5,
                    borderRadius: 2,
                    marginVertical: 5,
                    padding: 5,
                    justifyContent: "center",
                    alignItems:"center",
                    flexDirection:"row"
                }}
                onPress={() => setModalVisible(!modalVisible)}
                >
                    <Setting5
                        size="12"
                        color={colors.dark}
                        variant="Bold"
                    />
                    <Text style={[styles.fs12,{marginLeft:5}]}>Filter</Text>
                </TouchableOpacity>
            </View>

            {loading ?
            <View style={{
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginVertical: 10
                }}>
                { 
                    [5,4,3,2,1].map((item,index) => (
                        <View key={index}>
                            <Skeleton width={WIDTH} height={135} bgColor={colors.white} />
                        </View>
                    ))}
                </View>
                :
                // data.length > 0 ?
                //     data.map((value:any) => (
                //         <View key={value.id}>
                //             <CardHistoryTask item={value} handlePress={() => showModal(value.id)} />
                //         </View>
                //     )) 
                // :
                // <View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                //     <Image source={require('../../assets/images/empty.png')} style={{ width: 150, maxHeight: 150 }} />
                //     <Text>Tidak Ada Data</Text>
                // </View>
                <ScrollView>
                <FlatList
                    nestedScrollEnabled={true}
                    data={data}
                    renderItem={({ item, index }) => _renderItem(item, index)}
                    keyExtractor={({ item }) => item?.id}
                    onEndReached={() => handlePagination()}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={() => ( 
                        <View style={{
                            alignItems: "center",
                            marginHorizontal: 20,
                            marginVertical: 200
                        }}>
                            <Image source={require('../../assets/images/empty.png')} style={{ width: 150, maxHeight: 150 }} />
                            <Text>Tidak Ada Data</Text>
                        </View>
                    )}
                />
            </ScrollView>
            }
    </ScrollView>
    {(modalUp && images) &&
            <Animated.View style={{
                transform: [
                    {
                      translateY: translateY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [180, 0],
                      }),
                    },
                  ],
                backgroundColor:"#fff",
                height:WIDTH * 0.8, 
                borderTopEndRadius:30,
                borderTopStartRadius:30,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 1, 
            }}
            >
                <TouchableOpacity style={{alignItems:"center"}} onPress={() => hideModal()}>
                    <View style={{borderWidth:3,borderColor:colors.grey_900,width:80,marginTop:5,borderRadius:10}} ></View>
                </TouchableOpacity>
                <View style={{flex:1,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>
                    <TouchableOpacity
                        style={{
                            justifyContent:"center",
                            alignItems:"center",
                        }}
                    >
                        {(images.visit_proof != null) &&
                        <Image
                            style={{
                                width:WIDTH * 0.4,
                                height:200,
                                resizeMode: 'contain',
                                marginBottom: 10,
                            }}
                            source={{uri:images?.visit_proof}}
                        />
                        }
                         <Text style={{color:colors.danger,marginLeft:5}}>Bukti Kunjungan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            justifyContent:"center",
                            alignItems:"center",
                        }}
                    >
                         {(images.payment_proof != null) &&
                            <Image
                                style={{
                                    width:WIDTH * 0.4,
                                    height: 200,
                                    resizeMode: 'contain',
                                    marginBottom: 10,
                                }}
                                source={{uri:images?.payment_proof}}
                            />
                        }
                        
                        <Text style={{color:colors.danger,marginLeft:5}}>Bukti Pembayaran</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        }
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
                        
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center",marginVertical:10 }}>
                            <View>
                                <Picker
                                    selectedValue={type}
                                    onValueChange={(value) => setType(value)}
                                    style={[styles.inputRemark,{color :colors.white}]}
                                    mode="dropdown"
                                    numberOfLines={5}
                                    dropdownIconColor={colors.white} dropdownIconRippleColor={colors.white}
                                >
                                    <Picker.Item label="Pilih Status" value="" />
                                    <Picker.Item label="Lunas" value="paid_off" />
                                    <Picker.Item label="Janji Bayar (Tidak Kooperatif)" value="promise_to_pay" />
                                    <Picker.Item label="Janji Bayar (Kooperatif)" value="promise_to_pay_cooperative" />
                                    <Picker.Item label="Bayar Sebagian" value="partial" />
                                    <Picker.Item label="Permintaan Keringanan" value="payment_relief" />
                                    <Picker.Item label="Gagal Bayar" value="failed_payment" />
                                    <Picker.Item label="Titip Surat" value="leave_letter" />
                                </Picker>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",marginVertical:20,alignItems:"center"}}>
                                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}} onPress={showDatePicker}>
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
                                    <ArrowSwapHorizontal size="30" color="#FFFFFF" variant="Bold"/>
                                </View>
                                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}} onPress={() => setDatePickerVisibilityEnd(!isDatePickerVisibleEnd)}>
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
                                    <Calendar size="40" color={colors.white} variant='Bold'/>
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
                                    backgroundColor: colors.white,
                                    flexDirection:"row"
                                }}
                                onPress={() => { setIsFilter(false); setModalVisible(!modalVisible);setType('') }}>
                                    <ArrowRotateLeft size="14" color={colors.danger}/>
                                <Text style={{ fontSize: 14, color: colors.danger }}>Reset</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
        </Modal>
    </>
  )
}

export default HistoryTask