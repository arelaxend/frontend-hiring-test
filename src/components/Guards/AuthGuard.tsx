import { gql, useMutation } from '@apollo/client';
import { useInterval } from 'ahooks';
import { request } from 'graphql-request';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setToken } from '../../store/auth/actions';

const endpoint = 'https://frontend-test-api.aircall.io/graphql';

export const LOGIN_MUTATION = gql`
	mutation login($username: String!, $password: String!) {
		login(input: { username: $username, password: $password }) {
			access_token
			user {
				id
				username
			}
		}
	}
`;

export const REFRESH_MUTATION = gql`
	mutation refreshToken {
		refreshToken {
			access_token
			user {
				id
				username
			}
		}
	}
`;

export const username = 'aircall';
export const password = 'pwd';

function AuthGuard({ children }: any) {
	const dispatch = useDispatch();

	const [login, { data }] = useMutation(LOGIN_MUTATION, {
		variables: { username, password },
	});

	const [refreshToken, { loading, data: tokens }] = useMutation(REFRESH_MUTATION, {
		context: {
			headers: {
				authorization: `Bearer ${
					data && data.login && data.login.access_token
				}`,
			},
		},
	});

	useEffect(() => {
		login();
	}, []);

	useEffect(() => {
		if (!data || !data.login || !data.login.access_token) return;
		refreshToken();
	}, [data]);

	useInterval(() => {
		refreshToken();
	}, 1000 * 60 * 10);

	const [accessToken, setAccessToken] = useState<string>();

	useEffect(() => {
		if (loading) return
		if (!tokens || !tokens.refreshToken) return

		setAccessToken(tokens.refreshToken.access_token)
	}, [loading, tokens]);
		

	useEffect(() => {
		if (!accessToken) return;
		dispatch(setToken(accessToken));
	}, [accessToken, dispatch]);

	if (!accessToken) return null;
	return children;
}

const areEqual = () => {
	return false;
};

export default React.memo(AuthGuard, areEqual);
