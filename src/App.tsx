import { Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import AuthGuard from './components/Guards/AuthGuard';
import Routes from './Routes';

const App = () => {
	return (
		<QueryParamProvider ReactRouterRoute={Route}>
			<AuthGuard>
				<Routes />
			</AuthGuard>
		</QueryParamProvider>
	);
};

export default App;
