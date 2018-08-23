package com.omokfiveinarow;

import com.reactnativenavigation.controllers.SplashActivity;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.widget.LinearLayout;

public class MainActivity extends SplashActivity {
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
  }

  public LinearLayout createSplashLayout() {
    LinearLayout splash = new LinearLayout(this);
    Drawable launch_screen_bitmap = ContextCompat.getDrawable(getApplicationContext(),R.drawable.launch_screen_bitmap);
    splash.setBackground(launch_screen_bitmap);

    return splash;
  }
}