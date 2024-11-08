import { Router, RouterModule } from "@angular/router";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import {
  ActionSheetButton,
  ActionSheetController,
  IonModal,
  IonSearchbar,
  IonicModule,
} from "@ionic/angular";
import { UserService } from "../services/user/user.service";
import { AuthService } from "../services/auth/auth.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild("searchModal") searchModal: IonModal | any;
  @ViewChild("searchbar", { static: false }) searchbar: IonSearchbar | any;

  fetchUserDataSub: Subscription;
  userDataSub: Subscription;
  getAllAnimalsSub: Subscription;
  getFarmAnimalsSub: Subscription;
  results: any[] = [];
  animals: any[] = [];
  farms: any[] = [];
  admins: any[] = [];

  // farm = "All Farms";
  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;
  language: string = "en";
  typeOfUser: string = "";
  selectedAdmin = "All Admin";
  selectedFarm = "All Farms";

  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(
  //     map((result) => result.matches),
  //     shareReplay()
  //   );

  // isWeb$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Web)
  //   .pipe(
  //     map((result) => result.matches),
  //     shareReplay()
  //   );

  constructor(
    private translateService: TranslateService,
    // private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private actionSheetContoller: ActionSheetController
  ) {
    this.translateService.setDefaultLang("en");
    this.translateService.use(localStorage.getItem("language") || "en");
    this.language = localStorage.getItem("language") || "en";
  }

  ngOnDestroy(): void {
    if (this.getFarmAnimalsSub) {
      this.getFarmAnimalsSub.unsubscribe();
    }
    if (this.getAllAnimalsSub) {
      this.getAllAnimalsSub.unsubscribe();
    }
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }

    this.typeOfUser = "";
    this.selectedAdmin = "";
    this.selectedFarm = "";
    this.results = [];
    this.animals = [];
    this.farms = [];
    this.admins = [];
  }

  // ionViewWillEnter() {
  //   this.typeOfUser = "";
  //   this.selectedAdmin = "";
  //   this.selectedFarm = "";
  //   this.results = [];
  //   this.animals = [];
  //   this.farms = [];
  //   this.admins = [];
  //   let userId;
  //   this.isLoading = true;
  //   this.authService.authenticatedUser.subscribe((user) => {
  //     if (user) {
  //       userId = user["id"];
  //       this.isLoading = false;
  //     }
  //   });

  //   this.isLoading = true;
  //   if (!this.fetchUserDataSub) {
  //     this.fetchUserDataSub = this.userService
  //       .fetchOrganizationDocuments(userId)
  //       .subscribe((data) => {
  //         if (data) {
  //           this.isLoading = false;
  //         }
  //       });
  //   }
  // }

  // ngOnInit(): void {
  //   let userId;
  //   let typeOfUser;
  //   this.isLoading = true;
  //   if (!this.userDataSub) {
  //     this.userDataSub = this.authService.authenticatedUser.subscribe(
  //       (user) => {
  //         if (user) {
  //           userId = user["id"];
  //           typeOfUser = user["role"];
  //           this.typeOfUser = user.role;
  //           this.isLoading = false;
  //         }
  //       }
  //     );
  //   }

  //   this.isLoading = true;
  //   if (!this.fetchUserDataSub) {
  //     this.fetchUserDataSub = this.userService
  //       .fetchOrganizationDocuments(userId)
  //       .subscribe((userData) => {
  //         if (userData) {
  //           this.farms = userData.farms;
  //           this.selectedFarm = "All Farms";
  //           this.userService.setFarmId(`All Farms`);
  //           const uniqueParentOrganizations = Array.from(
  //             new Map(
  //               userData.farms.map((farm) => [
  //                 farm.organization.parentOrganization.id,
  //                 farm.organization.parentOrganization,
  //               ])
  //             ).values()
  //           );
  //           this.admins = uniqueParentOrganizations.reverse();

  //           if(typeOfUser == "SUPER_ADMIN" && typeOfUser !== "ADMIN" || "USER"){
  //             this.fetchUserDataSub = this.userService
  //             .fetchOrganizationDocuments(this.admins[0].user.id)
  //             .subscribe((superAdminData) => {
  //               if (superAdminData) {
  //                 this.selectedFarm = "All Farms";
  //                 this.userService.setFarmId(`All Farms`);

  //                 this.selectedAdmin = this.admins[0].user.name;
  //                 localStorage.setItem("selected_admin", this.admins[0].user.name);
  //                 this.userService.setAdminId(`${this.admins[0].user.id}`);
  //                 this.farms = superAdminData.farms;

  //                 this.isLoading = false;
  //               }
  //             });
  //           }

  //           // if(typeOfUser !== "SUPER_ADMIN"){
  //           //   this.farms = userData.farms;
  //           //   this.selectedFarm = "All Farms";
  //           //   this.userService.setFarmId(`All Farms`);
  //           // }
  //         }

  //         // if(typeOfUser === "SUPER_ADMIN"){
  //         //   this.fetchUserDataSub = this.userService
  //         //   .fetchOrganizationDocuments(this.admins[0].user.id)
  //         //   .subscribe((data) => {
  //         //     if (data) {
  //         //       this.selectedFarm = "All Farms";
  //         //       this.userService.setFarmId(`All Farms`);

  //         //       this.farms = data.farms;
  //         //       this.selectedAdmin = this.admins[0].user.name;
  //         //       localStorage.setItem("selected_admin", this.admins[0].user.name);
  //         //       this.userService.setAdminId(`${this.admins[0].user.id}`);
  //         //       this.isLoading = false;
  //         //     }
  //         //   });
  //         // }
  //       });

  //     // if(this.admins && typeOfUser === "SUPER_ADMIN"){

  //     //   this.fetchUserDataSub = this.userService
  //     //   .fetchOrganizationDocuments(this.admins[0].user.id)
  //     //   .subscribe((data) => {
  //     //     if (data) {
  //     //       this.selectedFarm = "All Farms";
  //     //       this.userService.setFarmId(`All Farms`);

  //     //       this.farms = data.farms;
  //     //       this.selectedAdmin = this.admins[0].user.name;
  //     //       localStorage.setItem("selected_admin", this.admins[0].user.name);
  //     //       this.userService.setAdminId(`${this.admins[0].user.id}`);
  //     //       this.isLoading = false;
  //     //     }
  //     //   });
  //     // }
  //   }
  // }

  ionViewWillEnter() {
    this.typeOfUser = "";
    this.selectedAdmin = "";
    this.selectedFarm = "";
    this.results = [];
    this.animals = [];
    this.farms = [];
    this.admins = [];
    let userId;
    this.isLoading = true;

    // Fetch authenticated user
    this.authService.authenticatedUser.subscribe((user) => {
      if (user) {
        userId = user["id"];
        this.isLoading = false;
      }
    });

    // Fetch organization documents (farms and admins)
    if (!this.fetchUserDataSub) {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(userId)
        .subscribe((data) => {
          if (data) {
            this.isLoading = false;

            // Set farms and default selection
            this.farms = data.farms;
            if (this.farms.length > 0) {
              this.selectedFarm = this.farms[0]?.name || "All Farms"; // Set the first farm
              this.userService.setFarmId(this.farms[0]?.id || "All Farms"); // Set farmId
            }

            // Set unique admins
            const uniqueParentOrganizations = Array.from(
              new Map(
                data.farms.map((farm) => [
                  farm.organization.parentOrganization.id,
                  farm.organization.parentOrganization,
                ])
              ).values()
            );
            this.admins = uniqueParentOrganizations;

            // Set first admin if available
            if (this.admins.length > 0) {
              this.selectedAdmin = this.admins[0]?.name; // Set the first admin
              this.userService.setAdminId(this.admins[0]?.user?.id); // Set adminId
            }

            // // Handle SUPER_ADMIN case
            if (this.typeOfUser === "SUPER_ADMIN") {
              this.fetchUserDataSub = this.userService
                .fetchOrganizationDocuments(this.admins[0]?.user?.id)
                .subscribe((superAdminData) => {
                  if (superAdminData) {

                    this.selectedFarm = "All Farms";
                    this.userService.setFarmId("All Farms");

                    // this.farms = superAdminData.farms.filter((farm) => {
                    //   farm.organization.user.id === this.admins[0].id 
                    // });

                    this.farms = superAdminData.farms;
        
                    this.isLoading = false;
                  }
                });
            }
          }

            // Handle SUPER_ADMIN case
            if (this.typeOfUser === "USER") {
              this.fetchUserDataSub = this.userService
                .fetchOrganizationDocuments(userId)
                .subscribe((superAdminData) => {
                  if (superAdminData) {
                    this.selectedFarm = "All Farms";
                    this.userService.setFarmId("All Farms");
                    this.farms = superAdminData.farms;
                    this.isLoading = false;
                  }
                });
            }

        });
    }
  }

  ngOnInit(): void {
    let userId;
    this.isLoading = true;

    // Fetch authenticated user and user role
    if (!this.userDataSub) {
      this.userDataSub = this.authService.authenticatedUser.subscribe(
        (user) => {
          if (user) {
            userId = user["id"];
            this.typeOfUser = user["role"];
            this.isLoading = false;
          }
        }
      );
    }

    // Fetch organization documents as in ionViewWillEnter (to make sure data loads properly)
    if (!this.fetchUserDataSub) {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(userId)
        .subscribe((userData) => {
          if (userData) {
            // this.farms = userData.farms;

            // this.farms = userData.farms.filter((farm) => {
            //   console.log('User ID;', farm.organization.parentOrganization.id, this.admins[0]);
            //   farm.organization.parentOrganization.id === this.admins[0]?.user?.id
            // });

            this.selectedFarm = "All Farms";
            this.userService.setFarmId("All Farms");

            const uniqueParentOrganizations = Array.from(
              new Map(
                userData.farms.map((farm) => [
                  farm.organization.parentOrganization.id,
                  farm.organization.parentOrganization,
                ])
              ).values()
            );
            this.admins = uniqueParentOrganizations;

            // Select first admin if available
            if (this.admins.length > 0) {
              this.selectedAdmin = this.admins[0]?.name;
              this.userService.setAdminId(this.admins[0]?.user?.id);

              this.farms = userData.farms.filter((farm) => {
                return farm?.organization?.parentOrganization?.user?.id === this.admins[0]?.user?.id
              });

            }
          }
        });
    }
  }


  async onClickLogout() {
    await this.authService.logout();
  }

  handleInput(event: any) {
    this.results = [];
    this.animals = [];
    const query = event.target.value.toLowerCase();

    this.getAllAnimalsSub = this.userService.userData.subscribe((data) => {
      const animalArray = data.animals;
      this.animals = [...this.animals, ...animalArray];
      this.results = this.animals;
    });

    if (query.length == 0) {
      this.animals = [];
      this.results = [];
    } else if (!this.animals || this.animals.length === 0) {
      this.results = [];
      return;
    }

    this.results = this.animals.filter((item) => {
      return Object.values(item).some((value: any) => {
        if (value && typeof value === "string") {
          return value.toLowerCase().includes(query);
        } else if (value && typeof value === "object") {
          return Object.values(value).some((nestedValue: any) => {
            if (nestedValue && typeof nestedValue === "string") {
              return nestedValue.toLowerCase().includes(query);
            }
            return false;
          });
        }
        return false;
      });
    });
  }

  onClickAnimal(animalId: any) {
    this.router
      .navigate(["/farm", "dashboard","charts", animalId], {
        replaceUrl: true,
        state: { clearHistory: true },
      })
      .then(() => {
        this.closeSearchModal();
      });
  }

  closeSearchModal() {
    this.searchModal.dismiss().then();
    if (this.searchbar) {
      this.searchbar.value = null;
      this.animals = null;
      this.results = null;
    }
  }

  onBlurSearchBar() {
    console.log("Modal Dismissed");
    if (this.searchbar) {
      this.searchbar.value = null;
      this.animals = null;
      this.results = null;
    }
  }

  async onClickLanguage() {
    const alert = await this.actionSheetContoller.create({
      header: "Select Language",
      buttons: [
        {
          text: "English",
          data: { language: "en" },
          handler: () => {
            const data = (alert.buttons[0] as ActionSheetButton).data.language;
            localStorage.setItem("language", data);
            this.language = data;
            console.log("Changed to Language: ", this.language);
            window.location.reload();
          },
        },
        {
          text: "हिंदी",
          data: { language: "hi" },
          handler: () => {
            const data = (alert.buttons[1] as ActionSheetButton).data.language;
            localStorage.setItem("language", data);
            this.language = data;
            console.log("Changed to Language: ", this.language);
            window.location.reload();
          },
        },
        {
          text: "ಕನ್ನಡ",
          data: { language: "ka" },
          handler: () => {
            const data = (alert.buttons[2] as ActionSheetButton).data.language;
            localStorage.setItem("language", data);
            this.language = data;
            console.log("Changed to Language: ", this.language);
            window.location.reload();
          },
        },
      ],
    });

    await alert.present();
  }

  async onSelectFarm(event: CustomEvent) {
    this.isLoading = true;
    const selectedFarm = event.detail.value;

    if (selectedFarm === "All Farms") {
      this.selectedFarm = "All Farms";
      this.userService.setFarmId("All Farms");
      console.log("Farm Selected: All Farms");
    } else {
      const { id: farmId, name: farmName } = selectedFarm;
      this.selectedFarm = farmName;
      this.userService.setFarmId(farmId);
      console.log("Farm Selected:", farmName);
    }

    this.isLoading = false;
  }

  async onSelectAdmin(event: CustomEvent) {
    this.isLoading = true;
    const selectedAdmin = event.detail.value;

    const adminId = selectedAdmin.user.id;

    this.selectedAdmin = selectedAdmin.name;
    this.userService.setAdminId(adminId);
    localStorage.setItem("selected_admin", adminId);

    this.fetchUserDataSub = this.userService
      .fetchOrganizationDocuments(adminId)
      .subscribe((data) => {
        if (data) {
          this.farms = data.farms;
          console.log("All Farms :", data.farms);
          this.selectedFarm = "All Farms";
          this.userService.setFarmId("All Farms");
        }

        this.isLoading = false;
      });
  }
}
