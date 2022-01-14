import { SET_LOCALE } from "../constants/actionTypes";
import { locale } from "../hsblog/utils/functions/getCurrentLocale";

export const setLocale = (localeParam) => (dispatch, getState) => {
  const WPML = getState().settings;
  const { lang, defaultLang } = WPML;
  const _locale = locale.replace(/(_|-).*$/g, "");
  dispatch({
    type: SET_LOCALE,
    payload: {
      locale: localeParam ?? (!!lang[_locale] ? _locale : defaultLang),
    },
  });
};
