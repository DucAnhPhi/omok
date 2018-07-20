import { IProfile } from "../models";

interface InitialState {
  profile: IProfile;
}

const PROFILE_UPDATED = "PROFILE_UPDATED";
const PROFILE_CLEARED = "PROFILE_CLEARED";

// REDUCER
export const profileReducer = (
  state: InitialState = { profile: null },
  action: any
) => {
  switch (action.type) {
    case PROFILE_UPDATED:
      return { profile: action.payload.profile };
    case PROFILE_CLEARED:
      return { profile: null };
    default:
      return state;
  }
};

// ACTION
export const updateProfile = (profile: IProfile) => {
  return (dispatch: any) => {
    dispatch({ type: PROFILE_UPDATED, payload: { profile } });
  };
};

export const clearProfile = () => {
  return (dispatch: any) => {
    dispatch({ type: PROFILE_CLEARED });
  };
};
