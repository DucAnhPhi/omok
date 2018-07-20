import firebase, { RNFirebase } from "react-native-firebase";
const db = firebase.firestore();
import { IProfile } from "../models";
import Logger from "./logger";

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

  static logout(): Promise<void> {
    return firebase.auth().signOut();
  }
}
