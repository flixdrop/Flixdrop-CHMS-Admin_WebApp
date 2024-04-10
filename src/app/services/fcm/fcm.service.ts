import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from "@capacitor/push-notifications";

export const REGISTRATION_TOKEN = 'registration_token';

@Injectable({
  providedIn: "root",
})
export class FcmService {

  constructor() {}

  initPush() {
    if (Capacitor.getPlatform() !== "web") {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      console.log("Push registration success, token: " + token.value);
      this.setRegistrationToken(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      console.log("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        console.log("Push Received :" + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        console.log("Action Performed : ", notification);
      }
    );
  }

  async getRegistrationToken() {
    const { value } = await Preferences.get({ key: REGISTRATION_TOKEN });
    console.log('GET REGISTRATION TOKEN AT SERVICE- ', value);
    return value;
  };

  async setRegistrationToken(value) {
    await Preferences.set({
      key: REGISTRATION_TOKEN,
      value: value,
    });
  console.log('SET REGISTRATION TOKEN AT SERVICE- ', this.getRegistrationToken());
};

async removeRegistrationToken() {
  await Preferences.remove({
    key: REGISTRATION_TOKEN
  });
  console.log('REMOVED TOKEN AT SERVICE- ', this.getRegistrationToken());
};

  smallId(id: string) {
    return id.substring(0, 5);
  }
}
