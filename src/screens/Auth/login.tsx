import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Dimensions, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../../assets/theme/colors";
import { styles } from "../../assets/theme/styles";
import { useNavigation } from "@react-navigation/native";
import { MainRouteName } from "../../constants/mainRouteName";

import { useDispatch, useSelector } from 'react-redux';
import { login } from "../../redux/actions/auth";
import Toast, { InfoToast } from 'react-native-toast-message';


interface dispatchProps {
    response: any;
}

function Login(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const isLoggedIn = useSelector<any>(state => state.authReducer.isLoggedIn);
    const [isLoading, setIsLoading] = useState(false);

    const { navigate } = useNavigation<any>();
    const dispatch = useDispatch<dispatchProps | any>();

    useEffect(() => {
        getUser();
    }, [isLoggedIn]);

    const getUser = () => {
        if (isLoggedIn == true) {
            navigate(MainRouteName.HOME_NAVIGATOR);
        }
    };

    const handleLogin = () => {

        setIsLoading(true);
        if (email == '' || password == '') {
            Toast.show({
                type: 'error',
                text1: 'Notifikasi',
                text2: 'Lengkapi data terlebih dahulu!'
            });
            setIsLoading(false)
            return
        }
        let data = {
            email: email,
            password: password
        }
        dispatch(login(data)).then((response: any) => {
            if (response?.data[0].status == 'success') {
                Toast.show({
                    type: 'success',
                    text1: 'Notifikasi',
                    text2: 'Berhasil Masuk!'
                });
                setIsLoading(false); //
                navigate(MainRouteName.HOME_NAVIGATOR);
            }
        }).catch((error: any) => {
            setIsLoading(false); //
            Toast.show({
                type: 'error',
                text1: 'Notifikasi',
                text2: 'Masuk tidak berhasil!'
            });
            console.log(error);
        });
    }



    const WIDTH = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff" }}>
            <Image
                style={{
                    width: WIDTH * 0.5,
                    height: WIDTH * 0.4,
                    resizeMode: 'contain',
                    marginBottom: 10,
                }}
                source={require('../../assets/images/leona-1.png')}
            />
            <Text style={styles.highlight}>SINGA FIELD COLLECTION APP</Text>
            <Text>Masukkan Email dan password anda</Text>

            <View style={styles.sectionContainer}>
                <Text style={{ fontSize: 12, color: colors.dark }}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email ..."
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    keyboardType="email-address"
                />
                <View style={styles.passwordContainer}>
                    <Text style={{ fontSize: 12, color: colors.dark }}>Kata Sandi</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.showPasswordButton}
                    >
                        <Text style={{ fontSize: 12, color: colors.dark }}>{showPassword ? 'Sembunyi' : 'Lihat'} Password</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => handleLogin()}
                    style={styles.button}
                    disabled={isLoading}
                >
                    {!isLoading ?
                        <Text style={{ color: colors.white }}>
                            Masuk
                        </Text>
                        :
                        <ActivityIndicator size="small" color={colors.white} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;