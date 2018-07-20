interface InitialState {
  authenticated: boolean;
}

const USER_AUTHED = "USER_AUTHED";
const USER_UNAUTHED = "USER_UNAUTHED";

// REDUCER
export const authReducer = (
  state: InitialState = { authenticated: false },
  action: any
) => {
  switch (action.type) {
    case USER_AUTHED:
      return { authenticated: true };
    case USER_UNAUTHED:
      return { authenticated: false };
    default:
      return state;
  }
};

// ACTION
export const loginSuccess = () => {
  return (dispatch: any) => {
    dispatch({ type: USER_AUTHED });
  };
};

export const logoutSuccess = () => {
  return (dispatch: any) => {
    dispatch({ type: USER_UNAUTHED });
  };
};
