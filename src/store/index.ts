import * as RR from 'react-redux';
import { combineReducers, Reducer } from 'redux';
import authReducer from './auth/reducer';
import getReducer from './get/reducer';
import { GetState } from './get/types';

import { AuthState } from './auth/types';

export interface Store {
	get: GetState;
	auth: AuthState;
}

export const reducers: Reducer<Store> = combineReducers<Store>({
	get: getReducer,
	auth: authReducer,
});

export const { useSelector } = RR;
