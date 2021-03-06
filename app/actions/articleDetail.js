import * as types from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getArticleDetail = (articleId) => (dispatch, getState) => {
  const { locale: lang } = getState();
  return axios
    .get(`posts/${articleId}`, {
      params: { lang },
    })
    .then((res) => {
      dispatch({
        type: types.GET_ARTICLE_DETAIL,
        payload: res.data.oResult,
      });
    })
    .catch((err) => console.log(axiosHandleError(err)));
};
