import { GET_SIGNUP_FORM } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getSignUpForm = (_) => (dispatch, getState) => {
  const { locale: locale } = getState();
  return axios
    .get("get-signup-fields", {
      params: {
        locale,
      },
    })
    .then((res) => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: GET_SIGNUP_FORM,
          payload: data.oFields,
        });
    })
    .catch((err) => {
      console.log(axiosHandleError(err));
    });
};
