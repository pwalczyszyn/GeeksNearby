package me.outof;

import org.apache.cordova.DroidGap;

import android.os.Bundle;

public class GeeksNearbyActivity extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index-android.html");
    }
}
