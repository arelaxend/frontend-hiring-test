import produce from 'immer';
import { cloneDeep } from 'lodash';
import { Reducer } from 'redux';

import { Call, GetState } from './types';

export const initialFilters = [
	'archived',
	'missed',
	'voicemail',
	'inbound',
	'outbound',
];
export const initialState: GetState = {
	filters: ['archived', 'missed', 'voicemail', 'inbound', 'outbound'],
	pageOffset: 0,
	loadOffset: 0,
	count: 0,
	calls: new Map<string, Call>(),
	unsorted: new Array<[string, Call]>(),
	sorted: new Array<[string, Call]>(),
	filtered: new Array<[string, Call]>(),
};

const reducer: Reducer<GetState> = (state: GetState = initialState, action) => {
	switch (action.type) {
		case '@@get/SET_CALL': {
			const { id, data } = action.payload;

			if (!id || !data) return state;

			return produce(state, (draft) => {
				const exist = draft.calls.has(id);
				const key = `${data.created_at}_${id}`;
				draft.calls.set(id, data);
				if (!exist) {
					draft.unsorted.push([key, data]);
					draft.sorted.push([key, data]);
					draft.sorted.sort().reverse();
				} else {
					draft.unsorted.forEach((v, i) => {
						if (v[0].includes(id)) {
							draft.unsorted[i] = [key, data];
						}
					});
					draft.sorted.forEach((v, i) => {
						if (v[0].includes(id)) {
							draft.sorted[i] = [key, data];
						}
					});
					draft.filtered.forEach((v, i) => {
						if (v[0].includes(id)) {
							draft.filtered[i] = [key, data];
						}
					});
				}
			});
		}
		case '@@get/SET_FILTERS': {
			const { filters } = action.payload;
			return produce(state, (draft) => {
				draft.filters = filters;
			});
		}

		case '@@get/FILTERING': {
			return produce(state, (draft) => {
				let filtered = cloneDeep(draft.unsorted);
				if (draft.filters.includes('groupbydate')) {
					filtered = cloneDeep(draft.sorted);
				}

				if (!draft.filters.includes('archived')) {
					filtered = filtered.filter((v: any, i: number) => !v[1].is_archived);
				}
				if (!draft.filters.includes('inbound')) {
					filtered = filtered.filter(
						(v: any, i: number) => v[1].direction !== 'inbound'
					);
				}
				if (!draft.filters.includes('outbound')) {
					filtered = filtered.filter(
						(v: any, i: number) => v[1].direction !== 'outbound'
					);
				}
				if (!draft.filters.includes('missed')) {
					filtered = filtered.filter(
						(v: any, i: number) => v[1].call_type !== 'missed'
					);
				}
				if (!draft.filters.includes('voicemail')) {
					filtered = filtered.filter(
						(v: any, i: number) => v[1].call_type !== 'voicemail'
					);
				}

				draft.count = filtered.length;
				draft.filtered = filtered.slice(
					draft.pageOffset * 10,
					draft.pageOffset * 10 + 10
				);
			});
		}
		case '@@get/SET_OFFSETS': {
			const { pageOffset, loadOffset } = action.payload;

			if (pageOffset < 0 || loadOffset < 0) return state;

			return produce(state, (draft) => {
				draft.pageOffset = pageOffset;
				draft.loadOffset = loadOffset;
			});
		}
		default:
			return state;
	}
};

export default reducer;
