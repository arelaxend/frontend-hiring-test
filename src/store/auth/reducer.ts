import produce from 'immer';
import { Reducer } from 'redux';

import { AuthState } from './types';

export const initialState: AuthState = {
	token: '',
};

const reducer: Reducer<AuthState> = (
	state: AuthState = initialState,
	action
) => {
	switch (action.type) {
		case '@@auth/SET_TOKEN': {
			const { token } = action.payload;

			return produce(state, (draft) => {
				draft.token = token;
			});
		}
		default:
			return state;
	}
};

export default reducer;
