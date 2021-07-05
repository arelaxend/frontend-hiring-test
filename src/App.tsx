import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import AuthGuard from './components/Guards/AuthGuard';
import Routes from './Routes';
import { configureStore } from './store/configureStore';

const App = () => {
	const store = configureStore();
	const client = new ApolloClient({
		uri: 'https://frontend-test-api.aircall.io/graphql',
		cache: new InMemoryCache(),
	});

	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<QueryParamProvider ReactRouterRoute={Route}>
					<AuthGuard>
						<Routes />
					</AuthGuard>
				</QueryParamProvider>
			</Provider>
		</ApolloProvider>
	);
};

export default App;
