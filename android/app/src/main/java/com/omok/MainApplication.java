package com.omok;

import android.support.multidex.MultiDex;
import android.content.Context;
import android.content.Intent;
import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactPackage;
import com.reactnativenavigation.controllers.ActivityCallbacks;
// firebase dependencies
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
// facebook sdk dependencies
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public void onCreate() {
      super.onCreate();

      setActivityCallbacks(new ActivityCallbacks() {
        @Override
        public void onActivityResult(int requestCode, int resultCode, Intent data) {
            mCallbackManager.onActivityResult(requestCode, resultCode, data);
        }
      });
      FacebookSdk.sdkInitialize(getApplicationContext());
  }

  @Override
  protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }

  @Override
  public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new RNFirebasePackage(),
      new RNFirebaseAuthPackage(),
      new RNFirebaseFunctionsPackage(),
      new RNFirebaseFirestorePackage(),
      new FBSDKPackage(mCallbackManager)
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
      return "index";
  }
}
