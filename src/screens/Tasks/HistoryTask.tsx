import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, Text, View,TouchableOpacity, Image, RefreshControl, Animated, Easing,ImageProps } from 'react-native'
import colors from '../../assets/theme/colors';
import { styles } from '../../assets/theme/styles';
import {  Setting4, Setting5 } from 'iconsax-react-native';
import CardHistoryTask from '../../components/CardHistoryTask';
import axiosInstance from '../../components/AxiosInstance';
import { Skeleton } from '../../components/Skeleton';

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

    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        getHistoryRemarks()
    },[]);


    
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
            page:1,
            per_page:3
        }
        axiosInstance.get('history-remarks',{params})
            .then(res => {
                if (res.data.status === 'success') {
                    // setData(res.data.data.slice(0, 3))
                    setData(res.data.data)
                    console.log(res.data.data)
                }
            }).catch(error => {
                console.error('get error my history remark', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
                }}>
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
                data.length > 0 ?
                    data.map((value:any) => (
                        <CardHistoryTask item={value} handlePress={() => showModal(value.id)} />
                    )) 
                :
                <View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                    <Image source={require('../../assets/images/empty.png')} style={{ width: 150, maxHeight: 150 }} />
                    <Text>Tidak Ada Data</Text>
                </View>
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
                                width:200,
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
                                    width:200,
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
    </>
  )
}

export default HistoryTask