import React, { useEffect, useState } from 'react'
import colors from '../../assets/theme/colors';
import { ActivityIndicator, Dimensions, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CardTask from '../../components/CardTask';
import { styles } from '../../assets/theme/styles';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../constants/mainRouteName';
import { Divider } from 'react-native-paper';
import convertDate from '../../components/DateTimeFormat';
import CurrencyFormat from '../../components/CurrencyFormat';
import axiosInstance from '../../components/AxiosInstance';

type props = {
    id: any;
    isFilter:boolean;
    endDate:any;
    startDate:any;
};

const TaskList: React.FC<props> = ({id,isFilter,endDate,startDate}) => {
    const WIDTH = Dimensions.get('window').width * 0.9;
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = React.useState(false);

    const [data, setData] = React.useState<Array<any>>([]);

    const [isLoadMore, setIsLoadMore] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
        getTasks(isFilter);
    }, [id,isFilter])


    const getTasks = (isFilter: any) => {
        setIsLoading(true);
        let params = {
            is_type: id,
            filter: isFilter ? "true" : "false",
            entry_start_date: startDate,
            entry_end_date: endDate,
            page: 1,
            per_page: 5,
        }

        axiosInstance.get('my-tasks-filter', { params })
            .then(res => {
                setData(res.data.data)
                setCurrentPage(res.data.pagination.currentPage);
                setLastPage(res.data.pagination.totalPages);
            }).catch(error => {
                console.error('get error my tasks filter', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const _renderItem = (item:any,index:number) => (
        <TouchableOpacity style={{
            backgroundColor: colors.white,
            height: 135,
            marginHorizontal:20,
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
            })
        }
        key={item.id}
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
    )

    const renderFooter = () => {
        return (
            <>
                {isLoadMore && (
                    <ActivityIndicator
                        color={colors.accent_primary}
                        size={'large'}
                        style={{ padding: 10 }}
                    />
                )}
            </>
        );
    };

    const handlePagination = async () => {
        let filter = {
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
            .get(`my-tasks-filter`, { params })
            .then(res => {
                const newList = data.concat(res.data.data);
                setData(newList);
                setCurrentPage(newPage);
            }).finally(() => setIsLoadMore(false));
    }
    };

  return (
    <>
        {isLoading ?
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
            :
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
                            marginVertical: 10
                        }}>
                            <Image source={require('../../assets/images/empty.png')} style={{ width: 300, maxHeight: 300 }} />
                            <Text>Tidak Ada Data</Text>
                        </View>
                    )}
                />
            </ScrollView>
            }
        </>
    )}


export default TaskList;