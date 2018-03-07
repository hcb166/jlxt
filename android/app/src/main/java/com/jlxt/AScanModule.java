package com.jlxt;

import android.widget.Toast;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;



import com.symbol.scanning.Scanner;
import com.symbol.scanning.Scanner.DataListener;
import com.symbol.scanning.ScannerException;
import com.symbol.scanning.ScanDataCollection;
import com.symbol.scanning.ScanDataCollection.ScanData;
// test for BarcodeManager
import com.symbol.scanning.BarcodeManager;
import java.util.List;
import com.symbol.scanning.ScannerInfo;
/**
 * Created by Administrator on 2016/10/18. 
 */
import java.util.ArrayList;

public class AScanModule extends ReactContextBaseJavaModule {

    private Context mContext;

    public AScanModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mContext = reactContext;
    }

    @Override
    public String getName() {

        //返回的这个名字是必须的，在rn代码中需要这个名字来调用该类的方法。
        return "AScanModule";
    }


    //函数不能有返回值，因为被调用的原生代码是异步的，原生代码执行结束之后只能通过回调函数或者发送信息给rn那边。


    @ReactMethod
    public void rnCallNative(String msg){
        // try{
        //     mScanner.read();
        // //test ScannerConfig.isParamSupported(String)
        // boolean upcaEnabled = mScanner.getConfig().isParamSupported(
        //         "mScannerConfig.decoderParams.upca.enabled");
        // }
        // catch (ScannerException se)
        // {
        //     se.printStackTrace();
        // }

        

        //test BarcodeManager.getSupportedDevicesInfo()
//        if(!scanInfoList.isEmpty())
//        {
//            Log.d(TAG, "scanInfoList is not empty");
//            for(ScannerInfo info : scanInfoList)
//            {
//                Log.d(TAG, "scanning supprot "+info.getDeviceType());
//            }
//        }
       Toast.makeText(mContext,msg,Toast.LENGTH_SHORT).show();

    }
}  