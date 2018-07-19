package com.omok;

import android.support.multidex.MultiDex;
import android.content.Context;
import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactPackage;
// firebase dependencies
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
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
      new RNFirebaseFirestorePackage()
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
