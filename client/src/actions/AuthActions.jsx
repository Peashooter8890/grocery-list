export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS";

export const setLoginStatus = (isLoggedIn) => ({
  type: SET_LOGIN_STATUS,
  payload: isLoggedIn,
});