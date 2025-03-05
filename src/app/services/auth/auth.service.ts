import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "src/app/models/user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { UserService } from "../user/user.service";

interface AuthResponseData {
  userId: string;
  token: string;
  registration_token: string;
  tokenExpiration: string;
  designation: string;
  role: string;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  get authenticatedUser() {
    return this.user.asObservable();
  }

  registerUser(userData) {
    const requestBody = {
      query: `
      mutation{
        CreateUser(
          user_id: "${this.user.value}",
          user: {
          name: "${userData.name}",
          email: "${userData.email}",
          designation: "${userData.designation}",
          phone_number_for_login: "${userData.phone_number_for_login}",
          address: "${userData.address}",
          user_is_active: "${userData.user_is_active}",
          username: "${userData.username}",
          password: "${userData.password}",
          section_location_id: "${userData.section_location_id}",
          role: "${userData.role}",
          joined_date: "${new Date().toISOString()}",
        }){
          id
        }
      }
      `,
    };

    return this.http.post(
      environment.flixdrop.apiUrl,
      JSON.stringify(requestBody)
    );
  }

  loginUsingEmail(email: string, password: string) {
    const requestBody = {
      query: `
        query {
          loginUsingEmail(email:"${email}", password: "${password}"){
            email
            userId
            token
            tokenExpiration
            designation
            role
          }
        }
      `,
    };

    return this.http
      .post<AuthResponseData>(
        environment.flixdrop.apiUrl,
        JSON.stringify(requestBody)
      )
      .pipe(
        tap((data) => {
          const resData = data["data"]["loginUsingEmail"];
          console.log("User at Tap in LoginUsingEmail: ", resData);
          this.handleAuthentication(
            resData.userId,
            resData.email,
            resData.role,
            resData.token,
            +resData.tokenExpiration
          );
        })
      );
  }

  login(username: string, password: string) {

    const requestBody = {
      query: `
        query {
          login(identifier:"${username}", password: "${password}"){
            userId
            email
            token
            tokenExpiration
            role
            message
          }
        }
      `,
    };

    return this.http
      .post<AuthResponseData>(environment.flixdrop.apiUrl, JSON.stringify(requestBody))
      .pipe(
        tap(data => {
          console.log('Login Response: ', data);
          const resData = data['data']['login'];
          console.log('User at Tap in login: ', resData);
          this.handleAuthentication(resData.userId, resData.email, resData.role, resData.token, +resData.tokenExpiration);
        })
      );
  }

  private handleAuthentication(
    userId: string,
    email: string,
    role: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(userId, email, role, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("Authenticated_User", JSON.stringify(user));
  }

  autoLogin() {
    this.userService.setFarmId('All Farms');
    const userData: {
      id: string;
      email: string;
      role: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("Authenticated_User"));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.id,
      userData.email,
      userData.role,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    console.log("Timer: ", expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  async logout() {
    this.user.next(null);
    this.userService.setFarmId(null);
    this.userService.setAdminId(null);

    localStorage.removeItem("Authenticated_User");
    localStorage.removeItem("isUserSaved");
    localStorage.removeItem("farm");
    localStorage.removeItem("adminId");
    localStorage.removeItem("farmId");
    localStorage.removeItem("firstTimeOpen");
    localStorage.clear();

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

    this.router.navigateByUrl('/login', { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }
}
