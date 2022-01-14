import { SET_LOCALE } from "../constants/actionTypes";

export const reducerLocale = (state = "", action) => {
  switch (action.type) {
    case SET_LOCALE:
      return action.payload.locale.replace(/(-|_).*/g, '')
    default:
      return state;
  }
};
