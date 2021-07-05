import { createBrowserHistory } from 'history';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

enableMapSet();
const history = createBrowserHistory();

ReactDOM.render(
	<React.StrictMode>
		<Router history={history}>
			<App />
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
