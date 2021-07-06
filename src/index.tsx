import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createBrowserHistory } from 'history';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from './store/configureStore';

enableMapSet();
const history = createBrowserHistory();
const store = configureStore();
const client = new ApolloClient({
	uri: 'https://frontend-test-api.aircall.io/graphql',
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Provider store={store}>
				<Router history={history}>
					<App />
				</Router>
			</Provider>
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
