import axiosInstance from '../../components/AxiosInstance';
import {
  CLEAR_AUTH_STATE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER,
} from '../../constants/actionTypes/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (data) => dispatch => {
  return axiosInstance.post('login', data).then(response => {
    const user = response.data[0].data;
    const authToken = response.data[0].access_token;
    AsyncStorage.setItem('user', JSON.stringify(user));
    AsyncStorage.setItem('token', authToken);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: JSON.stringify(user) },
    });
    Promise.resolve();
    return Promise.resolve(response);
  })
    .catch(error => {
      console.log('errorLogin', error);

      Promise.reject();
      return Promise.reject(error);
    });
};

export const logout = () => dispatch => {
  return axiosInstance.post('logout').then(response => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
    dispatch({
      type: LOGOUT,
    });
    Promise.resolve();
    return response;
    // }
  });
};

export const setUser = user => dispatch => {
  dispatch({
    type: SET_USER,
    payload: { isLoggedIn: user.user != null ? true : false, user: user.user },
  });
  return user.user;
};
