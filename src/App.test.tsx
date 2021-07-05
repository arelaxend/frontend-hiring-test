import { cleanup, waitFor } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { enableMapSet } from 'immer';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import { CALLS_MOCK } from './__mocks__/calls';
import AuthGuard, { LOGIN_MUTATION, password, REFRESH_MUTATION, username } from './components/Guards/AuthGuard';
import MainLayout from './layout/MainLayout';
import { configureStore } from './store/configureStore';
import { MockedWrapper, renderWithRouter } from './testHelpers';
import { CALLS_QUERY } from './views/calls';
import CallsView from './views/calls';

enableMapSet();

const mocks = [
	{
		request: {
			query: CALLS_QUERY,
			variables: { offset: 0, limit: 10 },
		},
		result: CALLS_MOCK,
	},
	{
		request: {
			query: LOGIN_MUTATION,
			variables: { username, password },
		},
		result: {
			data: {
				login: {
					access_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhaXJjYWxsIiwidXNlcm5hbWUiOiJhaXJjYWxsIiwiaWF0IjoxNjI1NTIyMzUzLCJleHAiOjE2MjU1MjI5NTN9.EYqR2dJCef60aLclpWedJAu1Ej8mutJIue6RvOWuuuI',
					user: { id: 'aircall', username: 'aircall' },
				},
			},
		},
	},
	{
		request: {
			query: REFRESH_MUTATION,
		},
		result: {
			data: {
				refreshToken: {
					access_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhaXJjYWxsIiwidXNlcm5hbWUiOiJhaXJjYWxsIiwiaWF0IjoxNjI1NTIyMzUzLCJleHAiOjE2MjU1MjI5NTN9.EYqR2dJCef60aLclpWedJAu1Ej8mutJIue6RvOWuuuI',
					user: { id: 'aircall', username: 'aircall' },
				},
			},
		},
	},
];

let store: any;
beforeEach(() => {
	store = configureStore();
});

afterEach(cleanup);

it('renders welcome message', async () => {
	jest.useFakeTimers();

	const history = createBrowserHistory();

	const { getByText } = renderWithRouter(
		<MockedWrapper mocks={mocks}>
			<Provider store={store}>
				<Router history={history}>
					<QueryParamProvider ReactRouterRoute={Route}>
						<AuthGuard>
							<Route path="/" exact>
								<MainLayout>
									<CallsView />
								</MainLayout>
							</Route>
						</AuthGuard>
					</QueryParamProvider>
				</Router>
			</Provider>
		</MockedWrapper>,
		'/'
	);

	await waitFor(() => expect(getByText(/Filters/)).toBeTruthy());
});
