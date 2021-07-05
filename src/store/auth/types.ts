import { Action } from 'redux';

export interface AuthState {
	token: string;
}

export interface SetTokenAction extends Action {
	type: '@@auth/SET_TOKEN';
	payload: {
		token: string;
	};
}

// Down here, we'll create a discriminated union type of all actions which will be used for our reducer.
export type AuthActions = SetTokenAction;
