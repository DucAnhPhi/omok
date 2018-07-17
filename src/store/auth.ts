interface InitialState {
  authenticated: boolean;
}

const USER_AUTHED = "USER_AUTHED";

// REDUCER
export const authReducer = (
  state: InitialState = { authenticated: false },
  action: any
) => {
  switch (action.type) {
    case USER_AUTHED:
      return { authenticated: true };
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
