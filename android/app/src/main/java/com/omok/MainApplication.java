package com.omok;

import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication implements ReactApplication {

  @Override
  public boolean isDebug() {
      return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new RNFirebasePackage(),
        new RNFirebaseAuthPackage()
      );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      return getPackages();
  }
}


