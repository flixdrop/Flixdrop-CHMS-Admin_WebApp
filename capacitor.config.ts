import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flixdrop.admin',
  appName: 'com.flixdrop.admin',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: "notification_icon",
      sound: "beep.wav",
    },
    PushNotifications: {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    SplashScreen: {
      "launchShowDuration": 5000,
      "launchAutoHide": true,
      "backgroundColor": "#00000000",
      "androidSplashResourceName": "fd",
      "androidScaleType": "CENTER_INSIDE",
      "showSpinner": true,
      "androidSpinnerStyle": "small",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true,
      "layoutName": "launch_screen",
      "useDialog": false,
    },
  }
};

export default config;
