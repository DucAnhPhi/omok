import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase, { RNFirebase } from "react-native-firebase";
import { IGame, IProfile } from "../models";
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

  static findGame(): Promise<RNFirebase.firestore.QuerySnapshot> {
    return db
      .collection("games")
      .where("available", "==", true)
      .limit(1)
      .get();
  }

  static createGame(): Promise<string> {
    const httpsCallable = firebase.functions().httpsCallable("createGame");
    return httpsCallable().then(() => firebase.auth().currentUser.uid);
  }

  static matchGame(gameId: string): Promise<string> {
    const httpsCallable = firebase.functions().httpsCallable("matchGame");
    return httpsCallable({ gameId }).then(() => gameId);
  }

  static makeMove(gameId: string, position: { x: number; y: number }) {
    const httpsCallable = firebase.functions().httpsCallable("makeMove");
    return httpsCallable({ gameId, position });
  }

  static leaveGame(gameId: string): Promise<any> {
    const httpsCallable = firebase.functions().httpsCallable("leaveGame");
    return httpsCallable({ gameId });
  }
}
