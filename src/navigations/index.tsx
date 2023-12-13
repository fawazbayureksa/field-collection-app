import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainRouteName } from '../constants/mainRouteName';
import { DetailTask, HomeScreen, Login, RemarkTask, Tasks } from '../screens';
import colors from '../assets/theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/actions/auth';
import { navigate } from './RootNavigations';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { InfoToast } from 'react-native-toast-message';
const Stack = createNativeStackNavigator<any>();

interface dispatchProps {
  response: any;
}

function NavigationProvider(): JSX.Element {

  const isLoggedIn = useSelector<any>(state => state.authReducer.isLoggedIn);
  const dispatch = useDispatch<dispatchProps | any>();
  const [isLoading, setIsLoading] = useState<any>(false);

  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  const getUser = async () => {
    setIsLoading(true);
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        let authState = { isLoggedIn: true, user: user };
        dispatch(setUser(authState));
      } else {
        let authState = { isLoggedIn: false, user: null };
        dispatch(setUser(authState));
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const LogoutButton = () => {

    const dispatch = useDispatch<any>();

    const handleLogout = () => {
      dispatch(logout()).then((res: any) => {
        navigate(MainRouteName.LOGIN);
        Toast.show({
          type: 'success',
          text1: 'Notifikasi',
          text2: 'Berhasil Keluar, Terima kasih'
      });
      });
    };
    return (
      <TouchableOpacity
        onPress={() => handleLogout()}
        style={{ backgroundColor: colors.white, padding: 5, borderRadius: 10 }}
      >
        <Text style={{ color: colors.primary }}> Keluar</Text>
      </TouchableOpacity>
    );
  };


  return (
    <>
      {!isLoading ? (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={!isLoggedIn ? MainRouteName.LOGIN : MainRouteName.HOME_NAVIGATOR} screenOptions={{ animation: 'slide_from_right' }} >
            <Stack.Screen
              name={MainRouteName.HOME_NAVIGATOR}
              component={HomeScreen}
              options={{
                headerShown: true,
                headerTitle: "Dashboard",
                headerBackVisible: false,
                statusBarColor: colors.primary,
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerRight: () => (
                  <>
                    <LogoutButton />
                  </>
                )
              }}
            />
            <Stack.Screen
              name={MainRouteName.LOGIN}
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={MainRouteName.TASK_LIST}
              component={Tasks}
            />
            <Stack.Screen
              name={MainRouteName.DETAIL_TASK}
              component={DetailTask}
            />
            <Stack.Screen
              name={MainRouteName.REMARK_TASK}
              component={RemarkTask}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) :
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size="large" />
        </View>
      }
    </>
  );
};

export default NavigationProvider;