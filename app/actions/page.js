import { GET_PAGE } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getPage = (pageId) => (dispatch, getState) => {
  const { locale: lang } = getState();
  axios
    .get(`pages/${pageId}`, {
      params: { lang },
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: GET_PAGE,
          payload: {
            [pageId]: res.data.oResult,
          },
        });
      }
    })
    .catch((err) => console.log(axiosHandleError(err)));
};
