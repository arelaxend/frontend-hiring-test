import React from 'react';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

export const renderWithRouter = (children: any, route: string) => {
	const history = createMemoryHistory();
	if (route) {
		history.push(route);
	}
	return {
		...render(<Router history={history}>{children}</Router>),
		history,
	};
};

type MockedWrapperProps = {
	children?: React.ReactNode;
	mocks?: MockedResponse<Record<string, unknown>>[];
};

export const MockedWrapper: React.FC<MockedWrapperProps> = ({
	children,
	mocks,
}) => (
	<MockedProvider mocks={mocks} addTypename={false}>
		{children}
	</MockedProvider>
);