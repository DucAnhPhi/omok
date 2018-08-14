import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase, { RNFirebase } from "react-native-firebase";
import { IProfile } from "../models";
import Logger from "./logger";

const db = firebase.firestore();

export default class Backend {
  static getCurrentProfile(): Promise<void | RNFirebase.firestore.DocumentSnapshot> {
    return db
      .collection("profiles")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(doc => {
        return doc;
      })
      .catch(e => {
        Logger.error("getting document failed", e);
      });
  }

  static createProfile(username: string): Promise<void | IProfile> {
    const httpsCallable = firebase.functions().httpsCallable("createProfile");

    return httpsCallable({ username })
      .then(({ data }): IProfile => data)
      .catch(e => {
        Logger.error("create user failed", e);
      });
  }

  static deleteProfile(): Promise<any> {
    const httpsCallable = firebase.functions().httpsCallable("deleteProfile");
    return httpsCallable();
  }

  static loginAsGuest(): Promise<void | RNFirebase.UserCredential> {
    return firebase
      .auth()
      .signInAnonymouslyAndRetrieveData()
      .then(userSnap => userSnap)
      .catch(e => {
        Logger.error("sign in as guest failed", e);
      });
  }

  static async loginFB(
    error,
    result
  ): Promise<void | RNFirebase.UserCredential> {
    if (error) {
      Logger.error("Login failed with error: ", error);
      return Promise.reject();
    } else if (result.isCancelled) {
      Logger.info("Login was cancelled", "");
      return Promise.reject();
    } else {
      try {
        // get the access token
        const data = await AccessToken.getCurrentAccessToken();

        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken
        );

        // login with credential
        return firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(userSnap => userSnap);
      } catch (e) {
        Logger.error("Cannot get FB access token", e);
        return Promise.reject();
      }
    }
  }

  static logout(): Promise<void> {
    LoginManager.logOut();
    return firebase.auth().signOut();
  }
}
