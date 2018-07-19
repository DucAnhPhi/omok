import firebase, { RNFirebase } from "react-native-firebase";
const db = firebase.firestore();
import Logger from "./logger";

export default class Backend {
  static getCurrentUser(): Promise<void | RNFirebase.firestore.DocumentSnapshot> {
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

  static createUser(
    username: string
  ): Promise<void | RNFirebase.functions.HttpsCallableResult> {
    const httpsCallable = firebase.functions().httpsCallable("updateProfile");

    return httpsCallable({ username })
      .then(doc => {
        return doc;
      })
      .catch(e => {
        Logger.error("create user failed", e);
      });
  }

  static signInAsGuest(): Promise<void | RNFirebase.UserCredential> {
    return firebase
      .auth()
      .signInAnonymouslyAndRetrieveData()
      .then(userSnap => userSnap)
      .catch(e => {
        Logger.error("sign in as guest failed", e);
      });
  }
}
