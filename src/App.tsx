import { createBrowserHistory } from 'history';
import { Route, Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import Routes from './Routes';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';

import AuthGuard from './components/Guards/AuthGuard';

const App = () => {
	const history = createBrowserHistory();
  const store = configureStore();

	return (
		<Provider store={store}>
			<AuthGuard>
				<Router history={history}>
					<QueryParamProvider ReactRouterRoute={Route}>
						<Routes />
					</QueryParamProvider>
				</Router>
			</AuthGuard>
		</Provider>
	);
};

export default App;
