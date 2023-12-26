import React, { useState } from 'react'
import { ScrollView, Text, View, TouchableOpacity, TextInput, Image, Button, Dimensions } from 'react-native'
import colors from '../../assets/theme/colors';
import { styles } from '../../assets/theme/styles';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Upload from '../../components/Upload';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import convertDate from '../../components/DateTimeFormat';
import axiosInstance from '../../components/AxiosInstance';
import { navigate } from '../../navigations/RootNavigations';
import { useNavigation } from '@react-navigation/native';
import { MainRouteName } from '../../constants/mainRouteName';
import Toast, { InfoToast } from 'react-native-toast-message';
import IsEmpty from '../../components/IsEmpty';

type Props = {}

type routeProps = {
    route: any; // Add data prop here
};

export default function RemarkTask({ route }: routeProps): JSX.Element {

    let form = {
        task_id: route.params.id,
        type: '',
        phoneNumber: '',
        isAddress: '',
        paymentAmount: '',
        ptpDate:'',
        paymentProof: null,
        visitProof: null,
        message: '',
    }


    const [formData, setFormData] = useState(form);
    const [loading, setLoading] = useState(false);
    const WIDTH = Dimensions.get('window').width * 0.9;

    const navigation = useNavigation<any>()

    const handleSubmit = () => {

      if(IsEmpty(formData.type) || IsEmpty(formData.isAddress) || IsEmpty(formData.visitProof)){
        Toast.show({
            type: 'error',
            text1: 'Notifikasi',
            text2: 'Lengkapi data!'
        });
        return
      }

    //   console.log(formData);
    //   return

        axiosInstance.post('remark-task', { formData })
            .then((response) => {
                if (response.data.status == 'success') {
                    navigation.navigate(MainRouteName.HOME_NAVIGATOR);
                    Toast.show({
                        type: 'success',
                        text1: 'Notifikasi',
                        text2: 'Remark data berhasil!'
                    });
                }
            }).catch((error: any) => {
                console.log(error, 'Error Remark data');
            });
    };

    const [selectedImageProofPayment, setSelectedImageProofPayment] = useState<string | null>(null);
    const [selectedImageProofVisit, setSelectedImageProofVisit] = useState<string | null>(null);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
        // console.warn("A date has been picked: ", date);
        setFormData({ ...formData, ptpDate: date });
        hideDatePicker();
    };

    const handleUploadPhoto = (response: any, type: string) => {
        setLoading(true);
        const formDataImage = new FormData();
        if (response) {
            const tempPhoto = {
                uri: response?.assets[0]?.uri,
                type: response?.assets[0]?.type,
                name: response?.assets[0]?.fileName,
            };

            formDataImage.append('file', tempPhoto);

            Upload.post(`upload/image`, formDataImage).
                then((response: any) => {

                    if (response.data.data === undefined) {
                        Toast.show({
                            type: 'error',
                            text1: 'Notifikasi',
                            text2: 'Unggah gagal, Silahkan pilih gambar kembali!'
                        });
                    }else {   
                        if (type == "payment") {
                            setFormData({ ...formData, paymentProof: response.data.data });
                        } else {
                            setFormData({ ...formData, visitProof: response.data.data });
                        }
                        Toast.show({
                            type: 'success',
                            text1: 'Notifikasi',
                            text2: 'Unggah gambar berhasil'
                        });
                    }
                    console.log(response.data.data);
                }).catch(error => {
                    console.log("error upload gambar", error.response.data.message);
                }).finally(() => setLoading(false));
        }
    }


    const handleChoosePhoto = (type: string) => {
        launchImageLibrary({ mediaType: "photo" }, (response: any) => {
            if (response.didCancel !== true) {
                if (type == "payment") {
                    setSelectedImageProofPayment(response?.assets[0]?.uri);
                } else {
                    setSelectedImageProofVisit(response?.assets[0]?.uri);
                }
                handleUploadPhoto(response, type)
            } else {
                if (type == "payment") {
                    setSelectedImageProofPayment(null);
                } else {
                    setSelectedImageProofVisit(null);
                }
            }
        });

    }



    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: colors.white,
            paddingHorizontal: 10,
        }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={styles.col3}>
                    <Text style={[styles.fs14, {
                        fontWeight: "700",
                        color: colors.dark
                    }]}>Nama</Text>
                </View>
                <View style={[styles.col9, { marginLeft: 10 }]}>
                    <Text style={[styles.fs12, { color: colors.dark }]}> : {route?.params?.name}</Text>
                </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={styles.col3}>
                    <Text style={[styles.fs14, {
                        fontWeight: "700",
                        color: colors.dark
                    }]}>No Telepon</Text>
                </View>
                <View style={[styles.col9, { marginLeft: 10 }]}>
                    <Text style={[styles.fs12, { color: colors.dark }]}> : {route?.params?.phone_number}</Text>
                </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={styles.col3}>
                    <Text style={[styles.fs14, {
                        fontWeight: "700",
                        color: colors.dark
                    }]}>Alamat</Text>
                </View>
                <View style={[styles.col9, { marginLeft: 10 }]}>
                    <Text style={[styles.fs12, { color: colors.dark, textAlign: "left" }]}> : {route?.params?.address}</Text>
                </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={styles.col3}>
                    <Text style={[styles.fs14, {
                        fontWeight: "700",
                        color: colors.dark
                    }]}>Total Pinjaman</Text>
                </View>
                <View style={[styles.col9, { marginLeft: 10 }]}>
                    <Text style={[styles.fs12, { color: colors.dark }]}> : {route?.params?.due_amount}</Text>
                </View>
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <View>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Pilih Status <Text style={{ color: 'red' }}>(wajib isi)</Text></Text>
                <Picker
                    selectedValue={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    style={styles.inputRemark}
                    mode="dropdown"
                    numberOfLines={5}
                    dropdownIconColor={colors.dark} dropdownIconRippleColor={colors.primary}
                >
                    <Picker.Item label="Pilih" value="" />
                    <Picker.Item label="Lunas (Contract Amount)" value="paid_off_contarct_amount" />
                    <Picker.Item label="Lunas (Due Amount)" value="paid_off_due_amount" />
                    <Picker.Item label="Janji Bayar (Tidak Kooperatif)" value="promise_to_pay" />
                    <Picker.Item label="Janji Bayar (Kooperatif)" value="promise_to_pay_cooperative" />
                    <Picker.Item label="Bayar Sebagian" value="partial" />
                    <Picker.Item label="Permintaan Keringanan" value="payment_relief" />
                    <Picker.Item label="Gagal Bayar" value="failed_payment" />
                </Picker>
            </View>
            <View>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Nomor Telepon terbaru (Optional)</Text>
                <TextInput
                    style={styles.inputRemark}
                    value={formData.phoneNumber}
                    onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
                    keyboardType="phone-pad"
                />
            </View>

            <View>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Sesuai Alamat ?<Text style={{ color: 'red' }}>(wajib isi)</Text></Text>
                <Picker
                    selectedValue={formData.isAddress}
                    onValueChange={(value) => setFormData({ ...formData, isAddress: value })}
                    style={styles.inputRemark}
                    mode="dropdown"
                    dropdownIconColor={colors.dark} dropdownIconRippleColor={colors.primary}
                >
                    <Picker.Item label="Pilih" value="" />
                    <Picker.Item label="Sesuai Alamat" value={true} />
                    <Picker.Item label="Tidak Sesuai Alamat" value={false} />
                </Picker>
            </View>

            <View>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Jumlah Bayar (Optional)</Text>
                <TextInput
                    style={styles.inputRemark}
                    value={formData.paymentAmount}
                    onChangeText={(value) => setFormData({ ...formData, paymentAmount: value })}
                    keyboardType="numeric"
                />
            </View>

            <View style={{ marginVertical: 5 }}>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Tanggal Janji Bayar (Optional)</Text>
                {/* <Button title="Show Date Picker" onPress={showDatePicker} /> */}
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={{
                        padding: 5, backgroundColor: colors.accent_primary, width: WIDTH * 0.3, borderRadius: 10,
                        marginTop: 5,
                        marginRight: 10
                    }}
                        onPress={showDatePicker}
                    >
                        <Text style={[{ fontSize: 14, color: colors.white }]}>
                            Pilih Tanggal
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                    <Text style={{ color: colors.dark, }}>
                        {!IsEmpty(formData.ptpDate) ? convertDate(formData.ptpDate) : '-'}
                    </Text>
                </View>
            </View>

            <View style={{marginVertical:10}}>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Bukti Bayar (Optional)</Text>
                {/* Handle image upload here using a suitable library or approach */}
                {selectedImageProofPayment && <Image source={{ uri: selectedImageProofPayment }} style={{ width: 200, height: 200, marginVertical: 10, borderRadius: 10 }} />}
                <TouchableOpacity onPress={() => handleChoosePhoto("payment")} style={{ padding: 5, backgroundColor: colors.grey_stone, width: WIDTH * 0.3, borderRadius: 10, flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[{ fontSize: 14, color: colors.white }]}>
                        Pilih Gambar
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{marginVertical:10}}>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Bukti Kunjungan <Text style={{ color: 'red' }}>(wajib isi)</Text></Text>
                {/* Handle image upload here using a suitable library or approach */}
                {selectedImageProofVisit && <Image source={{ uri: selectedImageProofVisit }} style={{ width: 200, height: 200, marginVertical: 10, borderRadius: 10 }} />}
                <TouchableOpacity onPress={() => handleChoosePhoto("visit")} style={{ padding: 5, backgroundColor: colors.grey_stone, width: WIDTH * 0.3, borderRadius: 10, flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[{ fontSize: 14, color: colors.white }]}>
                        Pilih Gambar
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={[styles.fs14, {
                    fontWeight: "700",
                    color: colors.dark
                }]}>Catatan</Text>
                <TextInput
                    style={[styles.inputRemark]}
                    value={formData.message}
                    onChangeText={(value) => setFormData({ ...formData, message: value })}
                    multiline
                    numberOfLines={3}
                />
            </View>
            <TouchableOpacity style={[styles.button, { height: 60, marginBottom: 20 }]} onPress={() => handleSubmit()}>
                {loading ?
                    <ActivityIndicator size={"small"} color={colors.white} />
                    :
                    <Text style={[{
                        fontWeight: "700",
                        color: colors.white
                    }]}>Kirim</Text>
                }
            </TouchableOpacity>
        </ScrollView >

    )
}