package com.jlxt;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

	@Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);


        // setContentView(R.layout.activity_main);

        // mSendButton = (Button) findViewById(R.id.btn_send);
        // mSendButton.setOnClickListener(new OnClickListener() {
        //     @Override
        //     public void onClick(View v) {
        //         //点击的时候发送一条广播出去
        //         Intent intent = new Intent("THIS_IS");
        //         sendBroadcast(intent);
        //     }
        // });
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "jlxt";
    }
}
