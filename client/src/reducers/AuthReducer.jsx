import { SET_LOGIN_STATUS } from '../actions/AuthActions';

const initialState = {
  isLoggedIn: false
};

const AuthReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_LOGIN_STATUS:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;