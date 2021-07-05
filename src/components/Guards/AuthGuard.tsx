import { request } from "graphql-request";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "src/store/auth/actions";
import useSWR from "swr";

const endpoint = "https://frontend-test-api.aircall.io/graphql";

const LOGIN_MUTATION = /* GraphQL */ `
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

function AuthGuard({ children }: any) {
  const username = "aircall";
  const password = "pwd";
  const dispatch = useDispatch();

  const { data: tokens, error } = useSWR(
    [LOGIN_MUTATION, username, password],
    (mutation, username, password) =>
      request(endpoint, mutation, { username, password }),
    { refreshInterval: 1000 * 60 * 5 /* refresh token every 5 minutes */ }
  );

  const accessToken = tokens && tokens.login && tokens.login.access_token;

  useEffect(() => {
    if (!accessToken) return;

    dispatch(setToken(accessToken));
  }, [accessToken, dispatch]);

  return children;
}

const areEqual = () => {
  return true;
};

export default React.memo(AuthGuard, areEqual);