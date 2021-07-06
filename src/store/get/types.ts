import { Action } from 'redux';

export type Note = {
	id: string;
	content: string;
};

export type Call = {
	id: string; // "unique ID of call"
	direction: string; // "inbound" or "outbound" call
	from: string; // Caller's number
	to: string; // Callee's number
	duration: number; // Duration of a call (in seconds)
	is_archived: boolean; // Boolean that indicates if the call is archived or not
	call_type: string; // The type of the call, it can be a missed, answered or voicemail.
	via: string; // Aircall number used for the call.
	created_at: string; // When the call has been made.
	notes: Note[]; // Notes related to a given call
};

export interface GetState {
	filters: string[];
	count: number;
	pageOffset: number;
	loadOffset: number;
	calls: Map<string, Call>;
	sorted: Array<[string, Call]>;
	unsorted: Array<[string, Call]>;
	filtered: Array<[string, Call]>;
	selected: Array<[string, Call]>;
	toarchived: Array<string>;
}

export interface SetCallAction extends Action {
	type: '@@get/SET_CALL';
	payload: {
		id: string;
		data: Call;
	};
}

export interface SetFiltersAction extends Action {
	type: '@@get/SET_FILTERS';
	payload: {
		filters: string[];
	};
}
export interface SetToarchivedAction extends Action {
	type: '@@get/SET_TOARCHIVED';
	payload: {
		toarchived: string[];
	};
}

export interface SetSelectedAction extends Action {
	type: '@@get/SET_SELECTED';
	payload: {
		selected: string[];
	};
}

export interface SetOffsetsAction extends Action {
	type: '@@get/SET_OFFSETS';
	payload: {
		pageOffset: number;
		loadOffset: number;
	};
}

export interface FilteringAction extends Action {
	type: '@@get/FILTERING';
	payload: {};
}

// Down here, we'll create a discriminated union type of all actions which will be used for our reducer.
export type GetActions =
	| SetCallAction
	| SetFiltersAction
	| SetOffsetsAction
	| FilteringAction
	| SetSelectedAction
	| SetToarchivedAction;
