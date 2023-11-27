import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';

const middleware = [thunk];

const allReducers = combineReducers({
  authReducer
});

const store = createStore(allReducers, applyMiddleware(...middleware));

export default store;
