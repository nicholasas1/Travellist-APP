import * as types from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getHomeScreen = (_) => async (dispatch, getState) => {
  const { locale: locale } = getState();
  dispatch({
    type: types.LOADING,
    loading: true,
  });
  try {
    // dispatch({
    //   type: types.HOME_REQUEST_TIMEOUT,
    //   isTimeout: false,
    // });
    const {data: homeData} = await axios.get("homepage-sections", {
      params: {locale},
    });
    console.log(datas);
    const homeDataArr = Object.keys(homeData.oData);
    const getAllPromise = (arr) => {
      return arr.map((endpoint) => {
        return axios.get(`homepage-sections/${endpoint}`, {
          params: { locale },
        });
      });
    };
    const datas = await Promise.all(getAllPromise(homeDataArr));
    const payload = datas.map((item) => item.data.oData).filter((item) => item);
    dispatch({
      type: types.GET_HOME_SCREEN,
      payload,
    });
    dispatch({
      type: types.HOME_REQUEST_TIMEOUT,
      isTimeout: false,
    });
  } catch (err) {
    dispatch({
      type: types.HOME_REQUEST_TIMEOUT,
      isTimeout: true,
    });
    console.log("homescreen", err.response);
  }
};
