import AsyncStorage from '@react-native-async-storage/async-storage';

const logIn = async user => {
  const { email, password } = user;
  axiosInstance
    .post('login', {
      email,
      password,
    })
    .then(response => {
      // AsyncStorage.setItem('token', res.data.data.access_token);
      // AsyncStorage.setItem('user', JSON.stringify(res.data.data.user));
      const user = response.data[0].data;
      const authToken = response.data[0].access_token;
      AsyncStorage.setItem('user', JSON.stringify(user));
      AsyncStorage.setItem('token', authToken);
    })
    .catch(err => {
      console.log('errorLogin', err.response.data);
    });
  return {
    status: 'success',
    message: 'You are redirecting to home page',
    user: JSON.stringify({ name: 'tes' }),
  };
};

const logOut = async () => {
  try {
    axiosInstance
      .post(`logout`, data)
      .then(res => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('user');
      })
      .catch(err => {
        console.log(err?.response.data);
      });

  } catch (error) { }
  return {
    status: 'success',
    message: 'You are logged out',
  };
};



export default {
  logIn,
  logOut,
};
