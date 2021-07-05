import { ActionCreator } from "redux";

import { SetTokenAction } from "./types";

export const setToken: ActionCreator<SetTokenAction> = (
  token: string
) => ({
  type: "@@auth/SET_TOKEN",
  payload: {
    token
  },
});