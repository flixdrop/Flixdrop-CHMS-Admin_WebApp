import { Component, OnDestroy, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  passwordVisible: boolean = false;
  rememberUser: boolean = false;

  loginSub: Subscription;
  authUserSub: Subscription;
  userDataSub: Subscription;

  constructor(
    private platform: Platform,
    private toastController: ToastController,
    public loadingController: LoadingController,
    private navControl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.authUserSub) {
      this.authUserSub.unsubscribe();
    }
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.initializeApp();
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl("", [
        Validators.pattern(
          /^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(\d+$)$/
        ),
        Validators.required,
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.getPlatform() === "md") {
        StatusBar.setOverlaysWebView({ overlay: false }).catch((error) => {
          console.log(
            "%c Status Bar works only on native android and ios devices",
            "color: silver; font-size: 10px;"
          );
        });

        StatusBar.show();

        StatusBar.setBackgroundColor({ color: "#ffffff" }).catch((error) => {
          console.log(
            "%c Status Bar works only on native android and ios devices",
            "color: silver; font-size: 10px;"
          );
        });
      }
    });
  }

  async showToast(msg, isLoggedIn) {
    const toast = await this.toastController.create({
      message: msg,
      translucent: true,
      animated: true,
      icon: "information-circle",
      position: "top",
      mode: "ios",
      color: isLoggedIn ? "success" : "danger",
      duration: 2500,
    });
    toast.present();
  }

  showPassword() {
    let x = <HTMLInputElement>document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      this.passwordVisible = true;
    } else {
      x.type = "password";
      this.passwordVisible = false;
    }
  }

  onClickRememberMe(event) {
    this.rememberUser = event.detail.checked;
  }

  async onClickSubmit() {
    
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.loadingController
      .create({
        animated: true,
        mode: "ios",
        spinner: "circular",
        message: "Please Wait..",
        translucent: true,
      })
      .then((loadingEL) => {
        loadingEL.present();
        this.loginSub = this.authService
          .login(username, password)
          .subscribe(
            () => {
              this.navControl.navigateForward("/landing");
              loadingEL.dismiss();
              this.authUserSub = this.authService.authenticatedUser.subscribe((data) => {
                if(data){
                  const username = data["email"];
                  if (username) {
                    this.showToast(`Welcome ${username}`, true);
                    this.userDataSub.unsubscribe();
                  }
                }
              });
            },

            (error) => {
              loadingEL.dismiss();
              this.showToast("Login Failed", false);
              console.log("Error at Login:", error.status);
              let errorCode = +error.status;
              if (error.status >= errorCode) {
                this.alertCtrl
                  .create({
                    header: "Authentication Failed!",
                    subHeader: "User Not Found",
                    message: "Make sure your Username & Password is Correct.",
                    buttons: ["OK"],
                  })
                  .then((alertEl) => {
                    alertEl.present();
                  });
              }
            }
          );
      });

    this.loginForm.reset();
  }
}
