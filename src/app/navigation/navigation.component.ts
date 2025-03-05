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

  fetchUserDataSub: Subscription | undefined;
  userDataSub: Subscription | undefined;
  getAllAnimalsSub: Subscription | undefined;
  getFarmAnimalsSub: Subscription | undefined;
  results: any[] = [];
  animals: any[] = [];
  farms: any[] = [];
  admins: any[] = [];

  sortOrders = {};
  searchToggle: boolean = false;
  isLoading: boolean = false;
  language: string = "en";
  typeOfUser: string | undefined;
  selectedAdmin: string | undefined;
  selectedFarm: string | undefined;

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

  // ngOnInit(): void {
  //   this.isLoading = true;
  //   this.userDataSub = this.authService.authenticatedUser.subscribe((user) => {
  //     if (user) {
  //       this.typeOfUser = user['role'];
  //       this.loadOrganizationData(user['id']);
  //     } else {
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   if (this.userDataSub) {
  //     this.userDataSub.unsubscribe();
  //   }
  //   if (this.fetchUserDataSub) {
  //     this.fetchUserDataSub.unsubscribe();
  //   }
  // }

  // private loadOrganizationData(userId: string): void {
  //   this.fetchUserDataSub = this.userService.fetchOrganizationDocuments(userId).subscribe((data) => {
  //     if (data) {
  //       this.farms = data.farms;
  //       this.admins = this.extractUniqueAdmins(data.farms);
  //       this.restoreAdminId(); // Restore adminId before setting initial selections.
  //       this.setInitialSelections();
  //       this.handleUserRoles(userId);
  //     }
  //     this.isLoading = false;
  //     console.log('All Admins: ', this.admins);
  //     console.log('All Farms: ', this.farms);
  //   });
  // }

  // private extractUniqueAdmins(farms: any[]): any[] {
  //   return Array.from(
  //     new Map(
  //       farms.map((farm) => [
  //         farm.organization.parentOrganization.id,
  //         farm.organization.parentOrganization,
  //       ])
  //     ).values()
  //   );
  // }

  // private setInitialSelections(): void {
  //   if (this.farms.length > 0) {
  //     this.selectedFarm = this.farms[0]?.name || 'All Farms';
  //     this.userService.setFarmId(this.farms[0]?.id || 'All Farms');
  //   }

  //   if (this.admins.length > 0 && !this.selectedAdmin) {
  //     this.selectedAdmin = this.admins[0]?.name;
  //     this.userService.setAdminId(this.admins[0]?.user?.id);
  //     localStorage.setItem('adminId', this.admins[0]?.user?.id);
  //   }
  // }

  // private handleUserRoles(userId: string): void {
  //   if (this.typeOfUser === 'SUPER_ADMIN' && this.admins.length > 0) {
  //     this.fetchUserDataSub = this.userService
  //       .fetchOrganizationDocuments(this.admins[0]?.user?.id)
  //       .subscribe((superAdminData) => {
  //         if (superAdminData) {
  //           this.selectedFarm = 'All Farms';
  //           this.userService.setFarmId('All Farms');
  //           this.farms = superAdminData.farms;
  //         }
  //       });
  //   }

  //   if (this.typeOfUser === 'USER') {
  //     this.fetchUserDataSub = this.userService.fetchOrganizationDocuments(userId).subscribe((userData) => {
  //       if (userData) {
  //         this.selectedFarm = 'All Farms';
  //         this.userService.setFarmId('All Farms');
  //         this.farms = userData.farms;
  //       }
  //     });
  //   }
  // }

  // private restoreAdminId(): void {
  //   const storedAdminId = localStorage.getItem('adminId');
  //   if (storedAdminId) {
  //     const foundAdmin = this.admins.find((admin) => admin?.user?.id === storedAdminId);
  //     if (foundAdmin) {
  //       this.selectedAdmin = foundAdmin.name;
  //       this.userService.setAdminId(storedAdminId);
  //     } else {
  //       localStorage.removeItem('adminId'); // Remove invalid adminId from localStorage.
  //     }
  //   }
  // }




  ngOnInit(): void {
    this.isLoading = true;
    this.userDataSub = this.authService.authenticatedUser.subscribe((user) => {
      if (user) {
        this.typeOfUser = user['role'];
        this.loadOrganizationData(user['id']);
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }
  }

  private loadOrganizationData(userId: string): void {
    this.fetchUserDataSub = this.userService.fetchOrganizationDocuments(userId).subscribe(
      (data) => {
        if (data) {
          this.farms = data.farms;
          this.admins = this.extractUniqueAdmins(data.farms);
          this.setInitialSelections();
          this.handleUserRoles(userId);
        }
        this.isLoading = false;
        console.log('All Admins: ', this.admins);
        console.log('All Farms: ', this.farms);
      },
      (error) => {
        console.error('Error loading organization data:', error);
        this.isLoading = false;
      }
    );
  }

  private extractUniqueAdmins(farms: any[]): any[] {
    return Array.from(
      new Map(
        farms.map((farm) => [
          farm.organization.parentOrganization.id,
          farm.organization.parentOrganization,
        ])
      ).values()
    );
  }

  private setInitialSelections(): void {
    if (this.farms.length > 0) {
      this.setFarmSelection(this.farms[0]?.id || 'All Farms', this.farms[0]?.name || 'All Farms');
    }

    const storedAdminId = this.userService.getStoredAdminId();
    if (this.admins.length > 0) {
      const initialAdmin = storedAdminId
        ? this.admins.find((admin) => admin?.user?.id === storedAdminId)
        : this.admins[0];

      if (initialAdmin) {
        this.setAdminSelection(initialAdmin.user.id, initialAdmin.name);
      }
    }
  }

  private handleUserRoles(userId: string): void {
    if (this.typeOfUser === 'SUPER_ADMIN' && this.admins.length > 0) {
      this.fetchUserDataSub = this.userService
        .fetchOrganizationDocuments(this.admins[0]?.user?.id)
        .subscribe((superAdminData) => {
          if (superAdminData) {
            this.setFarmSelection('All Farms', 'All Farms');
            this.farms = superAdminData.farms;
          }
        });
    } else if (this.typeOfUser === 'USER') {
      this.fetchUserDataSub = this.userService.fetchOrganizationDocuments(userId).subscribe((userData) => {
        if (userData) {
          this.setFarmSelection('All Farms', 'All Farms');
          this.farms = userData.farms;
        }
      });
    }
  }

  // adminChanged(admin: any): void {
    // this.setAdminSelection(admin.user.id, admin.name);
  // }

  private setFarmSelection(farmId: string, farmName: string): void {
    this.selectedFarm = farmName;
    this.userService.setFarmId(farmId);
  }

  private setAdminSelection(adminId: string, adminName: string): void {
    this.selectedAdmin = adminName;
    this.userService.setAdminId(adminId);
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
      // localStorage.setItem('farmId', "All Farms");
      console.log("Farm Selected: All Farms");
    } else {
      const { id: farmId, name: farmName } = selectedFarm;
      this.selectedFarm = farmName;
      this.userService.setFarmId(farmId);
      // localStorage.setItem('farmId', farmId);
      console.log("Farm Selected:", farmName);
    }

    this.isLoading = false;
  }

  async onSelectAdmin(event: CustomEvent) {
    this.isLoading = true;
    const selectedAdmin = event.detail.value;

    const adminId = selectedAdmin.user.id;

    this.selectedAdmin = selectedAdmin.name;

    this.setAdminSelection(selectedAdmin.user.id, selectedAdmin.name);

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



  // onSelectFarm(event: CustomEvent): void {
  //   this.isLoading = true;
  //   const selectedFarm = event.detail.value;
  
  //   if (selectedFarm === "All Farms") {
  //     this.userService.setFarmId("All Farms");
  //   } else {
  //     this.userService.setFarmId(selectedFarm);
  //   }
  
  //   this.isLoading = false;
  // }
  
  // onSelectAdmin(event: CustomEvent): void {
  //   this.isLoading = true;
  //   const selectedAdmin = event.detail.value;
  //   const adminId = selectedAdmin.user.id;
  
  //   this.userService.setAdminId(adminId);
  
  //   if (this.fetchUserDataSub) {
  //     this.fetchUserDataSub.unsubscribe(); // Unsubscribe previous subscription
  //   }
  
  //   this.fetchUserDataSub = this.userService
  //     .fetchOrganizationDocuments(adminId)
  //     .subscribe(
  //       (data) => {
  //         if (data) {
  //           this.farms = data.farms;
  //           this.userService.setFarmId("All Farms");
  //         }
  //         this.isLoading = false;
  //       },
  //       (error) => {
  //         console.error("Error fetching organization documents:", error);
  //         this.isLoading = false;
  //       }
  //     );
  // }

}
