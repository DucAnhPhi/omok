package com.omok;

import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
          new RNFirebasePackage(),
          new RNFirebaseAuthPackage()
        );
    }
}
