import { createBrowserHistory } from 'history';
import { Route, Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import Routes from './Routes';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client';
import AuthGuard from './components/Guards/AuthGuard';

const App = () => {
	const history = createBrowserHistory();
	const store = configureStore();
	const client = new ApolloClient({
		uri: 'https://frontend-test-api.aircall.io/graphql',
		cache: new InMemoryCache(),
	});

	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<Router history={history}>
					<QueryParamProvider ReactRouterRoute={Route}>
						<AuthGuard>
							<Routes />
						</AuthGuard>
					</QueryParamProvider>
				</Router>
			</Provider>
		</ApolloProvider>
	);
};

export default App;
