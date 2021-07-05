import { request } from 'graphql-request';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/auth/actions';
import { gql, useMutation } from '@apollo/client';
import { useInterval } from 'ahooks';

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

	const [refreshToken, { data: tokens }] = useMutation(REFRESH_MUTATION, {
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
	}, 1000 * 60 * 5);

	const accessToken =
		tokens && tokens.refreshToken && tokens.refreshToken.access_token;

	useEffect(() => {
		if (!accessToken) return;
		dispatch(setToken(accessToken));
	}, [accessToken, dispatch]);

	if (!accessToken) return null;
	return children;
}

const areEqual = () => {
	return true;
};

export default React.memo(AuthGuard, areEqual);
