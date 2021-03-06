import { ActionCreator } from 'redux';

import { Call, FilteringAction, SetCallAction, SetFiltersAction, SetOffsetsAction, SetSelectedAction, SetToarchivedAction } from './types';

export const setCall: ActionCreator<SetCallAction> = (
	id: string,
	data: Call
) => ({
	type: '@@get/SET_CALL',
	payload: {
		id,
		data,
	},
});

export const filtering: ActionCreator<FilteringAction> = () => ({
	type: '@@get/FILTERING',
	payload: {},
});

export const setFilters: ActionCreator<SetFiltersAction> = (
	filters: string[]
) => ({
	type: '@@get/SET_FILTERS',
	payload: {
		filters,
	},
});

export const setToarchived: ActionCreator<SetToarchivedAction> = (
	toarchived: string[]
) => ({
	type: '@@get/SET_TOARCHIVED',
	payload: {
		toarchived,
	},
});

export const setSelected: ActionCreator<SetSelectedAction> = (
	selected: string[]
) => ({
	type: '@@get/SET_SELECTED',
	payload: {
		selected,
	},
});

export const setOffsets: ActionCreator<SetOffsetsAction> = (
	pageOffset: number,
	loadOffset: number
) => ({
	type: '@@get/SET_OFFSETS',
	payload: {
		pageOffset,
		loadOffset,
	},
});
