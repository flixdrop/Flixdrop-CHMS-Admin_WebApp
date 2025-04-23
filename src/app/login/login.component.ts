import { Component, OnDestroy, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../services/auth/auth.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  passwordVisible: boolean;
  isUserSaved: boolean;

  authUserSub: Subscription;

  constructor(
    private toastController: ToastController,
    public loadingController: LoadingController,
    private navControl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
  ) { }

  ngOnDestroy() {
    if (this.authUserSub) {
      this.authUserSub.unsubscribe();
    }
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

  async showToast(msg: string, isLoggedIn: boolean) {
    const toast = await this.toastController.create({
      header: "Flixdrop-CHMS",
      message: msg,
      translucent: true,
      animated: true,
      icon: "shield-checkmark",
      position: "top",
      color: isLoggedIn ? "light" : "danger",
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

  onClickRememberMe(event: any) {
    this.isUserSaved = !this.isUserSaved;
    const isUserSaved = event.detail.checked;
    localStorage.setItem("isUserSaved", JSON.stringify(isUserSaved));
  }

  async onClickSubmit() {
    const username = await this.loginForm.value.username;
    const password = await this.loginForm.value.password;

    const loadingEl = await this.loadingController.create({
      animated: true,
      spinner: "circular",
      message: "Please Wait..",
      translucent: true,
    });

    await loadingEl.present();
    this.authService.login(username, password).subscribe((data) => {
      if (data) {
        if (!this.authUserSub) {
          this.authUserSub = this.authService.authenticatedUser.subscribe((user) => {
            if (user) {
              this.showToast(`Welcome ${user?.['email']}`, true);
              this.navControl.navigateForward("/farm");
              loadingEl.dismiss();
            }
          });
        }

      }
    },
      (error) => {
        loadingEl.dismiss();
        this.showToast("An error occurred. Please try again.", false);
        console.error("Error at Login:", error);
        this.alertCtrl
          .create({
            header: "Authentication Failed!",
            subHeader: "User Not Found",
            message: "Make sure your Username & Password is Correct.",
            buttons: ["OK"],
          })
          .then((alertEl) => alertEl.present());
      }
    );
  }
}
